import {App, Construct, Stack, StackProps} from '@aws-cdk/core';
import {AppSyncTransformer} from 'cdk-appsync-transformer';
import * as path from "path";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import {AttributeType, BillingMode, ProjectionType, StreamViewType, Table} from "@aws-cdk/aws-dynamodb";
import {readdirSync} from 'fs';
import {DynamoEventSource} from "@aws-cdk/aws-lambda-event-sources";
import {StartingPosition} from "@aws-cdk/aws-lambda";
import {RetentionDays} from "@aws-cdk/aws-logs";

interface EthrwarsStackProps extends StackProps {
  functions: string[];
}

export class EthrwarsStack extends Stack {
  private gameTable!: Table;
  private transformer!: AppSyncTransformer;
  private waitingRoomIndexName!: string;

  constructor(scope: Construct, id: string, props: EthrwarsStackProps) {
    super(scope, id, props);

    this.createApi();
    this.createTable();
    for (const functionName of props.functions) {
      this.createDataSource(functionName);
    }
    this.createAIBots();

  }

  private createTable() {
    this.gameTable = new Table(this, 'gametable', {
      partitionKey: {
        name: 'id',
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

    this.waitingRoomIndexName = 'waitingRoom';
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

  private createAIBots() {
    const botMoveLambda = new NodejsFunction(this, 'bot-mover', {
      logRetention: RetentionDays.ONE_DAY
    });
    this.gameTable.grantStreamRead(botMoveLambda);
    botMoveLambda.addEventSource(new DynamoEventSource(this.gameTable, {startingPosition: StartingPosition.LATEST}));
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const functionNames = readdirSync(path.join(__dirname, '../../amplify/backend/function'));
new EthrwarsStack(app, 'scotland-yard-api', {env: devEnv, functions: functionNames});

app.synth();