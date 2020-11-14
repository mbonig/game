import React, {useContext} from "react";
import {Game} from "./App";
import {FlatList, StyleSheet, Text} from "react-native";


const playerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    padding: 10
  },
  player: {
    marginHorizontal: 10,
    fontSize: 16
  },
  current: {
    fontSize: 24,
    fontWeight: "bold"
  }
});

export const PlayerColors = [
  '#d92e2e',
  '#70d92e',
  '#2e5ed9',
  '#d96a2e',
  '#2ed9b1',
  '#d9bd2e',
  '#752ed9',

]

export const Players = () => {
  const {game} = useContext(Game);
  const players = game.players;
  const currentTurn = game.currentTurn;

  const Player = ({item, index}) => {
    let isCurrent = null;
    if (currentTurn.name === item.name){
      isCurrent = playerStyles.current
    }
    return <Text style={[playerStyles.player, isCurrent, {color: PlayerColors[index]}]}>{item.name}{item.type === 'thief' && " (Thief)"}</Text>
  }
  return (<FlatList
    horizontal={true}
    style={playerStyles.container}
    data={players}
    renderItem={Player}
    keyExtractor={(item, index) => index.toString()}/>);
};