import React, {useContext} from "react";
import {FlatList, StyleSheet, Text} from "react-native";
import {TransportTypes} from "./models";
import {Game} from "./App";

const ThiefMoveItem = ({item}) => {
  let itemStyle;
  let moveType;
  switch (item.type as TransportTypes) {
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
  return (<FlatList
    horizontal={true}
    style={thiefMovesStyles.container}
    data={game.thiefMoves}
    renderItem={ThiefMoveItem}
    keyExtractor={(item, index) => index.toString()}/>);
}


export const SLOW_COLOR = '#fdf919';
export const MEDIUM_COLOR = '#009900';
export const FAST_COLOR = '#8519ac';


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
    color: SLOW_COLOR
  },
  medium: {
    color: MEDIUM_COLOR
  },
  fast: {
    color: FAST_COLOR
  }
});