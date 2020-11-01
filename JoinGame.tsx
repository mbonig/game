import {Button, Text, TextInput, View} from "react-native";
import React, {useContext, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {joinGame} from "./graphql/mutations";
import {Game, User} from "./App";
import {styles} from "./styles";

export const JoinGame = ({navigation}) => {
  const {setGame} = useContext(Game);
  const [gameId, setGameId] = useState("4go6qm");
  const {username} = useContext(User);

  async function onJoinGame() {
    const {data} = await API.graphql(graphqlOperation(joinGame, {id: gameId, myself: username}));
    setGame(data.joinGame);
    navigation.navigate('Waiting Room');
  }

  return (
    <View style={styles.centered}>
      <Text>Enter Game Id</Text>
      <TextInput onChangeText={setGameId} value={gameId}/>
      <Button title="Join" onPress={onJoinGame}/>
    </View>);
};