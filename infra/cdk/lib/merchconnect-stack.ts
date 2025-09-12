import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { DataStack } from './data-stack';
import { IdentityStack } from './identity-stack';
import { ApiStack } from './api-stack';
import { AsyncStack } from './async-stack';
import { WebStack } from './web-stack';
import { CicdStack } from './cicd-stack';

export interface MerchConnectStackProps extends cdk.StackProps {
  stage: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubTokenSecretArn: string;
}

export class MerchConnectStack extends cdk.Stack {
  public readonly dataStack: DataStack;
  public readonly identityStack: IdentityStack;
  public readonly apiStack: ApiStack;
  public readonly asyncStack: AsyncStack;
  public readonly webStack: WebStack;
  public readonly cicdStack: CicdStack;

  constructor(scope: Construct, id: string, props: MerchConnectStackProps) {
    super(scope, id, props);

    const { stage, githubOwner, githubRepo, githubBranch, githubTokenSecretArn } = props;

    // Artifacts bucket for CI/CD
    const artifactsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
      bucketName: `merchconnect-${stage}-artifacts-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Data Stack
    this.dataStack = new DataStack(this, 'DataStack', {
      stage,
    });

    // Identity Stack
    this.identityStack = new IdentityStack(this, 'IdentityStack', {
      stage,
    });

    // API Stack
    this.apiStack = new ApiStack(this, 'ApiStack', {
      stage,
      userPool: this.identityStack.userPool,
      table: this.dataStack.table,
    });

    // Async Stack
    this.asyncStack = new AsyncStack(this, 'AsyncStack', {
      stage,
      table: this.dataStack.table,
    });

    // Web Stack
    this.webStack = new WebStack(this, 'WebStack', {
      stage,
      apiUrl: this.apiStack.apiUrl,
    });

    // CI/CD Stack
    this.cicdStack = new CicdStack(this, 'CicdStack', {
      stage,
      githubOwner,
      githubRepo,
      githubBranch,
      githubTokenSecretArn,
      artifactsBucket,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ArtifactsBucketName', {
      value: artifactsBucket.bucketName,
      description: 'S3 bucket for CI/CD artifacts',
    });
  }
}
