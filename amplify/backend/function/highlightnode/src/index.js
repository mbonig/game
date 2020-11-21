const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;

exports.handler = async (event) => {
    console.log({event});
    const {arguments: {id, targetNodeId, myself}} = event;
    const {Item: currentGame} = await ddb.get({Key: {id}, TableName: TABLE}).promise();
    currentGame.highlightedNodes = [(currentGame.highlightedNodes || []).filter(x=>x.username !== myself), {username: myself, targetNodeId}];
    await ddb.put({TableName: TABLE, Item: currentGame}).promise();
    return currentGame;

};
