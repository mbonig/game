const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

const transportTypeTicketMap = {
  "1_slow": "slow",
  "2_medium": "medium",
  "3_fast": "fast"
}

function getTicketToUse(targetNode, currentGame, ticket) {
  const playersCurrentNode = currentGame.map.nodes.find(n => n.players.find(p => p.name === currentGame.currentTurn.name));

  const transportTypes = getAllTravel({source: playersCurrentNode, target: targetNode});
  const currentPlayer = currentGame.players.find(x => x.name === currentGame.currentTurn.name);

  if (ticket === 'black' && currentPlayer.tickets.black > 0) {
    return 'black';
  }

  for (const transportType of transportTypes) {
    const t = transportTypeTicketMap[transportType]

    if (currentPlayer.tickets[t] > 0) {
      return t;
    }
  }
  return null;
}

function checkValidMove(targetNode, currentGame, ticket) {

  if (currentGame.gameStatus && currentGame.gameStatus.status) {
    return false;
  }
  const playersCurrentNode = currentGame.map.nodes.find(n => n.players.find(p => p.name === currentGame.currentTurn.name));
  const availableTargetNodes = currentGame.map.links.filter(l => l.source === playersCurrentNode.id || l.target === playersCurrentNode.id)
    .map(l => l.source === playersCurrentNode.id ? l.target : l.source);

  const currentPlayer = currentGame.players.find(x => x.name === currentGame.currentTurn.name);
  if (ticket === 'black' && currentPlayer.tickets.black > 0) {
    return true;
  }

  if (availableTargetNodes.find(n => n === targetNode.id)) {
    // let's also check to make sure the player has a ticket to use
    const ticketUsed = getTicketToUse(targetNode, currentGame);
    if (ticketUsed === null) {
      console.log(`Didn't have a ticket to travel`);
      return false;
    }
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

function getTravel(node) {
  const {source: {types: st}, target: {types: tt}} = node;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse()[0];
}

function getAllTravel(link) {
  const {source: {types: st}, target: {types: tt}} = link;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse();
}


exports.handler = async (event) => {
  console.log({event});
  const {arguments: {id, targetNodeId, myself, ticket}} = event;

  const {Item: currentGame} = await ddb.get({Key: {id}, TableName: TABLE}).promise();

  if (currentGame.currentTurn.name !== myself) {
    return currentGame;
  }
  const me = currentGame.players.find(x => x.name === myself);

  const targetNode = currentGame.map.nodes.find(x => x.id === targetNodeId);

  if (!checkValidMove(targetNode, currentGame, ticket)) {
    console.log("Not a valid move", targetNode, currentGame);
    return currentGame;
  }

  const isOver = checkWinState(targetNode, currentGame);

  const sourceNode = currentGame.map.nodes.find((n) => n.players.find((p) => p.name === currentGame.currentTurn.name));
  const moveType = getTravel({target: targetNode, source: sourceNode});
  const isThief = currentGame.currentTurn.type === PlayerTypes.thief;
  let currentIndex = currentGame.players.findIndex(x => x.name === currentGame.currentTurn.name);
  if (currentIndex >= currentGame.players.length - 1) {
    currentIndex = -1;
  }

  let ticketUsed;
  if (!ticket) {
    ticketUsed = getTicketToUse(targetNode, currentGame);
  } else {
    if (me.tickets[ticket] > 0) {
      ticketUsed = ticket;
    }
  }

  const newPlayers = currentGame.players.map(p => {
    if (p.name === currentGame.currentTurn.name) {
      p.tickets[ticketUsed] = p.tickets[ticketUsed] - 1;
    }
    return p;
  });

  const currentPlayer = currentGame.currentTurn;
  const currentMap = currentGame.map;
  const thiefMoves = isThief ? [...(currentGame.thiefMoves || []), {
    type: ticket === 'black' ? 'black' : moveType,
    nodeId: targetNode.id
  }] : currentGame.thiefMoves;
  const newGame = {
    ...currentGame,
    players: newPlayers,
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
