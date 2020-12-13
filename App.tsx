import 'react-native-gesture-handler';
import React, {useState} from 'react';

import Amplify, {API, graphqlOperation} from 'aws-amplify'
import config from './aws-exports'
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {NewGame} from "./NewGame";
import {GameState, MapNode} from "./models";
import {HomeScreen} from "./Home";
import {WaitingRoom} from "./WaitingRoom";
import {JoinGame} from "./JoinGame";
import {highlightNode as hnQuery, makeMove} from "./queries";
import {FindGame} from "./FindGame";
import {GameScreen} from "./GameScreen";
import {MapEditor} from "./MapEditor";
import {useSessionStorage} from "./utils";

Amplify.configure(config)
const Stack = createStackNavigator();

export const User = React.createContext({
  username: "", setUsername: (username) => {
  }
});

export const EMPTY_GAME: GameState = {
  id: '',
  gameStatus: {
    status: '',
    winner: ''
  },
  players: [],
  map: {nodes: [], links: []},
  thiefMoves: [],
  copMarkers: [],
};
export const Game = React.createContext({
  game: EMPTY_GAME,
  movePlayer: (targetNode: MapNode, ticket: String) => {
  },
  setGame: (game: GameState) => {
  },
  updateGame: (game: GameState) => {
  },
  setNodePosition: (node: MapNode) => {
  },
  setHighlightedNode: (node: MapNode) => {
  }
});
const initialState: GameState = {
  copMarkers: [],
  id: "",
  map: {nodes: [], links: []},
  players: [],
  thiefMoves: []
};

export default function App() {
  const [game, setGame] = useState(initialState);
  const [username, setUsername] = useSessionStorage("username", "");
  const [lastGameId, setLastGameId] = useSessionStorage("lastGameId", "");

  const setGameWrapper = (game) => {
    if (game.id) {
      setLastGameId(game.id)
    }
    setGame(game);
  }

  const movePlayer = (targetNode: MapNode, ticket: string) => {
    API.graphql(graphqlOperation(makeMove, {id: game.id, myself: username, targetNodeId: targetNode.id, ticket}));
  };

  const highlightNode = (targetNode: MapNode) => {
    API.graphql(graphqlOperation(hnQuery, {id: game.id, myself: username, targetNodeId: targetNode.id}));
  }
  const setHighlightedNode = (node: MapNode) => {
    setGame({
      ...game,
      highlightedNode: node
    })
  };

  return (
    <User.Provider value={{username, setUsername}}>
      <Game.Provider value={{game, movePlayer, setGame: setGameWrapper, setHighlightedNode, highlightNode}}>
        <NavigationContainer>
          <Stack.Navigator detachInactiveScreens={true}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="New Game" component={NewGame}/>
            <Stack.Screen name="Waiting Room" component={WaitingRoom}/>
            <Stack.Screen name="Join Game" component={JoinGame}/>
            <Stack.Screen name="Find Game" component={FindGame}/>
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Map Editor"
              component={MapEditor}
              options={{
                headerShown: false,
              }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Game.Provider>
    </User.Provider>
  );

}


