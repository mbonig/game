import {LinkObject, NodeObject} from "react-force-graph-2d";
import React from "react";

export enum TransportTypes {
  slow = "1_slow",
  medium = "2_medium",
  fast = "3_fast"
}

export enum PlayerTypes {
  thief = "thief",
  cop = "cop"
}

export interface Player {
  name: string;
  type?: PlayerTypes;
}

export interface MapNode extends NodeObject {
  id: String;
  x: number;
  y: number;
  type: TransportTypes[];
  players: Player[];
}

export interface GameStatus {
  status: string;
  winner: string;
}

export interface GameState {
  id: String;
  gameStatus: GameStatus;
  thiefMoves: TransportTypes[];
  players: Player[];
  currentTurn: Player;
  map: {
    links: MapLink[];
    nodes: MapNode[];
  };
  copMarkers: any[];

}


export interface MapLink extends LinkObject {
  source: String;
  target: String;
}