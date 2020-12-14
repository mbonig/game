const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;
exports.handler = async (event) => {
  console.log({event, TABLE});
  const {arguments: {myself: name, id}} = event;
  const {Item: game} = await ddb.get({Key: {id: id.toLowerCase()}, TableName: TABLE}).promise();

  if (!game.players.find(p => p.name === name)) {
    game.players.push({name});
    await ddb.put({TableName: TABLE, Item: game}).promise();
  }

  return game;
};
