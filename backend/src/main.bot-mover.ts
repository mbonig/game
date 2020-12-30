import {GameState} from "../../models";

const AWS = require('aws-sdk');

// @ts-ignore
export function makeMove(game: GameState, botName: string) {
  return {targetNodeId: "", ticket: ""};
}

export const handler = async (event: any) => {
  console.log(JSON.stringify(event, null, 2));

  const {Records: records} = event;

  for (const record of records) {
    const {dynamodb: {NewImage}} = record;
    const game = AWS.DynamoDB.Converter.unmarshall(NewImage);

    if (game.id === game.sk) {
      const botName = "bot1"
      const {targetNodeId, ticket} = makeMove(game, botName);
      const timestamp = new Date().toISOString();
      const newMove = {
        id: game.id,
        sk: `MOVE#${botName}#${timestamp}`,
        player: botName,
        timestamp,
        targetNodeId,
        ticket
      }
      console.log({newMove});
    }
  }
}