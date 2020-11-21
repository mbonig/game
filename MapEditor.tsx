import React, {useState} from "react";
import {GraphView} from 'react-digraph';
import {StyleSheet, View} from "react-native";
import {GraphConfig} from "./GameScreen";
import {generateGraph, useLocalStorage} from "./utils";
import {Button} from "react-native-elements";
import {MapNode} from "./models";

const styles = StyleSheet.create({
  container: {
    height: "100%"
  }
})
const NODE_KEY = "id"
const graph = generateGraph();

const getNextType = (n?: MapNode) => {
  if (!n) {
    return "1_slow";
  }
  switch (n.type) {
    case "":
      return "1_slow";
    case "1_slow":
      return "1_slow_2_medium";
    case "1_slow_2_medium":
      return "1_slow_2_medium_3_fast";
    case "1_slow_2_medium_3_fast":
      return "1_slow_3_fast";
    case "1_slow_3_fast":
      return "1_slow";
  }
  return "1_slow";
}

export const MapEditor = () => {
  const [nodes, setNodes] = useLocalStorage('nodes', graph.nodes);
  const [edges, setEdges] = useLocalStorage('edges', graph.edges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [singleClicked, setSingleClicked] = useState(false);

  const save = () => {
    console.log({
      nodes,
      edges
    });
  }

  const toggleNode = (node: MapNode) => {
    setSelectedNode(node);
    if (singleClicked) {
      setNodes(nodes.map(n => {
        if (!node || n.id !== node.id) {
          return n;
        }
        n.type = getNextType(n);
        return n;
      }));
    } else {
      setSingleClicked(true);
      setTimeout(() => setSingleClicked(false), 200);
    }
  };

  const randomId = () => {
    return (~~(Math.random() * 20000)).toString();
  };
  const addNode = (x, y, ...args) => {
    console.log({x, y, args});
    setNodes([...nodes, {x, y, id: randomId(), type: getNextType(),}]);
  }
  const addEdge = (source, target) => {
    console.log({source, target});
    setEdges([...edges, {source: source.id, target: target.id}]);
  };

  function deleteNode(node: MapNode) {
    console.log({deletedNode: node})
    setEdges(edges.filter(x => x.source.id !== node.id && x.target.id !== node.id));
    setNodes(nodes.filter(x => x.id !== node.id));
  }

  return <View style={styles.container}>
    <Button onPress={save}>Save</Button>
    <GraphView
      nodeKey={NODE_KEY}
      nodes={nodes}
      edges={edges}
      nodeTypes={GraphConfig.NodeTypes}
      nodeSubtypes={GraphConfig.NodeSubtypes}
      edgeTypes={GraphConfig.EdgeTypes}
      edgeArrowSize={0}
      selected={selectedNode}
      onSelectNode={toggleNode}
      onCreateNode={addNode}
      onDeleteNode={deleteNode}
      onCreateEdge={addEdge}
      onDeleteEdge={(n) => console.log('deleted edge', n)}

    />
  </View>
}