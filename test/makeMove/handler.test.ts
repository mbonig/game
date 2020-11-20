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
}

describe('make move', () => {
  const GAME_ID = 'someid';
  const game: GameState = {
    copMarkers: [],
    currentTurn: playerOne,
    map: {
      links: [
        {source: "1", target: "2"},
        {source: "1", target: "3"},
      ],
      nodes: [
        {id: "1", players: [playerOne], types: [TransportTypes.slow], x: 1, y: 1},
        {id: "2", players: [], types: [TransportTypes.slow], x: 1, y: 1},
        {id: "3", players: [], types: [TransportTypes.medium], x: 1, y: 1},
        {id: "4", players: [], types: [TransportTypes.fast], x: 1, y: 1},
      ]
    },
    players: [playerOne],
    thiefMoves: [],
    id: GAME_ID
  };
  const testEvent = {
    arguments: {
      id: GAME_ID,
      targetNodeId: "2",
      myself: playerOne.name,
      ticket: 'slow'
    }
  };


  beforeEach(() => {
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
    awsSdkPromiseResponse.mockReturnValueOnce({Item: {...game, players: [newPlayer]}});
    testEvent.arguments.targetNodeId = "2";

    const currentGame = await handler(testEvent);

    expect(db.put).not.toHaveBeenCalled();
    expect(currentGame).toEqual(game);
  });
});
