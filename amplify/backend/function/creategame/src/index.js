const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;
const USES_SK = process.env.USES_SK;
const INDEX_NAME = process.env.INDEX_NAME || "waitingRoom";
const Crypto = require('crypto')

function randomString(size = 6) {
  return Crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size)
    .toLowerCase();
}

function floatToTop(items, game) {
  return items.sort((x, y) => x.id === game.id ? -1 : 1);
}

exports.handler = async (event) => {
  console.log({event});

  const {myself} = event.arguments;

  if (!myself) {
    throw new Error("Please provide your name at the myself field.");
  }

  const game = {
    id: randomString(),
    players: [{name: myself}],
    status: 'Waiting',
    host: myself
  }

  // feature flag for new database table that supports sk
  if (USES_SK) {
    game.sk = game.id;
  }
  await ddb.put({TableName: TABLE, Item: game}).promise();

  const {Items: items} = await ddb.query({
    TableName: TABLE,
    IndexName: INDEX_NAME,
    KeyConditionExpression: "#status = :waiting",
    ExpressionAttributeValues: {
      ":waiting": "Waiting"
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }
  }).promise();


  return floatToTop(items, game);
};
