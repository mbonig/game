import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LinkObject, NodeObject} from "react-force-graph-2d";
import {GameBoard} from "./GameBoard";


export enum PlayerTypes {
  thief,
  cop
}

const players = [
  {name: 'zach', type: PlayerTypes.thief},
  {name: 'matt', type: PlayerTypes.cop},
  {name: 'steve', type: PlayerTypes.cop}
];


function generateGraph(): any {
  return {
    nodes: [
      {id: 1, type: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast], players: [players[1]]},
      {id: 2, type: [TransportTypes.slow], players: [players[0]]},
      {id: 3, type: [TransportTypes.medium, TransportTypes.slow], players: [players[2]]},
      {id: 4, type: [TransportTypes.fast, TransportTypes.slow], players: []},
      {id: 5, type: [TransportTypes.fast, TransportTypes.medium, TransportTypes.slow], players: []},
      {id: 6, type: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: 7, type: [TransportTypes.fast, TransportTypes.slow], players: []},
      {id: 8, type: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: 9, type: [TransportTypes.slow], players: []},
      {id: 10, type: [TransportTypes.medium, TransportTypes.slow], players: []},
    ],
    links: [
      {source: 1, target: 2},
      {source: 1, target: 3},
      {source: 2, target: 3},
      {source: 2, target: 4},
      {source: 4, target: 5},
      {source: 5, target: 6},
      {source: 3, target: 7},
      {source: 5, target: 7},
      {source: 8, target: 4},
      {source: 8, target: 6},
      {source: 9, target: 10},
      {source: 3, target: 10},
      {source: 9, target: 6},
      {source: 9, target: 5},

    ]
  };
}

export enum TransportTypes {
  slow = "1_slow",
  medium = "2_medium",
  fast = "3_fast"
}

const initialState = {
  map: generateGraph(),
  players: players,
  currentTurn: players[0],
  turnsLeft: 0,
  thiefMoves: []
};


export interface Player {
  name: string;
  type: PlayerTypes;
}

export interface MapNode extends NodeObject {
  id: string;
  x: number;
  y: number;
  type: TransportTypes[];
  players: Player[];
}

export interface GameStatus {
  status: string;
  winner: string;
}

export interface GameState {
  gameStatus: GameStatus;
  thiefMoves: TransportTypes[];
  players: Player[];
  currentTurn: Player;
  map: {
    links: MapLink[];
    nodes: MapNode[];
  };

}

export const Game = React.createContext({
  game: {
    currentTurn: {name: '', type: ''},
    gameStatus: {
      status: '',
      winner: ''
    },
    map: {nodes: [], links: []},
    thiefMoves: []
  },
  movePlayer: (targetNode: MapNode) => {

  }
});

export default function App() {
  const [game, setGame] = useState(initialState);

  const createCurrentPlayerMapper = (player: Player, targetNode: MapNode) => (node: MapNode) => {
    if (node != targetNode) {
      node.players = node.players.filter(p => p.name !== player.name) ?? [];
    } else {
      node.players = [...node.players, player];
    }
    return node;
  }

  const checkWinState = (targetNode: MapNode, currentGame: GameState): GameStatus | undefined => {
    if (targetNode.players.find((p: Player) => p.type === PlayerTypes.thief)) {
      // if anyone is moving to a node where the thief is at, the game is over.
      return {
        status: 'Finished',
        winner: 'Cops'
      };
    }

    if (targetNode.players.find((p: Player) => p.type === PlayerTypes.cop) && game.currentTurn.type === PlayerTypes.thief) {
      // if the thief moves to a node that is occupied, then also game over.
      return {
        status: 'Finished',
        winner: 'Cops'
      };
    }
  }

  function checkValidMove(targetNode: MapNode, currentGame: GameState): boolean {

    if (currentGame.gameStatus?.status) {
      return false;
    }

    const playersCurrentNode = currentGame.map.nodes.find(n => n.players.find(p => p.name === currentGame.currentTurn.name));
    const availableTargetNodes = currentGame.map.links.filter(l => l.source === playersCurrentNode || l.target === playersCurrentNode)
      .map(l => l.source === playersCurrentNode ? l.target : l.source);
    if (availableTargetNodes.find(n => n === targetNode)) {
      return true;
    }
    return false;
  }

  const movePlayer = (targetNode: MapNode) => {
    setGame((currentGame: GameState) => {

      if (!checkValidMove(targetNode, currentGame)) return currentGame;
      const isOver = checkWinState(targetNode, currentGame);

      const sourceNode = currentGame.map.nodes.find((n: MapNode) => n.players.find((p: Player) => p.name === currentGame.currentTurn.name))
      const moveType = getFastestTravel({target: targetNode, source: sourceNode});
      const isThief = currentGame.currentTurn.type === PlayerTypes.thief;
      let currentIndex = currentGame.players.indexOf(currentGame.currentTurn);
      if (currentIndex >= currentGame.players.length - 1) {
        currentIndex = -1;
      }

      let currentPlayer = currentGame.currentTurn;
      let currentMap = currentGame.map;
      const thiefMoves = isThief ? [...(currentGame.thiefMoves ?? []), moveType] : currentGame.thiefMoves;
      return {
        ...currentGame,
        currentTurn: currentGame.players[currentIndex + 1],
        map: {
          nodes: currentMap.nodes.map(createCurrentPlayerMapper(currentPlayer, targetNode)),
          links: [...currentMap.links]
        },
        gameStatus: isOver,
        thiefMoves
      };
    });
  };

  return (
    <View style={styles.container}>
      <Game.Provider value={{game, movePlayer}}>
        <GameBoard>
        </GameBoard>
      </Game.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const SLOW_COLOR = '#fdf919';
export const MEDIUM_COLOR = '#009900';
export const FAST_COLOR = '#8519ac';


export interface MapLink extends LinkObject {
  source: MapNode,
  target: MapNode
}

export function getFastestTravel(node: LinkObject) {
  const {source: {type: st}, target: {type: tt}} = node;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse()[0];
}