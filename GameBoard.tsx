import React, {useContext} from "react";
import ForceGraph2D from "react-force-graph-2d";
import {Button} from "react-native";
import {Game, MapNode, Types} from "./App";

function getColor(t: Types) {
  switch (t) {
    case Types.slow:
      return '#009900';
      break;
    case Types.medium:
      return '#8519ac';
      break;
    case Types.fast:
      return '#fdf919';
      break;

  }
}

function drawNode(node: MapNode, ctx: any) {
  const {id, type, x, y} = node;
  const types = Array.isArray(type) ? type : [type];
  ctx.fillStyle = '#ffffff';
  ctx.font = '4px serif';
  ctx.fillText(id, x, y);
  for (const t of types) {
    ctx.strokeStyle = getColor(t);
    switch (t) {
      case Types.slow:

        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        break;
      case Types.medium:
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(x, y + 2);
        ctx.lineTo(x + 1.5, y + 4);
        ctx.lineTo(x - 1.5, y + 4);
        ctx.lineTo(x, y + 2);
        ctx.closePath();
        ctx.stroke();
        break;
      case Types.fast:
        ctx.strokeWidth = 0.5;
        ctx.strokeRect(x - 2.5, y - 3.5, 5, 1);
        break;
    }
  }

}

function drawLink(ctx) {
  const {source: {type: st}, target: {type: tt}} = ctx;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set(
    [...a].filter(x => b.has(x)));
  return getColor([...intersection].sort().reverse()[0]);
}

export const GameBoard = (props) => {
  const {game, addLink} = useContext(Game);

  const doUpdate = () => {
    addLink({source: 4, target: 1});
  };

  return (<>
    <Button title="Do Something" onPress={doUpdate}>

    </Button>
    <ForceGraph2D
      backgroundColor="#000000"
      enableNodeDrag={false}
      nodeCanvasObject={drawNode}
      linkColor={drawLink}
      graphData={game.map}
    >

    </ForceGraph2D>

  </>);
};
