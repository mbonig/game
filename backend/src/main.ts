import {App, Construct, Stack, StackProps} from '@aws-cdk/core';
import {AppSyncTransformer} from 'cdk-appsync-transformer';
import * as path from "path";
import {IFunction} from "@aws-cdk/aws-lambda";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import {AttributeType, BillingMode, ProjectionType, StreamViewType, Table} from "@aws-cdk/aws-dynamodb";

export class MyStack extends Stack {
  // @ts-ignore
  private waitingRoomLambda: IFunction;
  // @ts-ignore
  private gameTable: Table;
  // @ts-ignore
  private transformer: AppSyncTransformer;
  // @ts-ignore
  private waitingRoomIndexName: string;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...

    this.createApi();

    this.createTable();


    this.createDataSource('creategame');
    this.createDataSource('highlightnode');
    this.createDataSource('joingame');
    this.createDataSource('makemove');
    this.createDataSource('startgame');
    this.createDataSource("waitingroom");


  }
  private createTable() {
    this.gameTable = new Table(this, 'gametable', {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      stream: StreamViewType.NEW_IMAGE,
    });

    this.waitingRoomIndexName = "waitingRoom";
    this.gameTable.addGlobalSecondaryIndex({
      indexName: this.waitingRoomIndexName,
      partitionKey: {
        name: 'status',
        type: AttributeType.STRING
      },
      readCapacity: 5,
      writeCapacity: 5,
      projectionType: ProjectionType.ALL
    });
  }
  private createApi() {
    this.transformer = new AppSyncTransformer(this, 'game-api', {
      schemaPath: path.join(__dirname, '../../amplify/backend/api/ethrwars/schema.graphql')
    });
  }
  private createDataSource(functionName: string) {
    const lambda = new NodejsFunction(this, functionName + '-lambda', {
      entry: path.join(__dirname, `../../amplify/backend/function/${functionName}/src/index.js`),
      environment: {
        TABLE: this.gameTable.tableName,
        INDEX_NAME: this.waitingRoomIndexName,
        USES_SK: "true"
      }
    });

    this.transformer.addLambdaDataSourceAndResolvers(functionName + '-${env}', `${functionName}_datasource`, lambda, {});

    this.gameTable.grantReadWriteData(lambda);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'scotland-yard-api', {env: devEnv});
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();