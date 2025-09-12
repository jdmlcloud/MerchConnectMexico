import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { IBucket, Bucket } from 'aws-cdk-lib/aws-s3';
import { IUserPool, UserPool } from 'aws-cdk-lib/aws-cognito';
import { IHttpApi, HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { IFunction, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface ImportStackProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
}

export class ImportStack extends Stack {
  public readonly table: ITable;
  public readonly assetsBucket: IBucket;
  public readonly publicBucket: IBucket;
  public readonly userPool: IUserPool;
  public readonly httpApi: IHttpApi;
  public readonly pagesQueue: IQueue;
  public readonly pagesWorker: IFunction;

  constructor(scope: Construct, id: string, props: ImportStackProps) {
    super(scope, id, props);

    const { stage } = props;

    // Import existing DynamoDB table
    this.table = Table.fromTableName(this, 'Table', `MerchConnect-${stage}`);

    // Import existing S3 buckets
    this.assetsBucket = Bucket.fromBucketName(this, 'AssetsBucket', `mc-${stage}-assets-${this.account}`);
    this.publicBucket = Bucket.fromBucketName(this, 'PublicBucket', `mc-${stage}-public-${this.account}`);

    // Import existing Cognito User Pool
    this.userPool = UserPool.fromUserPoolId(this, 'UserPool', 'us-east-1_ro8nTkx1y');

    // Import existing API Gateway
    this.httpApi = HttpApi.fromHttpApiAttributes(this, 'HttpApi', {
      httpApiId: 'fawy9flh4m',
    });

    // Import existing SQS queue
    this.pagesQueue = Queue.fromQueueArn(this, 'PagesQueue', `arn:aws:sqs:${this.region}:${this.account}:mc-${stage}-pages-publish`);

    // Import existing Lambda function
    this.pagesWorker = Function.fromFunctionName(this, 'PagesWorker', `mc-${stage}-pages-worker`);

    // Add tags
    Tags.of(this).add('App', 'MerchConnect');
    Tags.of(this).add('Stage', stage);
    Tags.of(this).add('Owner', 'Jahaziel');
  }
}
