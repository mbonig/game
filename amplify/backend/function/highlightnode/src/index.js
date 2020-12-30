const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE;
const USES_SK = process.env.USES_SK;

exports.handler = async (event) => {
    console.log({event});
    const {arguments: {id, targetNodeId, myself}} = event;
    let params = {Key: {id}, TableName: TABLE};
    if (USES_SK){
        params.Key.sk = params.Key.id;
    }
    const {Item: currentGame} = await ddb.get(params).promise();
    currentGame.highlightedNodes = [(currentGame.highlightedNodes || []).filter(x=>x.username !== myself), {username: myself, targetNodeId}];
    await ddb.put({TableName: TABLE, Item: currentGame}).promise();
    return currentGame;

};
