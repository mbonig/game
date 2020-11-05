const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

function checkValidMove(targetNode, currentGame) {

  if (currentGame.gameStatus && currentGame.gameStatus.status) {
    return false;
  }
  const playersCurrentNode = currentGame.map.nodes.find(n => n.players.find(p => p.name === currentGame.currentTurn.name));
  const availableTargetNodes = currentGame.map.links.filter(l => l.source === playersCurrentNode.id || l.target === playersCurrentNode.id)
    .map(l => l.source === playersCurrentNode.id ? l.target : l.source);
  if (availableTargetNodes.find(n => n === targetNode.id)) {
    return true;
  }
  console.log("Couldn't find the target node in the list of availableTargetNodes", {
    targetNode,
    playersCurrentNode,
    availableTargetNodes
  });
  return false;
}

const PlayerTypes = {
  thief: "thief",
  cop: "cop"
};


function checkWinState(targetNode, currentGame) {
  if (targetNode.players.find((p) => p.type === PlayerTypes.thief)) {
    // if anyone is moving to a node where the thief is at, the game is over.
    return {
      status: 'Finished',
      winner: 'Cops'
    };
  }

  if (targetNode.players.find((p) => p.type === PlayerTypes.cop) && currentGame.currentTurn.type === PlayerTypes.thief) {
    // if the thief moves to a node that is occupied, then also game over.
    return {
      status: 'Finished',
      winner: 'Cops'
    };
  }
}

const createCurrentPlayerMapper = (player, targetNode) => (node) => {
  if (node !== targetNode) {
    node.players = node.players.filter(p => p.name !== player.name) || [];
  } else {
    node.players = [...node.players, player];
  }
  return node;
};

function getFastestTravel(node) {
  const {source: {type: st}, target: {type: tt}} = node;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse()[0];
}


exports.handler = async (event) => {
  console.log({event});
  const {arguments: {id, targetNodeId, myself}} = event;

  const {Item: currentGame} = await ddb.get({Key: {id}, TableName: TABLE}).promise();

  if (currentGame.currentTurn.name !== myself) {
    return currentGame;
  }

  const targetNode = currentGame.map.nodes.find(x => x.id === targetNodeId);

  if (!checkValidMove(targetNode, currentGame)) {
    console.log("Not a valid move", targetNode, currentGame);
    return currentGame;
  }

  const isOver = checkWinState(targetNode, currentGame);

  const sourceNode = currentGame.map.nodes.find((n) => n.players.find((p) => p.name === currentGame.currentTurn.name));
  const moveType = getFastestTravel({target: targetNode, source: sourceNode});
  const isThief = currentGame.currentTurn.type === PlayerTypes.thief;
  let currentIndex = currentGame.players.findIndex(x => x.name === currentGame.currentTurn.name);
  if (currentIndex >= currentGame.players.length - 1) {
    currentIndex = -1;
  }

  let currentPlayer = currentGame.currentTurn;
  let currentMap = currentGame.map;
  const thiefMoves = isThief ? [...(currentGame.thiefMoves || []), {
    type: moveType,
    nodeId: targetNode.id
  }] : currentGame.thiefMoves;
  const newGame = {
    ...currentGame,
    currentTurn: currentGame.players[currentIndex + 1],
    map: {
      nodes: currentMap.nodes.map(createCurrentPlayerMapper(currentPlayer, targetNode)),
      links: [...currentMap.links]
    },
    gameStatus: isOver,
    thiefMoves
  };

  await ddb.put({TableName: TABLE, Item: newGame}).promise();

  return newGame;

};
