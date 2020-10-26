import React, {useContext, useRef} from "react";
import ForceGraph2D, {LinkObject} from "react-force-graph-2d";
import {StyleSheet, Text, View} from "react-native";
import {Game, getFastestTravel, MapNode, Player, PlayerTypes, TransportTypes} from "./App";
import {ThiefMoves} from "./ThiefMoves";

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

function drawLink(linkObject: LinkObject) {
  return getColor(getFastestTravel(linkObject));
}


const pageStyles = StyleSheet.create({
  container: {
    // height: '100vh',
    // width: '100vw'
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh'
  }
});

export const GameOverPanel = ({game}) => {
  return (
    !!game.gameStatus?.winner &&
    <Text>
      {game.gameStatus.winner} wins!
    </Text>) || '';
}

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

  let fgRef = useRef();
  return (<View style={pageStyles.container}>
    <GameOverPanel game={game}/>
    <ThiefMoves/>
    <ForceGraph2D
      ref={fgRef}
      backgroundColor="#000000"
      onEngineStop={() => fgRef.current.zoomToFit(40)}
      enableNodeDrag={false}
      onNodeClick={handleNodeClick}
      nodeCanvasObject={getCanvasObject}
      linkColor={drawLink}
      graphData={game.map}
    />
  </View>);
};