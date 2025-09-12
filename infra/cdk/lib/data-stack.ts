import { Duration, RemovalPolicy, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table, TableClass, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { BlockPublicAccess, Bucket, BucketEncryption, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface StageProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
}

export class DataStack extends Stack {
  public readonly table: ITable;
  public readonly assetsBucket: IBucket;
  public readonly publicBucket: IBucket;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    // Import existing table or create new one
    let table: ITable;
    try {
      table = Table.fromTableName(this, 'Table', `MerchConnect-${props.stage}`);
    } catch {
      table = new Table(this, 'Table', {
        tableName: `MerchConnect-${props.stage}`,
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
        billingMode: BillingMode.PAY_PER_REQUEST,
        tableClass: TableClass.STANDARD,
        pointInTimeRecovery: true,
        removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      });
    }
    
    // Only add GSI if it's a new table (not imported)
    if (table instanceof Table) {
      table.addGlobalSecondaryIndex({
        indexName: 'GSI1',
        partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
        sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
      });
    }
    
    Tags.of(table).add('Stage', props.stage);

    // Import existing bucket or create new one
    let assetsBucket: IBucket;
    try {
      assetsBucket = Bucket.fromBucketName(this, 'AssetsBucket', `mc-${props.stage}-assets-${this.account}`);
    } catch {
      assetsBucket = new Bucket(this, 'AssetsBucket', {
        bucketName: `mc-${props.stage}-assets-${this.account}`,
        versioned: true,
        encryption: BucketEncryption.S3_MANAGED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
        autoDeleteObjects: props.stage === 'prod' ? false : true,
      });
    }
    Tags.of(assetsBucket).add('Stage', props.stage);

    // Import existing bucket or create new one
    let publicBucket: IBucket;
    try {
      publicBucket = Bucket.fromBucketName(this, 'PublicBucket', `mc-${props.stage}-public-${this.account}`);
    } catch {
      publicBucket = new Bucket(this, 'PublicBucket', {
        bucketName: `mc-${props.stage}-public-${this.account}`,
        versioned: true,
        encryption: BucketEncryption.S3_MANAGED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        enforceSSL: true,
        removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
        autoDeleteObjects: props.stage === 'prod' ? false : true,
      });
    }
    Tags.of(publicBucket).add('Stage', props.stage);

    this.table = table;
    this.assetsBucket = assetsBucket;
    this.publicBucket = publicBucket;
  }
}
