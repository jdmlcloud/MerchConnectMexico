import { Duration, RemovalPolicy, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table, TableClass } from 'aws-cdk-lib/aws-dynamodb';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface StageProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
}

export class DataStack extends Stack {
  public readonly table: Table;
  public readonly assetsBucket: Bucket;
  public readonly publicBucket: Bucket;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);
    // If USE_EXISTING_AWS=true is set in environment, import existing resources
    const useExisting = process.env.USE_EXISTING_AWS === 'true';

    if (useExisting) {
      // Prefer explicit env variables to import existing resources at synth time.
      const existingTableName = process.env.EXISTING_TABLE_NAME || `MerchConnect-${props.stage}`;
      const assetsName = process.env.EXISTING_ASSETS_BUCKET || `mc-${props.stage}-assets-${process.env.CDK_DEFAULT_ACCOUNT || ''}`;
      const publicName = process.env.EXISTING_PUBLIC_BUCKET || `mc-${props.stage}-public-${process.env.CDK_DEFAULT_ACCOUNT || ''}`;

      const importedTable = Table.fromTableName(this, 'Table', existingTableName) as Table;
      const importedAssets = Bucket.fromBucketName(this, 'AssetsBucket', assetsName);
      const importedPublic = Bucket.fromBucketName(this, 'PublicBucket', publicName);

      this.table = importedTable as unknown as Table;
      this.assetsBucket = importedAssets as unknown as Bucket;
      this.publicBucket = importedPublic as unknown as Bucket;
      Tags.of(this.table).add('Stage', props.stage);
      Tags.of(this.assetsBucket).add('Stage', props.stage);
      Tags.of(this.publicBucket).add('Stage', props.stage);
    } else {
      const table = new Table(this, 'Table', {
        tableName: `MerchConnect-${props.stage}`,
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
        billingMode: BillingMode.PAY_PER_REQUEST,
        tableClass: TableClass.STANDARD,
        pointInTimeRecovery: true,
        removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      });
      table.addGlobalSecondaryIndex({
        indexName: 'GSI1',
        partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
        sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
      });
      Tags.of(table).add('Stage', props.stage);

      const assetsBucket = new Bucket(this, 'AssetsBucket', {
        bucketName: `mc-${props.stage}-assets`,
        versioned: true,
        encryption: BucketEncryption.S3_MANAGED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
        autoDeleteObjects: props.stage === 'prod' ? false : true,
      });
      Tags.of(assetsBucket).add('Stage', props.stage);

      const publicBucket = new Bucket(this, 'PublicBucket', {
        bucketName: `mc-${props.stage}-public`,
        versioned: true,
        encryption: BucketEncryption.S3_MANAGED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        enforceSSL: true,
        removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
        autoDeleteObjects: props.stage === 'prod' ? false : true,
      });
      Tags.of(publicBucket).add('Stage', props.stage);

      this.table = table;
      this.assetsBucket = assetsBucket;
      this.publicBucket = publicBucket;
    }
  }
}
