import React, {useContext, useEffect} from "react";
import {GraphView} from 'react-digraph';
import {StyleSheet, View} from "react-native";
import {FAST_COLOR, MEDIUM_COLOR, SLOW_COLOR} from "./styles";
import {Game, getFastestTravel} from "./App";
import {API, graphqlOperation} from "aws-amplify";
import {onGameStateChange} from "./queries";
import {MapNode} from "./models";
import {CurrentTurn} from './GameBoard';
import {ThiefMoves} from './ThiefMoves';

const GraphConfig = {
  NodeTypes: {
    slow: {
      typeText: "Slow",
      shapeId: "#slow", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 80 80" id="1_slow" width="80" height="80" fill={SLOW_COLOR}>
          <circle r={10} cx={40} cy={40}/>
        </symbol>
      )
    },
    medium: {
      typeText: "Medium",
      shapeId: "#medium", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 80 80" id="2_medium" width="80" height="80" fill={MEDIUM_COLOR}>
          <circle r={15} cx={40} cy={40}/>
        </symbol>
      )
    },
    fast: {
      typeText: "Fast",
      shapeId: "#fast", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" width="100" height="100" id="3_fast" fill={FAST_COLOR}>
          <circle cx="50" cy="50" r="25"/>
        </symbol>
      )
    }
  },
  NodeSubtypes: {},
  EdgeTypes: {
    "edge_slow": {
      shapeId: "#edge_slow",
      shape: (
        <symbol viewBox="0 0 80 80" width="80" height="80" fill={SLOW_COLOR} id="edge_slow">
          <circle r={10} cx={40} cy={40}/>
        </symbol>
      )
    },
    "edge_medium": {
      shapeId: "#edge_medium",
      shape: (
        <symbol viewBox="0 0 80 80" width="80" height="80" fill={MEDIUM_COLOR} id="edge_medium">
          <circle r={15} cx={40} cy={40}/>
        </symbol>
      )
    },
    "edge_fast": {
      typeText: "Fast",
      shapeId: "#edge_fast", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" width="100" height="100" fill={FAST_COLOR} id="edge_fast">
          <circle cx="50" cy="50" r="25"/>
        </symbol>
      )
    },
    emptyEdge: {  // required to show empty edges
      shapeId: "#emptyEdge",
      shape: (
        <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">

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


export function GameScreen() {
  const {game, movePlayer, setGame} = useContext(Game);

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
    const transportType = getFastestTravel({source, target});
    const edgeType = "edge_" + transportType.toString().replace(/[0-9]_/i, '')
    return {
      ...l,
      type: edgeType
    }
  })

  const newNodes = game.map.nodes.map(n => {
    n.title = n.players.map(x => x.name).join(', ');
    n.x = n.fx;
    n.y = n.fy;
    return n;
  })

  const renderNode = (nodeRef, node: MapNode, id, selected, hovered) => {
    return (
      node.type.sort().reverse().map(t => (
          <g className="node"
             key={t}
             x={-100 / 2}
             y={-100 / 2}
             width={100}
             height={100}>
            <use
              x={-100 / 2}
              y={-100 / 2}
              width={100}
              height={100}
              xlinkHref={'#' + t}
            />
          </g>
        )
      )
    );
  };
  const renderNodeText = (data: MapNode) => <text y={40}
                                                  style={{
                                                    fontFamily: 'sans-serif',
                                                    fontSize: 26,
                                                    fill: 'white',
                                                    fontWeight: "bold"
                                                  }}
                                                  textAnchor="middle">{data.players.map(x => x.name).join(',')}</text>;

  const afterRenderEdge = (id, element, edge, edgeContainer, isEdgeSelected) => {
    console.log(element, edge);
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
      <ThiefMoves/>
      <CurrentTurn/>
      <GraphView
        nodeKey={NODE_KEY}
        nodes={newNodes}
        edges={newEdges}
        nodeTypes={GraphConfig.NodeTypes}
        nodeSubtypes={GraphConfig.NodeSubtypes}
        edgeTypes={GraphConfig.EdgeTypes}
        edgeArrowSize={0}
        renderNodeText={renderNodeText}
        renderNode={renderNode}
        onSelectNode={handleNodeClick}
        afterRenderEdge={afterRenderEdge}
        backgroundFillId="#fill"
        readOnly={true}
      />
    </View>
  );
}