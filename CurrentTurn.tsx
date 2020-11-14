import React, {useContext} from "react";
import {Game, User} from "./App";
import {StyleSheet, Text} from "react-native";


const currentTurnStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    color: '#aaaaaa',
    fontSize: 30,
    textAlign: "center"
  }
});


export const CurrentTurn = () => {
  const {game} = useContext(Game);
  const {username} = useContext(User);
  const prompt = game.currentTurn.name === username ? 'Your turn!' : `${game.currentTurn.name}'s turn`
  return <Text style={currentTurnStyles.container}>{prompt}</Text>
}