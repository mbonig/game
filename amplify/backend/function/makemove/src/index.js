const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

const transportTypeTicketMap = {
  "1_slow": "slow",
  "2_medium": "medium",
  "3_fast": "fast"
}

function getTicketToUse(targetNode, currentGame, playersCurrentNode, currentPlayer) {
  if (!playersCurrentNode) playersCurrentNode = currentGame.map.nodes.find(n => n.players.find(p => p.name === currentGame.currentTurn.name));
  if (!currentPlayer) currentPlayer = currentGame.players.find(x => x.name === currentGame.currentTurn.name);

  const transportTypes = getAllTravel({source: playersCurrentNode, target: targetNode});

  for (const transportType of transportTypes) {
    const t = transportTypeTicketMap[transportType]

    if (currentPlayer.tickets[t] > 0) {
      return t;
    }
  }
  return null;
}

function getCurrentPlayersNode(currentGame) {
  return currentGame.map.nodes.find(n => n.players.find(p => p.name === currentGame.currentTurn.name));
}

function getAvailableTargetNodes(currentGame, sourceNode) {
  return currentGame.map.links.filter(l => l.source === sourceNode.id || l.target === sourceNode.id)
    .map(l => l.source === sourceNode.id ? l.target : l.source);
}

function checkValidMove(targetNode, currentGame, ticket) {

  if (currentGame.gameStatus && currentGame.gameStatus.status) {
    return false;
  }
  const playersCurrentNode = getCurrentPlayersNode(currentGame);
  const availableTargetNodes = getAvailableTargetNodes(currentGame, playersCurrentNode);

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

  // now we need to see if any player can make a move, as long as one player can still make a move, the game is not over.
  for (const player of currentGame.players) {
    const playersNode = currentGame.map.nodes.find(n => n.players.find(p => p.name === player.name));
    if (canMoveSomewhere(currentGame, playersNode, player)) {
      return;
    }
  }

  return {
    status: 'Finished',
    winner: 'Thief'
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

function getNextPlayer(game) {
  let currentIndex = game.players.findIndex(x => x.name === game.currentTurn.name);
  if (currentIndex >= game.players.length - 1) {
    currentIndex = -1;
  }

  return game.players[currentIndex + 1];
}

function iCanMoveSomewhere(game) {
  // look at all the nodes that the current player and move to.
  const currentNode = getCurrentPlayersNode(game);
  return canMoveSomewhere(game, currentNode);
}

function canMoveSomewhere(game, currentNode, player) {
  const availableTargetNodes = getAvailableTargetNodes(game, currentNode);

  // see if they have enough tickets to make any of those moves.
  for (const targetNodeId of availableTargetNodes) {
    const targetNode = game.map.nodes.find(n => n.id === targetNodeId);
    const ticketToUse = getTicketToUse(targetNode, game, currentNode, player);
    if (!!ticketToUse) {
      return true;
    }
  }
  return false;

}


exports.handler = async (event) => {
  //console.log({event});
  const {arguments: {id, targetNodeId, myself, ticket}} = event;

  const {Item: currentGame} = await ddb.get({Key: {id}, TableName: TABLE}).promise();

  // if this ain't my turn, den just do nothing
  if (currentGame.currentTurn.name !== myself) {
    return currentGame;
  }

  const me = currentGame.players.find(x => x.name === myself);
  const targetNode = currentGame.map.nodes.find(x => x.id === targetNodeId);

  if (!iCanMoveSomewhere(currentGame)) {
    // pass turn
    const updatedGame = {
      ...currentGame,
      currentTurn: getNextPlayer(currentGame),
      gameStatus: checkWinState(targetNode, currentGame)
    }
    await ddb.put({TableName: TABLE, Item: updatedGame}).promise();
    return updatedGame;
  }

  if (!checkValidMove(targetNode, currentGame, ticket)) {
    console.log("Not a valid move", targetNode, currentGame);
    return currentGame;
  }

  const isOver = checkWinState(targetNode, currentGame);

  const sourceNode = currentGame.map.nodes.find((n) => n.players.find((p) => p.name === currentGame.currentTurn.name));
  const moveType = getTravel({target: targetNode, source: sourceNode});
  const isThief = currentGame.currentTurn.type === PlayerTypes.thief;

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
    currentTurn: getNextPlayer(currentGame),
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
