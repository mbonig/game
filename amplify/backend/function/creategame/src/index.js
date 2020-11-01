const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

const Crypto = require('crypto')

function randomString(size = 6) {
  return Crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size)
    .toLowerCase();
}

exports.handler = async (event) => {

  console.log({event});
  if (!event.arguments.myself) {
    throw new Error("Please provide your name at the myself field.");
  }
  const game = {
    id: randomString(),
    players: [{name: event.arguments.myself}],
    status: 'Waiting'
  }
  await ddb.put({TableName: TABLE, Item: game}).promise();

  return game;
};
