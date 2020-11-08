import React, {useContext, useEffect, useRef} from "react";
import ForceGraph2D, {LinkObject} from "react-force-graph-2d";
import {Modal, StyleSheet, Text, View} from "react-native";
import {Game, getFastestTravel, User,} from "./App";
import {ThiefMoves} from "./ThiefMoves";
import {FAST_COLOR, MEDIUM_COLOR, SLOW_COLOR} from "./styles";
import {GameState, MapNode, PlayerTypes, TransportTypes} from "./models";
import {API, graphqlOperation} from "aws-amplify";
import {onGameStateChange} from "./queries";

function getColor(t: TransportTypes) {
  switch (t) {
    case TransportTypes.slow:
      return SLOW_COLOR;
    case TransportTypes.medium:
      return MEDIUM_COLOR;
    case TransportTypes.fast:
      return FAST_COLOR;
  }
}

function drawLink(linkObject: LinkObject) {
  return getColor(getFastestTravel(linkObject));
}

const pageStyles = StyleSheet.create({
  container: {
    // height: '100vh',
    // width: '100vw'
  }
});

export const GameOverPanel = ({game}: { game: GameState }) => {
  let isGameOver = !!game.gameStatus?.winner;
  return (isGameOver ?
      <Modal visible={isGameOver}>
        <Text>{game.gameStatus?.winner === "Cops" ? 'Cops win!' : 'Thief wins!'}</Text>
      </Modal> : <Text></Text>
  );
}

const currentTurnStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    color: '#aaaaaa',
    fontSize: 30
  }
});

export const CurrentTurn = () => {
  const {game} = useContext(Game);
  const {username} = useContext(User);
  const prompt = game.currentTurn.name === username ? 'Your turn!' : `${game.currentTurn.name}'s turn`
  return <Text style={currentTurnStyles.container}>{prompt}</Text>
}

export const GameBoard = ({}) => {
  const {game, setGame, movePlayer} = useContext(Game);
  const {username} = useContext(User);


  const handleNodeClick = (targetNode: MapNode) => {
    console.log(targetNode);

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
    ctx.fillText(id, x, y);

    // now render players
    if (node.players?.length > 0) {
      let offset = 1;
      for (const player of node.players) {
        let numberOfThiefMoves = game.thiefMoves.length;

        if (!game.gameStatus?.status && player.name !== username) {
          if (player.type === PlayerTypes.thief && numberOfThiefMoves !== 2 && numberOfThiefMoves !== 8) {
            continue;
          }
        }

        // if the player is me, no matter what, render it
        ctx.fillStyle = '#ffffff';
        const playerName = player.name + `${player.type === PlayerTypes.thief ? '(thief)' : ''}`
        const playerSize = playerName.length * 2;
        if (player.name === game.currentTurn.name) {

          ctx.fillStyle = '#00f7ff';
          ctx.fillRect(x - playerSize / 2 - 1, y - 8 - 1, playerSize + 2, 4 + 2);

          ctx.fillStyle = '#000000';
          ctx.fillRect(x - playerSize / 2, y - 8, playerSize, 4);

        }

        ctx.fillStyle = '#ffffff';

        if (player.type === PlayerTypes.thief) {
          ctx.fillStyle = "#fa5454";
        }

        ctx.fillText(playerName, x - (playerSize / 2), y + (-5 * offset));
        offset++;
      }
    }

    // now let's do the cop markers
    // for (const marker of (game.copMarkers ?? [])){
    //   ctx.strokeStyle = '#aaaaaa';
    //   ctx.beginPath();
    //   ctx.arc(marker.x, marker.y, 20, 0, 2 * Math.PI);
    //   ctx.stroke();
    // }
  }

  useEffect(() => {
    const subscriber = API.graphql(graphqlOperation(onGameStateChange, {id: game.id})).subscribe({
      next: (data: any) => {
        const game = data.value.data.onGameStateChange;
        setGame(game);
      }
    });
    return () => subscriber.unsubscribe()
  }, [game]);
  let fgRef = useRef();


  return (<View style={pageStyles.container}>
    <GameOverPanel game={game}/>
    <CurrentTurn/>
    <ThiefMoves/>
    <ForceGraph2D
      ref={fgRef}
      backgroundColor="#000000"
      linkWidth={3}
      enableNodeDrag={false}
      cooldownTicks={0}
      onNodeClick={handleNodeClick}
      nodeCanvasObject={getCanvasObject}
      linkColor={drawLink}
      graphData={game.map}
    />
  </View>);
};