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
        "id": "1",
        types: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast],
        "players": [],
        "x": 399.9064636230469,
        "y": -124.5127944946289
      },
      {
        "id": "2",
        types: [TransportTypes.slow],
        "players": [],
        "x": 630.3536376953125,
        "y": -486.99468994140625
      },
      {
        "id": "3",
        types: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast],
        "players": [],
        "x": 453.7758483886719,
        "y": -716.1773681640625
      },
      {
        "id": "5",
        types: [TransportTypes.slow],
        "players": [],
        "x": -231.8357696533203,
        "y": 150.40040588378906
      },
      {
        "id": "6",
        types: [TransportTypes.slow, TransportTypes.medium],
        "players": [],
        "x": -595.2393188476562,
        "y": 349.02178955078125
      },
      {
        "id": "7",
        "players": [],
        types: [TransportTypes.slow, TransportTypes.medium],
        "x": 6.5099005699157715,
        "y": -136.49716186523438
      },
      {
        "id": "8",
        "players": [],
        types: [TransportTypes.slow, TransportTypes.medium, TransportTypes.fast],
        "x": -92.77983856201172,
        "y": 380.4136047363281
      },
      {
        "id": "9",
        "players": [],
        types: [TransportTypes.slow, TransportTypes.medium],
        "x": -404.1269226074219,
        "y": -295.88812255859375
      },
      {
        "id": "10",
        types: [TransportTypes.slow, TransportTypes.fast],
        "x": -457.22064208984375,
        "y": -745.6978759765625
      },
      {
        "x": -617.9766235351562,
        "y": -369.62939453125,
        "id": "17240",
        types: [TransportTypes.slow]
      },
      {
        "x": 63.392738342285156,
        "y": -629.1867065429688,
        "id": "11999",
        types: [TransportTypes.slow]
      },
      {
        "x": -79.66532897949219,
        "y": -335.6964416503906,
        "id": "8800",
        types: [TransportTypes.slow]
      },
      {
        "x": 560.3760986328125,
        "y": 345.4339904785156,
        "id": "10412",
        types: [TransportTypes.slow]
      }
    ],
    links: [
      {
        "source": "1",
        "target": "2"
      },
      {
        "source": "1",
        "target": "3"
      },
      {
        "source": "2",
        "target": "3"
      },

      {
        "source": "5",
        "target": "6"
      },
      {
        "source": "3",
        "target": "7"
      },
      {
        "source": "5",
        "target": "7"
      },
      {
        "source": "8",
        "target": "6"
      },
      {
        "source": "9",
        "target": "10"
      },
      {
        "source": "3",
        "target": "10"
      },
      {
        "source": "9",
        "target": "6"
      },
      {
        "source": "9",
        "target": "5"
      },
      {
        "source": "17240",
        "target": "10"
      },
      {
        "source": "10",
        "target": "8800"
      },
      {
        "source": "8800",
        "target": "9"
      },
      {
        "source": "8800",
        "target": "11999"
      },
      {
        "source": "11999",
        "target": "3"
      },
      {
        "source": "11999",
        "target": "7"
      },
      {
        "source": "17240",
        "target": "6"
      },
      {
        "source": "1",
        "target": "8"
      },
      {
        "source": "2",
        "target": "10412"
      },
      {
        "source": "1",
        "target": "10412"
      },
      {
        "source": "8",
        "target": "10412"
      },
      {
        "source": "3",
        "target": "8"
      },
      {
        "source": "10",
        "target": "8"
      },
      {
        "source": "9",
        "target": "7"
      }
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

  const players = game.players.map(x => ({...x, type: 'cop', tickets: {slow: 8, medium: 5, fast: 2}}));
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
