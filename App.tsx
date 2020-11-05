import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View} from 'react-native';
import {LinkObject} from "react-force-graph-2d";
import {GameBoard} from "./GameBoard";

import Amplify, {API, graphqlOperation} from 'aws-amplify'
import config from './aws-exports'
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {NewGame} from "./NewGame";
import {styles} from "./styles";
import {GameState, MapNode, PlayerTypes, TransportTypes} from "./models";
import {HomeScreen} from "./Home";
import {WaitingRoom} from "./WaitingRoom";
import {JoinGame} from "./JoinGame";
import {makeMove} from "./queries";
import {FindGame} from "./FindGame";

Amplify.configure(config)
const Stack = createStackNavigator();

const players = [
  {name: 'zach', type: PlayerTypes.thief},
  {name: 'matt', type: PlayerTypes.cop},
  {name: 'steve', type: PlayerTypes.cop}
];

export const User = React.createContext({
  username: "", setUsername: (username) => {
  }
});
let defaultValue: GameState = {
  currentTurn: {name: ''},
  gameStatus: {
    status: '',
    winner: ''
  },
  players: [],
  map: {nodes: [], links: []},
  thiefMoves: [],
  copMarkers: []
};
export const Game = React.createContext({
  game: defaultValue,
  movePlayer: (targetNode: MapNode) => {
  },
  setGame: (game: GameState) => {
  },
  updateGame: (game: GameState) => {
  },
  setNodePosition: (node: MapNode) => {
  }
});


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

const initialState = {
  id: "",
  map: generateGraph(),
  players: players,
  currentTurn: players[0],
  turnsLeft: 0,
  thiefMoves: []
};


export default function App() {
  const [game, setGame] = useState(initialState);
  const [username, setUsername] = useState("");


  const movePlayer = (targetNode: MapNode) => {
    API.graphql(graphqlOperation(makeMove, {id: game.id, myself: username, targetNodeId: targetNode.id}));
  };


  const GameScreen = () => (
    <View style={styles.container}>
      <GameBoard>
      </GameBoard>
    </View>
  );


  return (
    <User.Provider value={{username, setUsername}}>
      <Game.Provider value={{game, movePlayer, setGame}}>
        <NavigationContainer>
          <Stack.Navigator detachInactiveScreens={true}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen name="New Game" component={NewGame}/>
            <Stack.Screen name="Waiting Room" component={WaitingRoom}/>
            <Stack.Screen name="Join Game" component={JoinGame}/>
            <Stack.Screen name="Find Game" component={FindGame}/>
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{
                headerStyle: {
                  backgroundColor: '#000000'
                },
                headerTintColor: '#aaaaaa',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#aaaaaa'
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Game.Provider>
    </User.Provider>
  );

}


export function getFastestTravel(node: LinkObject) {
  const {source: {type: st}, target: {type: tt}} = node;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse()[0];
}