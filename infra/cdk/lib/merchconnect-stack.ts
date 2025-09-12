import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Stage } from '@merchconnect/types';
import { ImportStack } from './import-stack';
import { WebStack } from './web-stack';
import { DomainStack } from './domain-stack';
import { CloudFrontSimpleStack } from './cloudfront-simple-stack';
import { WafStack } from './waf-stack';
import { MonitoringStack } from './monitoring-stack';
import { CicdSimpleStack } from './cicd-simple-stack';

export interface MerchConnectStackProps extends cdk.StackProps {
  stage: Stage;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubConnectionArn: string;
  domainName: string;
  alarmEmail: string;
}

export class MerchConnectStack extends cdk.Stack {
  public readonly importStack: ImportStack;
  // public readonly domainStack: DomainStack;
  // public readonly cloudFrontStack: CloudFrontSimpleStack;
  // public readonly wafStack: WafStack;
  // public readonly monitoringStack: MonitoringStack;
  public readonly cicdStack: CicdSimpleStack;

  constructor(scope: Construct, id: string, props: MerchConnectStackProps) {
    super(scope, id, props);

    const { stage, githubOwner, githubRepo, githubBranch, githubConnectionArn, domainName, alarmEmail } = props;

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

    // Domain Stack - Temporalmente deshabilitado
    // this.domainStack = new DomainStack(this, 'DomainStack', {
    //   stage,
    //   domainName,
    // });

    // CloudFront Stack - Temporalmente deshabilitado
    // this.cloudFrontStack = new CloudFrontSimpleStack(this, 'CloudFrontStack', {
    //   stage,
    //   webBucket: this.importStack.assetsBucket,
    //   apiGateway: this.importStack.httpApi,
    //   hostedZone: this.domainStack.hostedZone,
    //   certificate: this.domainStack.certificate,
    //   domainName,
    // });

    // WAF Stack - Temporalmente deshabilitado
    // this.wafStack = new WafStack(this, 'WafStack', {
    //   stage,
    //   webDistribution: this.cloudFrontStack.webDistribution,
    //   apiDistribution: this.cloudFrontStack.apiDistribution,
    // });

    // Monitoring Stack - Temporalmente deshabilitado
    // this.monitoringStack = new MonitoringStack(this, 'MonitoringStack', {
    //   stage,
    //   webDistributionId: this.cloudFrontStack.webDistribution.distributionId,
    //   apiDistributionId: this.cloudFrontStack.apiDistribution.distributionId,
    //   alarmEmail,
    // });

    // CI/CD Stack
    this.cicdStack = new CicdSimpleStack(this, 'CicdStack', {
      stage,
      githubOwner,
      githubRepo,
      githubBranch,
      githubConnectionArn,
      artifactsBucket,
      webBucket: this.importStack.assetsBucket,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ArtifactsBucketName', {
      value: artifactsBucket.bucketName,
      description: 'S3 bucket for CI/CD artifacts',
    });
  }
}
