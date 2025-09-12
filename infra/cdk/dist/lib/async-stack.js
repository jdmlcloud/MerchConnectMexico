"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
class AsyncStack extends aws_cdk_lib_1.Stack {
    pagesQueue;
    constructor(scope, id, props) {
        super(scope, id, props);
        const dlq = new aws_sqs_1.Queue(this, 'PagesDLQ', {
            queueName: `mc-${props.stage}-pages-publish-dlq`,
            retentionPeriod: aws_cdk_lib_1.Duration.days(14),
            enforceSSL: true,
        });
        aws_cdk_lib_1.Tags.of(dlq).add('Stage', props.stage);
        const pagesQueue = new aws_sqs_1.Queue(this, 'PagesQueue', {
            queueName: `mc-${props.stage}-pages-publish`,
            retentionPeriod: aws_cdk_lib_1.Duration.days(4),
            deadLetterQueue: { queue: dlq, maxReceiveCount: 5 },
            enforceSSL: true,
        });
        aws_cdk_lib_1.Tags.of(pagesQueue).add('Stage', props.stage);
        const worker = new aws_lambda_nodejs_1.NodejsFunction(this, 'PagesWorker', {
            functionName: `mc-${props.stage}-pages-worker`,
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            entry: '../../apps/services/pages/src/handler.ts',
            handler: 'handler',
            bundling: {
                platform: 'node',
                target: 'node20',
                externalModules: [],
            },
            environment: {
                STAGE: props.stage,
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                AWS_REGION: this.region,
            },
        });
        worker.addEventSource(new aws_lambda_event_sources_1.SqsEventSource(pagesQueue, { batchSize: 5 }));
        // Allow putObject to public bucket mc-{stage}-public
        worker.addToRolePolicy(new aws_iam_1.PolicyStatement({
            actions: ['s3:PutObject', 's3:PutObjectAcl'],
            resources: [`arn:aws:s3:::mc-${props.stage}-public/*`],
        }));
        this.pagesQueue = pagesQueue;
    }
}
exports.AsyncStack = AsyncStack;
