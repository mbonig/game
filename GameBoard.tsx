import React, {useContext} from "react";
import ForceGraph2D from "react-force-graph-2d";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {Game, getFastestTravel, MapLink, MapNode, Player, PlayerTypes, TransportTypes} from "./App";

function getColor(t: TransportTypes) {
  switch (t) {
    case TransportTypes.slow:
      return '#fdf919';
    case TransportTypes.medium:
      return '#009900';
    case TransportTypes.fast:
      return '#8519ac';

  }
}

function drawLink(node: MapLink) {
  return getColor(getFastestTravel(node));
}

const ThiefMoveItem = (item) => {
  let itemStyle;
  let moveType;
  switch (item.item as TransportTypes) {
    case TransportTypes.slow:
      itemStyle = styles.slow;
      moveType = 'slow';
      break;
    case TransportTypes.medium:
      itemStyle = styles.medium;
      moveType = 'medium';
      break;
    case TransportTypes.fast:
      itemStyle = styles.fast;
      moveType = 'fast';
      break;

  }
  return (<Text style={[styles.item, itemStyle]}>{moveType}</Text>);
}

const ThiefMoves = () => {
  const {game} = useContext(Game);
  const thiefMoves = game.thiefMoves;
  return (<FlatList style={styles.container} data={thiefMoves} renderItem={ThiefMoveItem}></FlatList>);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#111111'
  },
  item: {
    padding: 10,
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

export const GameBoard = (props) => {
  const {game, movePlayer} = useContext(Game);

  const handleNodeClick = (targetNode) => {
    movePlayer(targetNode);
  };
  const getCanvasObject = (node: MapNode, ctx: any) => {
    const {id, type, x, y} = node;
    const types = Array.isArray(type) ? type : [type];
    ctx.fillStyle = '#ffffff';
    ctx.font = '4px serif';
    for (const t of types) {
      ctx.strokeStyle = getColor(t);
      switch (t) {
        case TransportTypes.slow:
          ctx.beginPath();

          ctx.lineWidth = 0.5;
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.closePath();
          break;
        case TransportTypes.medium:
          ctx.beginPath();

          ctx.lineWidth = 0.75;
          ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.closePath();
          break;
        case TransportTypes.fast:
          ctx.beginPath();

          ctx.strokeWidth = 1;
          ctx.arc(x, y, 3.25, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.closePath();
          break;
      }
    }
    // ctx.fillText(id, x, y);

    // now render players
    if (node.players?.length > 0) {
      let offset = 0;
      for (const player of node.players) {
        ctx.fillText(player.name + `${player.type === PlayerTypes.thief ? '(thief)' : ''}`, x, y + (10 * offset));
        offset++;
      }
    }

    if (node.players?.find((p: Player) => p.name === game.currentTurn.name)) {
      ctx.fillStyle = '#ffffff';

      ctx.beginPath();

      ctx.lineWidth = 0.5;
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();

      ctx.closePath();
    }
  }
  const prompt = `${game.currentTurn.name}'s turn`;
  return (<View>
    {(!!game.gameStatus?.winner) &&
    <Text>
      {game.gameStatus.winner} wins!
    </Text>}
    <ThiefMoves></ThiefMoves>
    <ForceGraph2D
      backgroundColor="#000000"
      enableNodeDrag={false}
      onNodeClick={handleNodeClick}
      nodeCanvasObject={getCanvasObject}
      linkColor={drawLink}
      graphData={game.map}
    >

    </ForceGraph2D>

  </View>);
};