import {awsSdkPromiseResponse, DynamoDB} from '../__mocks__/aws-sdk';
import {GameState, Player, PlayerTypes, TransportTypes} from "../../models";

const TEST_TABLE = 'TEST_TABLE';
process.env.TABLE = TEST_TABLE;

const {handler} = require('../../amplify/backend/function/makemove/src/');

const db = new DynamoDB.DocumentClient();

const playerOne: Player = {
  name: "Matt",
  type: PlayerTypes.thief,
  tickets: {
    black: 10,
    fast: 10,
    medium: 10,
    slow: 10
  }
};

const playerTwo: Player = {
  name: "Zach",
  type: PlayerTypes.cop,
  tickets: {
    black: 0,
    fast: 10,
    medium: 10,
    slow: 10
  }
};

describe('make move', () => {
  const GAME_ID = 'someid';
  let game: GameState;
  const testEvent = {
    arguments: {
      id: GAME_ID,
      targetNodeId: "2",
      myself: playerOne.name,
      ticket: 'slow'
    }
  };


  beforeEach(() => {

    game = {
      copMarkers: [],
      currentTurn: playerOne,
      map: {
        links: [
          {source: "1", target: "2"},
          {source: "1", target: "3"}
        ],
        nodes: [
          {id: "1", type: '', players: [playerOne], types: [TransportTypes.slow, TransportTypes.medium], x: 1, y: 1},
          {id: "2", type: '', players: [playerTwo], types: [TransportTypes.slow], x: 1, y: 1},
          {id: "3", type: '', players: [], types: [TransportTypes.medium], x: 1, y: 1},
          {id: "4", type: '', players: [], types: [TransportTypes.fast], x: 1, y: 1},
        ],
      },
      players: [playerOne, playerTwo],
      thiefMoves: [],
      id: GAME_ID
    };
    awsSdkPromiseResponse.mockReturnValueOnce({Item: game});

  });

  afterEach(() => {
    awsSdkPromiseResponse.mockReset();
  });

  it('does nothing if not my turn', async () => {
    const testEvent = {arguments: {id: GAME_ID, targetNodeId: {}, myself: 'testuser', ticket: 'slow'}};

    const currentGame = await handler(testEvent);

    expect(db.put).not.toHaveBeenCalled();
    expect(currentGame).toEqual(game);
  });

  it("does nothing if turn isn't valid because nodes aren't connected", async () => {
    testEvent.arguments.targetNodeId = "4";
    const currentGame = await handler(testEvent);

    expect(db.put).not.toHaveBeenCalled();
    expect(currentGame).toEqual(game);
  });

  it("does nothing if turn isn't valid because out of tickets", async () => {
    awsSdkPromiseResponse.mockReset();
    let newPlayer = {...playerOne};
    newPlayer.tickets.slow = 0;
    let existingGame = {...game, players: [newPlayer]};
    awsSdkPromiseResponse.mockReturnValueOnce({Item: existingGame});
    testEvent.arguments.targetNodeId = "2";

    const currentGame = await handler(testEvent);

    expect(db.put).not.toHaveBeenCalled();
    expect(currentGame).toEqual(existingGame);
  });

  it("reduces ticket used", async () => {
    awsSdkPromiseResponse.mockReset();
    let newPlayer = {...playerOne};
    newPlayer.tickets.slow = 3;
    awsSdkPromiseResponse.mockReturnValueOnce({Item: {...game, players: [newPlayer]}});
    testEvent.arguments.targetNodeId = "2";

    const currentGame = await <GameState>handler(testEvent);

    expect(db.put).toHaveBeenCalled();
    expect(currentGame.players[0].tickets.slow).toEqual(2);
  });

  it("reduces ticket used when multiple choices", async () => {
    awsSdkPromiseResponse.mockReset();
    let newPlayer = {...playerOne};
    newPlayer.tickets.medium = 3;
    awsSdkPromiseResponse.mockReturnValueOnce({Item: {...game, players: [newPlayer]}});
    testEvent.arguments.targetNodeId = "3";
    testEvent.arguments.ticket = '';

    const currentGame = await <GameState>handler(testEvent);

    expect(db.put).toHaveBeenCalled();
    expect(currentGame.players[0].tickets.medium).toEqual(2);
  });

  const noTickets = {
    fast: 0,
    slow: 0,
    medium: 0
  }

  it("any player move passes if doesn't have the tickets to move anywhere", async () => {
    awsSdkPromiseResponse.mockReset();
    const newPlayer = {...playerOne, tickets: noTickets};
    const existingGame = {...game, players: [newPlayer, playerTwo]};
    awsSdkPromiseResponse.mockReturnValueOnce({Item: existingGame});
    testEvent.arguments.targetNodeId = "3";
    testEvent.arguments.ticket = '';

    const currentGame = await <GameState>handler(testEvent);

    expect(db.put).toHaveBeenCalled();
    expect(currentGame).toEqual({...existingGame, currentTurn: playerTwo});
  });


  it("game is over if all players pass, thief wins", async () => {
    awsSdkPromiseResponse.mockReset();

    let newPlayerOne = {...playerOne, tickets: noTickets};
    let newPlayerTwo = {...playerTwo, tickets: noTickets};
    awsSdkPromiseResponse.mockReturnValueOnce({Item: {...game, players: [newPlayerOne, newPlayerTwo]}});
    testEvent.arguments.targetNodeId = "3";
    testEvent.arguments.ticket = '';

    const currentGame = await <GameState>handler(testEvent);

    expect(db.put).toHaveBeenCalled();
    expect(currentGame.gameStatus).toEqual({status: 'Finished', winner: 'Thief'});
  });

});
