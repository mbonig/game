import React, {useContext, useEffect} from "react";
import {GraphView} from 'react-digraph';
import {StyleSheet, View} from "react-native";
import {FAST_COLOR, MEDIUM_COLOR, SLOW_COLOR} from "./styles";
import {Game, getFastestTravel, User} from "./App";
import {API, graphqlOperation} from "aws-amplify";
import {onGameStateChange} from "./queries";
import {MapNode, Player, PlayerTypes} from "./models";
import {ThiefMoves} from './ThiefMoves';
import {GameOver} from "./GameOver";
import {CurrentTurn} from "./CurrentTurn";
import {PlayerColors, Players} from "./Players";

const GraphConfig = {
  NodeTypes: {
    "1_slow": {
      typeText: "Slow",
      shapeId: "#slow", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="slow" width="100" height="100" fill={SLOW_COLOR}>
          <circle r={20} cx={50} cy={50}/>
        </symbol>
      )
    },
    "1_slow_2_medium": {
      typeText: "Medium",
      shapeId: "#slow_medium", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="slow_medium" width="100" height="100">
          <circle r={20} cx={50} cy={50} fill={MEDIUM_COLOR}/>
          <circle r={10} cx={50} cy={50} fill={SLOW_COLOR}/>
        </symbol>
      )
    },
    "1_slow_2_medium_3_fast": {
      typeText: "Fast",
      shapeId: "#smf", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="smf" width="100" height="100">
          <circle r={30} cx={50} cy={50} fill={FAST_COLOR}/>
          <circle r={20} cx={50} cy={50} fill={MEDIUM_COLOR}/>
          <circle r={10} cx={50} cy={50} fill={SLOW_COLOR}/>
        </symbol>
      )
    },
    "1_slow_3_fast": {
      typeText: "Fast",
      shapeId: "#sf", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="sf" width="100" height="100">
          <circle r={20} cx={50} cy={50} fill={SLOW_COLOR}/>
          <circle r={10} cx={50} cy={50} fill={FAST_COLOR}/>
        </symbol>
      )
    }
  },
  NodeSubtypes: {},
  EdgeTypes: {
    "edge_slow": {
      shapeId: "#edge_slow",
      shape: (
        <symbol viewBox="0 0 100 100" width="100" height="100" fill={SLOW_COLOR} id="edge_slow">
          <circle r={10} cx={50} cy={50}/>
        </symbol>
      )
    },
    "edge_medium": {
      shapeId: "#edge_medium",
      shape: (
        <symbol viewBox="0 0 100 100" width="100" height="100" fill={MEDIUM_COLOR} id="edge_medium">
          <circle r={10} cx={50} cy={50}/>
        </symbol>
      )
    },
    "edge_fast": {
      typeText: "Fast",
      shapeId: "#edge_fast", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" width="100" height="100" fill={FAST_COLOR} id="edge_fast">
          <circle r={10} cx={50} cy={50}/>
        </symbol>
      )
    }
  }
}

const NODE_KEY = "id"

const graph = StyleSheet.create({
  container: {
    height: '100%'
  },

  nodeText: {
    fontFamily: 'sans-serif',
    fontSize: 26,
    fill: 'white',
    fontWeight: "bold"
  }
});

export function GameScreen({navigation}) {
  const {game, movePlayer, setGame} = useContext(Game);
  const {username} = useContext(User);
  const handleNodeClick = (node) => {
    if (!node) {
      return;
    }
    movePlayer(node);
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

  const newEdges = game.map.links.map(l => {
    const source = game.map.nodes.find(n => n.id === l.source);
    const target = game.map.nodes.find(n => n.id === l.target);
    const fastestTravel = getFastestTravel({source, target});
    const edgeType = "edge_" + fastestTravel.toString().replace(/[0-9]_/i, '')

    return {
      ...l,
      type: edgeType
    }
  });

  const getNodeType = (node: MapNode) => node.type.sort().join("_");

  const newNodes = game.map.nodes.map((n: any) => {
    n.title = n.players.map(x => x.name).join(', ');
    n.x = n.fx;
    n.y = n.fy;
    n.type = getNodeType(n);
    return n;
  })

  const renderNodeText = (data: MapNode) => {
    const players = data.players;
    const thief = data.players.find(x => x.type === PlayerTypes.thief)!;

    let showThief = false;
    if (thief) {
      if (!!game.gameStatus?.status) {
        showThief = true;
      } else {
        if (thief.name === username) {
          // always show yourself if you're the thief
          showThief = true;
        } else if ([2, 7, 12, 17].includes(game.thiefMoves.length)) {
          showThief = true;
        }
      }
    }

    let offset = -1;
    return players.map(player => {
      offset++;
      if (player.type === PlayerTypes.thief && !showThief) {
        return;
      }
      const playerIndex = game.players.findIndex((x: Player) => x.name === player.name);
      const color = PlayerColors[playerIndex];

      return (<text
        key={player.name}
        y={40 + (offset * 30)}
        style={{
          fontFamily: 'sans-serif',
          fontSize: 26,
          fill: color,
          fontWeight: "bold",
        }}
        textAnchor="middle">{player.name}</text>);
    });
  };

  const afterRenderEdge = (id, element, edge, edgeContainer, isEdgeSelected) => {
    const edge1 = edgeContainer.querySelector('.edge');
    edge1.style.stroke = "#aaaaaa";
  };

  return (
    <View style={graph.container}>
      <svg viewBox="0 0 0 0" style={{height: 0}}>
        <pattern id="fill" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5"></rect>
        </pattern>
      </svg>
      <GameOver navigation={navigation}/>
      <CurrentTurn/>
      <ThiefMoves/>
      <Players/>
      <GraphView
        nodeKey={NODE_KEY}
        nodes={newNodes}
        edges={newEdges}
        nodeTypes={GraphConfig.NodeTypes}
        nodeSubtypes={GraphConfig.NodeSubtypes}
        edgeTypes={GraphConfig.EdgeTypes}
        edgeArrowSize={0}
        renderNodeText={renderNodeText}
        // renderNode={renderNode}
        onSelectNode={handleNodeClick}
        afterRenderEdge={afterRenderEdge}
        backgroundFillId="#fill"
        readOnly={true}
      />
    </View>
  );
}