const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;
const USES_SK = process.env.USES_SK;

exports.handler = async (event) => {
  console.log({event, TABLE});
  const {arguments: {myself: name, id}} = event;
  let params = {Key: {id: id.toLowerCase()}, TableName: TABLE};
  if (USES_SK) {
    params.Key.sk = params.Key.id;
  }
  const {Item: game} = await ddb.get(params).promise();

  if (!game.players.find(p => p.name === name)) {
    game.players.push({name});
    await ddb.put({TableName: TABLE, Item: game}).promise();
  }

  return game;
};
