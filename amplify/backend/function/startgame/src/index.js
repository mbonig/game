const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

const TransportTypes = {
  slow: "1_slow",
  medium: "2_medium",
  fast: "3_fast",
};

function getRandomNode(nodes){
  return nodes[~~(Math.random() * nodes.length)];
}

function setPlayersOnMap(map, players) {
  const newMap = {
    links: [...map.links],
    nodes: map.nodes.map(n=>({...n, players: []})),
  };

  for (const player of players) {
    let randomNode = getRandomNode(newMap.nodes);
    while (randomNode.players.length > 0){
      randomNode = getRandomNode(newMap.nodes);
    }
    randomNode.players.push(player);

  }
  return newMap;
}

function generateMap() {
  return {
    nodes: [
      {id: 1, type: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast]},
      {id: 2, type: [TransportTypes.slow]},
      {id: 3, type: [TransportTypes.medium, TransportTypes.slow]},
      {id: 4, type: [TransportTypes.fast, TransportTypes.slow]},
      {id: 5, type: [TransportTypes.fast, TransportTypes.medium, TransportTypes.slow], players: []},
      {id: 6, type: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: 7, type: [TransportTypes.fast, TransportTypes.slow], players: []},
      {id: 8, type: [TransportTypes.medium, TransportTypes.slow], players: []},
      {id: 9, type: [TransportTypes.slow], players: []},
      {id: 10, type: [TransportTypes.medium, TransportTypes.slow], players: []},
    ],
    links: [
      {source: 1, target: 2},
      {source: 1, target: 3},
      {source: 2, target: 3},
      {source: 2, target: 4},
      {source: 4, target: 5},
      {source: 5, target: 6},
      {source: 3, target: 7},
      {source: 5, target: 7},
      {source: 8, target: 4},
      {source: 8, target: 6},
      {source: 9, target: 10},
      {source: 3, target: 10},
      {source: 9, target: 6},
      {source: 9, target: 5},

    ]
  };
}


exports.handler = async (event) => {
  console.log({event, TABLE});
  const {arguments: {id}} = event;
  const {Item: game} = await ddb.get({Key: {id}, TableName: TABLE}).promise();

  if (game.status !== "Waiting"){
    console.warn("Tried to start a non-waiting game...", game);
    return game;
  }

  const players = game.players.map(x=>({...x, type: 'cop'}));
  const thief = players[~~(Math.random() * players.length)];
  thief.type = "thief";
  if (game.status === 'Waiting') {
    let newGame = {
      ...game,
      players,
      map: setPlayersOnMap(generateMap(), players),
      status: 'Started',
      currentTurn: thief,
      thiefMoves: []
    };
    await ddb.put({TableName: TABLE, Item: newGame}).promise();
  }

  return game;
};
