const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

exports.handler = async (event) => {
  console.log({event});

  const {Items: games} = await ddb.query({
    TableName: TABLE,
    IndexName: "waitingRoom",
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
