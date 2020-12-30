import {makeMove} from '../src/main.bot-mover';
import {PlayerTypes, TransportTypes} from "../../models";

describe('api BOT', () => {
  it('first', () => {
    const move = makeMove({
      copMarkers: [],
      host: "",
      id: "",
      map: {
        links: [
          {source: "1", target: "2"},
          {source: "3", target: "2"},
          {source: "1", target: "3"},
        ],
        nodes: [
          {
            id: "1",
            players: [{name: 'player1', type: PlayerTypes.thief, tickets: {black: 1, fast: 1, medium: 1, slow: 1}}],
            type: '',
            types: [TransportTypes.fast, TransportTypes.slow]
          },
          {
            id: "2",
            players: [{name: 'player2', type: PlayerTypes.cop, tickets: {black: 1, fast: 1, medium: 1, slow: 1}}],
            type: '',
            types: [TransportTypes.slow]
          },
          {
            id: "3",
            players: [{name: 'bot1', type: PlayerTypes.cop, tickets: {black: 1, fast: 1, medium: 1, slow: 1}}],
            type: '',
            types: [TransportTypes.slow]
          }
        ]
      },
      players: [],
      status: "",
      thiefMoves: []

    }, 'bot1');

    expect(move.targetNodeId).toEqual("1")
    expect(move.ticket).toEqual("slow")
  })
})