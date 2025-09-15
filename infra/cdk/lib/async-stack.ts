import { Duration, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface StageProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
}

export class AsyncStack extends Stack {
  public readonly pagesQueue: Queue;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const dlq = new Queue(this, 'PagesDLQ', {
      queueName: `mc-${props.stage}-pages-publish-dlq`,
      retentionPeriod: Duration.days(14),
      enforceSSL: true,
    });
    Tags.of(dlq).add('Stage', props.stage);

    const pagesQueue = new Queue(this, 'PagesQueue', {
      queueName: `mc-${props.stage}-pages-publish`,
      retentionPeriod: Duration.days(4),
      deadLetterQueue: { queue: dlq, maxReceiveCount: 5 },
      enforceSSL: true,
    });
    Tags.of(pagesQueue).add('Stage', props.stage);

    const worker = new NodejsFunction(this, 'PagesWorker', {
      functionName: `mc-${props.stage}-pages-worker`,
      runtime: Runtime.NODEJS_20_X,
      entry: '../../apps/services/pages/src/handler.ts',
      handler: 'handler',
      bundling: {
        platform: 'node',
        target: 'node20',
        externalModules: ['@aws-sdk/*'],
      },
      environment: {
        STAGE: props.stage,
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
      timeout: Duration.seconds(10),
      memorySize: 256,
    });
    worker.addEventSource(new SqsEventSource(pagesQueue, { batchSize: 5 }));

    // Allow putObject to public bucket mc-{stage}-public and invalidate CloudFront
    worker.addToRolePolicy(new PolicyStatement({
      actions: ['s3:PutObject', 's3:PutObjectAcl'],
      resources: [`arn:aws:s3:::mc-${props.stage}-public/*`],
    }));
    worker.addToRolePolicy(new PolicyStatement({
      actions: ['cloudfront:CreateInvalidation'],
      resources: ['*'],
    }));

    this.pagesQueue = pagesQueue;
  }
}
