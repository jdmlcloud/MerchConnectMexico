"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
class DataStack extends aws_cdk_lib_1.Stack {
    table;
    assetsBucket;
    publicBucket;
    constructor(scope, id, props) {
        super(scope, id, props);
        const table = new aws_dynamodb_1.Table(this, 'Table', {
            tableName: `MerchConnect-${props.stage}`,
            partitionKey: { name: 'pk', type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: 'sk', type: aws_dynamodb_1.AttributeType.STRING },
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            tableClass: aws_dynamodb_1.TableClass.STANDARD,
            pointInTimeRecovery: true,
            removalPolicy: props.stage === 'prod' ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        table.addGlobalSecondaryIndex({
            indexName: 'GSI1',
            partitionKey: { name: 'gsi1pk', type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: 'gsi1sk', type: aws_dynamodb_1.AttributeType.STRING },
        });
        aws_cdk_lib_1.Tags.of(table).add('Stage', props.stage);
        const assetsBucket = new aws_s3_1.Bucket(this, 'AssetsBucket', {
            bucketName: `mc-${props.stage}-assets`,
            versioned: true,
            encryption: aws_s3_1.BucketEncryption.S3_MANAGED,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            removalPolicy: props.stage === 'prod' ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: props.stage === 'prod' ? false : true,
        });
        aws_cdk_lib_1.Tags.of(assetsBucket).add('Stage', props.stage);
        const publicBucket = new aws_s3_1.Bucket(this, 'PublicBucket', {
            bucketName: `mc-${props.stage}-public`,
            versioned: true,
            encryption: aws_s3_1.BucketEncryption.S3_MANAGED,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ACLS,
            enforceSSL: true,
            removalPolicy: props.stage === 'prod' ? aws_cdk_lib_1.RemovalPolicy.RETAIN : aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: props.stage === 'prod' ? false : true,
        });
        aws_cdk_lib_1.Tags.of(publicBucket).add('Stage', props.stage);
        this.table = table;
        this.assetsBucket = assetsBucket;
        this.publicBucket = publicBucket;
    }
}
exports.DataStack = DataStack;
