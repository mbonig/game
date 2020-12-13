import {Text, TextInput, View} from "react-native";
import React, {useContext, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {Game, User} from "./App";
import {styles} from "./styles";
import {joinGame} from "./queries";
import {SimpleButton} from "./SimpleButton";
import {useSessionStorage} from "./utils";

export const JoinGame = ({navigation}) => {
  const {setGame} = useContext(Game);
  const [lastGameId] = useSessionStorage("lastGameId", "");
  const [gameId, setGameId] = useState(lastGameId);
  const {username} = useContext(User);

  async function onJoinGame() {
    const {data} = await API.graphql(graphqlOperation(joinGame, {id: gameId, myself: username}));
    setGame(data.joinGame);
    navigation.navigate('Waiting Room');
  }

  return (
    <View style={styles.centered}>
      <Text style={{fontSize: 20, margin: 20}}>Enter Game Id</Text>
      <TextInput style={{
        fontSize: 20,
        margin: 20,
        borderColor: '#333333',
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        padding: 5
      }}
                 onChangeText={setGameId} value={gameId}/>
      <SimpleButton title="Join" onPress={onJoinGame}/>
    </View>);
};