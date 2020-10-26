import React, {useContext} from "react";
import {Game, TransportTypes} from "./App";
import {FlatList, StyleSheet, Text} from "react-native";

const ThiefMoveItem = (item) => {
  let itemStyle;
  let moveType;
  switch (item.item as TransportTypes) {
    case TransportTypes.slow:
      itemStyle = thiefMovesStyles.slow;
      moveType = 'S';
      break;
    case TransportTypes.medium:
      itemStyle = thiefMovesStyles.medium;
      moveType = 'M';
      break;
    case TransportTypes.fast:
      itemStyle = thiefMovesStyles.fast;
      moveType = 'F';
      break;
  }
  return (<Text style={[thiefMovesStyles.item, itemStyle]}>{moveType}</Text>);
}
export const ThiefMoves = () => {
  const {game} = useContext(Game);
  const thiefMoves = game.thiefMoves;
  return (<FlatList
    horizontal={true}
    style={thiefMovesStyles.container}
    data={thiefMoves}
    renderItem={ThiefMoveItem}
    keyExtractor={(item, index) => index.toString()}/>);
}
const thiefMovesStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#111111'
  },
  item: {
    padding: 10,
    maxWidth: 30,
    fontSize: 18,
    height: 44,
  },
  slow: {
    color: '#fdf919'
  },
  medium: {
    color: '#009900'
  },
  fast: {
    color: '#8519ac'
  }
});