import {Text, View} from "react-native";
import Amplify, {API, graphqlOperation} from 'aws-amplify'
import React, {useContext, useEffect} from "react";
import {styles} from "./styles";


import awsExports from './aws-exports';
import {createGame} from "./graphql/mutations";
import {Game, User} from "./App";

Amplify.configure(awsExports);

export const NewGame = ({navigation}) => {
  const {game, setGame} = useContext(Game);
  const {username} = useContext(User);

  useEffect(() => {
    fetchGame()
  }, [])

  async function fetchGame() {
    const {
      data: {
        createGame: game
      }
    } = await API.graphql(graphqlOperation(createGame, {myself: username}));
    setGame(game);
    navigation.navigate('Waiting Room');
  }

  return (
    <View style={styles.centered}>
      <Text style={{fontSize: 20}}>{!game ? 'Creating Game...' : 'Game Created!'}</Text>
    </View>
  );
};