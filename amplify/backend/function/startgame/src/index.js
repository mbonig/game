const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

const TransportTypes = {
  slow: "1_slow",
  medium: "2_medium",
  fast: "3_fast",
};

function getRandomNode(nodes) {
  return nodes[~~(Math.random() * nodes.length)];
}

function setPlayersOnMap(map, players) {
  const newMap = {
    links: [...map.links],
    nodes: map.nodes.map(n => ({...n, players: []})),
  };

  for (const player of players) {
    let randomNode = getRandomNode(newMap.nodes);
    while (randomNode.players.length > 0) {
      randomNode = getRandomNode(newMap.nodes);
    }
    randomNode.players.push(player);

  }
  return newMap;
}

function generateMap() {
  return {
    nodes: [
      {
        id: 1,
        types: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast],
        x: 557,
        y: -69
      },
      {id: 2, types: [TransportTypes.slow], x: 276, y: -59},
      {id: 3, types: [TransportTypes.medium, TransportTypes.slow], x: 582, y: 214},
      {id: 4, types: [TransportTypes.fast, TransportTypes.slow], x: 56, y: 18},
      {
        id: 5,
        types: [TransportTypes.fast, TransportTypes.medium, TransportTypes.slow],
        players: [],
        x: 42,
        y: 263
      },
      {
        id: 6,
        types: [TransportTypes.medium, TransportTypes.slow],
        players: [],
        x: -110,
        y: 342
      },
      {
        id: 7,
        types: [TransportTypes.fast, TransportTypes.slow],
        players: [],
        x: 276,
        y: 203
      },
      {
        id: 8,
        types: [TransportTypes.medium, TransportTypes.slow],
        players: [],
        x: -189,
        y: -93
      },
      {id: 9, types: [TransportTypes.slow], players: [], x: 98, y: 480},
      {
        id: 10,
        types: [TransportTypes.medium, TransportTypes.slow],
        players: [],
        x: 387,
        y: 478
      },
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

  if (game.status !== "Waiting") {
    console.warn("Tried to start a non-waiting game...", game);
    return game;
  }

  const players = game.players.map(x => ({...x, type: 'cop', tickets: {slow: 5, medium: 3, fast: 1}}));
  const thief = players[~~(Math.random() * players.length)];
  thief.type = "thief";
  thief.tickets.black = 2;
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
    return newGame;
  }

  return game;
};
