import React, {useContext} from "react";
import {Modal, StyleSheet, Text, View} from 'react-native';
import {EMPTY_GAME, Game} from "./App";
import {GameState} from "./models";
import {SimpleButton} from "./SimpleButton";

const gameOverStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#111111',

    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    zIndex: 100,
    opacity: 0.8,
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  },
  bigText: {
    color: '#dddddd',
    fontSize: 40
  }
});

export const GameOver = ({navigation}) => {
  const {game, setGame} = useContext(Game);
  if (!game.gameStatus){
    return <View/>;
  }
  const prompt = game.gameStatus?.winner === "Cops" ? 'Cops win!' : 'Thief wins!'
  let closeAndLeave = ()=>{
    setGame(EMPTY_GAME);
    navigation.navigate("Home");
  };
  return <View style={gameOverStyles.container}>
    <Text style={gameOverStyles.bigText}>Game Over!</Text>
    <Text style={gameOverStyles.bigText}>{prompt}</Text>
    <SimpleButton title="Leave" onPress={closeAndLeave}/>
  </View>
}