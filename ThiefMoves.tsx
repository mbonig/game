import React, {useContext} from "react";
import {FlatList, StyleSheet, Text} from "react-native";
import {TransportTypes} from "./models";
import {Game} from "./App";
import {SHOW_INDEXES} from "./GameScreen";
import {BLACK_COLOR, FAST_COLOR, MEDIUM_COLOR, SLOW_COLOR} from "./styles";

const ThiefMoveItem = (setHighlightedNode) => ({item, index}) => {
  let itemStyle;
  let moveType;
  switch (item.type) {
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
    case "black":
      itemStyle = thiefMovesStyles.black;
      moveType = 'B';
      break;

  }

  const onPress = () => {
    setHighlightedNode({...item, id: (+item.nodeId)});
  }
  if (SHOW_INDEXES.includes(index + 1)) {
    return (<Text onPress={onPress}
                  style={[thiefMovesStyles.item, itemStyle, thiefMovesStyles.highlighted]}>{moveType}</Text>);
  }
  return (<Text style={[thiefMovesStyles.item, itemStyle]}>{moveType}</Text>);
}

export const ThiefMoves = () => {
  const {game, setHighlightedNode} = useContext(Game);
  return (<FlatList
    horizontal={false}
    style={thiefMovesStyles.container}
    data={game.thiefMoves}
    renderItem={ThiefMoveItem(setHighlightedNode)}
    keyExtractor={(item, index) => index.toString()}/>);
}


const thiefMovesStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#111111',
    position: "absolute",
    top: 144,
    left: 0,
    zIndex: 100
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
  },
  black: {
    color: BLACK_COLOR
  },
  highlighted: {
    backgroundColor: '#4e4e4e'
  }
});