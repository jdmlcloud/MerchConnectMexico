import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Stage } from '@merchconnect/types';
import { ImportStack } from './import-stack';
import { WebStack } from './web-stack';
import { CicdStack } from './cicd-stack';

export interface MerchConnectStackProps extends cdk.StackProps {
  stage: Stage;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubConnectionArn: string;
}

export class MerchConnectStack extends cdk.Stack {
  public readonly importStack: ImportStack;
  public readonly webStack: WebStack;
  // public readonly cicdStack: CicdStack;

  constructor(scope: Construct, id: string, props: MerchConnectStackProps) {
    super(scope, id, props);

    const { stage, githubOwner, githubRepo, githubBranch, githubConnectionArn } = props;

    // Artifacts bucket for CI/CD
    const artifactsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
      bucketName: `merchconnect-${stage}-artifacts-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Import existing resources
    this.importStack = new ImportStack(this, 'ImportStack', {
      stage,
    });

    // Web Stack
    this.webStack = new WebStack(this, 'WebStack', {
      stage,
      distributionOrigins: [`https://fawy9flh4m.execute-api.${this.region}.amazonaws.com`],
    });

    // CI/CD Stack - Temporalmente deshabilitado para evitar errores de región
    // this.cicdStack = new CicdStack(this, 'CicdStack', {
    //   stage,
    //   githubOwner,
    //   githubRepo,
    //   githubBranch,
    //   githubConnectionArn,
    //   artifactsBucket,
    // });

    // Outputs
    new cdk.CfnOutput(this, 'ArtifactsBucketName', {
      value: artifactsBucket.bucketName,
      description: 'S3 bucket for CI/CD artifacts',
    });
  }
}
