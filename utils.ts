import {MapLink, MapNode, TransportTypes} from "./models";
import {useEffect, useState} from "react";

export function getTravel(link: any) {
  const {source: {types: sourceTypes}, target: {types: targetTypes}} = link;
  let a = new Set(sourceTypes);
  let b = new Set(targetTypes);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse()[0];
}

export interface Map {
  nodes: MapNode[];
  edges: MapLink[];
}

function defaultNodes(nodes: MapNode[]): MapNode[] {
  return nodes.map(n => ({...n, type: 'empty'}));
}

export function generateGraph(): Map {
  return {
    nodes: defaultNodes([
      {id: "1", types: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast], players: []},
      {id: "2", types: [TransportTypes.slow], players: []},
      {id: "3", types: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: "4", types: [TransportTypes.fast, TransportTypes.slow], players: []},
      {id: "5", types: [TransportTypes.fast, TransportTypes.medium, TransportTypes.slow], players: []},
      {id: "6", types: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: "7", types: [TransportTypes.fast, TransportTypes.slow], players: []},
      {id: "8", types: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: "9", types: [TransportTypes.slow], players: []},
      {id: "10", types: [TransportTypes.medium, TransportTypes.slow], players: []},
    ]),
    edges: [
      {source: "1", target: "2"},
      {source: "1", target: "3"},
      {source: "2", target: '3'},
      {source: "2", target: "4"},
      {source: "4", target: '5'},
      {source: "5", target: '6'},
      {source: "3", target: '7'},
      {source: "5", target: '7'},
      {source: "8", target: '4'},
      {source: "8", target: '6'},
      {source: "9", target: '10'},
      {source: "3", target: '10'},
      {source: "9", target: '6'},
      {source: "9", target: '5'},
    ]
  };
}


export const useLocalStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const useSessionStorage = (key, defaultValue) => {
  const stored = sessionStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};