import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NodeObject} from "react-force-graph-2d";
import {GameBoard} from "./GameBoard";

function generateGraph(): any {
  return {
    nodes: [
      {id: 1, type: [Types.slow, Types.medium, Types.fast]},
      {id: 2, type: [Types.slow]},
      {id: 3, type: [Types.medium, Types.slow]},
      {id: 4, type: [Types.fast, Types.slow]},
    ],
    links: [
      {source: 1, target: 2},
      {source: 1, target: 3},
      {source: 2, target: 3},
    ]
  };
}


export enum Types {
  slow = "1_slow",
  medium = "2_medium",
  fast = "3_fast"
}

export interface MapNode extends NodeObject {
  id: string;
  x: number;
  y: number;
  type: Types[];
}


export const Game = React.createContext({
  game: {},
  addLink: (newLink: string) => {
  }
});


export default function App() {

  const [game, setGame] = useState({
    map: generateGraph(),
    thief: {},
    cops: [],
    turnsLeft: 0
  });

  const addLink = (newLink: any) => {

    setGame((game) => ({
      ...game,
      map: {
        nodes: [...game.map.nodes],
        links: [
          ...game.map.links,
          {
            source: newLink.source,
            target: newLink.target,
          }
        ]
      }
    }));
  };

  return (
    <View style={styles.container}>
      <Game.Provider value={{game, addLink}}>
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
