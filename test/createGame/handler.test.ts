import {DynamoDB} from '../__mocks__/aws-sdk';

const TEST_TABLE = 'TEST_TABLE';
process.env.TABLE = TEST_TABLE;

const {handler} = require('../../amplify/backend/function/creategame/src/');

const db = new DynamoDB.DocumentClient();

describe('create game', () => {
  const testEvent = {
    arguments: {
      myself: 'me',
    }
  };

  it('uses the right table name', async () => {
    await handler(testEvent);
    expect(db.put).toHaveBeenCalled();
    expect(db.put.mock.calls[0][0].TableName).toEqual(TEST_TABLE);
  });

  it('adds host to player list', async () => {
    await handler(testEvent);
    expect(db.put).toHaveBeenCalled();
    expect(db.put.mock.calls[0][0].Item.players).toEqual([{name: testEvent.arguments.myself}]);
  });

  it('sets status to Waiting', async () => {
    await handler(testEvent);
    expect(db.put).toHaveBeenCalled();
    expect(db.put.mock.calls[0][0].Item.status).toEqual('Waiting');
  });

  it('adds as host', async () => {
    await handler(testEvent);
    expect(db.put).toHaveBeenCalled();
    expect(db.put.mock.calls[0][0].Item.host).toEqual(testEvent.arguments.myself);
  });

});
