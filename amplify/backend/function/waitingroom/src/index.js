const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;
const INDEX_NAME = process.env.INDEX_NAME;
const USES_SK = process.env.USES_SK;

exports.handler = async (event) => {
  console.log({event});

  const {Items: games} = await ddb.query({
    TableName: TABLE,
    IndexName: INDEX_NAME || "waitingroom",
    KeyConditionExpression: "#status = :waiting",
    ExpressionAttributeValues: {
      ":waiting": "Waiting"
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }
  }).promise();

  // we also want to get all the games the current player is already in that are still going...

  return games;
};
