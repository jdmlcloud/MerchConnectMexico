import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface CicdStackProps extends cdk.StackProps {
  stage: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubConnectionArn: string;
  artifactsBucket: s3.IBucket;
}

export class CicdStack extends cdk.Stack {
  public readonly pipeline: codepipeline.Pipeline;
  public readonly buildProject: codebuild.Project;

  constructor(scope: Construct, id: string, props: CicdStackProps) {
    super(scope, id, props);

    const { stage, githubOwner, githubRepo, githubBranch, githubConnectionArn, artifactsBucket } = props;

    // CodeBuild Project
    this.buildProject = new codebuild.Project(this, 'BuildProject', {
      projectName: `merchconnect-${stage}-build`,
      description: `MerchConnect ${stage} build project`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.LARGE,
        privileged: true,
        environmentVariables: {
          STAGE: {
            value: stage,
          },
          NODE_VERSION: {
            value: '20',
          },
          PNPM_VERSION: {
            value: '9.6.0',
          },
          AWS_DEFAULT_REGION: {
            value: this.region,
          },
          AWS_ACCOUNT_ID: {
            value: this.account,
          },
        },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'echo Logging in to Amazon ECR...',
              'aws --version',
              'node --version',
              'npm --version',
              'curl -fsSL https://get.pnpm.io/install.sh | sh -',
              'export PATH="$HOME/.local/share/pnpm:$PATH"',
              'pnpm --version',
              'pnpm install --frozen-lockfile',
            ],
          },
          build: {
            commands: [
              'echo Build started on `date`',
              'export PATH="$HOME/.local/share/pnpm:$PATH"',
              'pnpm build:packages',
              'pnpm build:web',
              'pnpm build:services',
            ],
          },
          post_build: {
            commands: [
              'echo Build completed on `date`',
              'echo Build artifacts will be uploaded to S3',
            ],
          },
        },
        artifacts: {
          files: [
            'apps/web/.next/**/*',
            'apps/services/dist/**/*',
            'packages/*/dist/**/*',
          ],
          'base-directory': '.',
        },
        cache: {
          paths: [
            'node_modules/**/*',
            '.pnpm-store/**/*',
          ],
        },
      }),
      artifacts: codebuild.Artifacts.s3({
        bucket: artifactsBucket,
        includeBuildId: false,
        packageZip: true,
        path: `builds/${stage}`,
      }),
    });

    // IAM Role for CodeBuild
    this.buildProject.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
        's3:GetObjectVersion',
        's3:PutObject',
        's3:PutObjectAcl',
        's3:DeleteObject',
      ],
      resources: [
        artifactsBucket.bucketArn,
        `${artifactsBucket.bucketArn}/*`,
      ],
    }));

    // Lambda deployment permissions
    this.buildProject.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'lambda:UpdateFunctionCode',
        'lambda:GetFunction',
        'lambda:ListFunctions',
      ],
      resources: [
        `arn:aws:lambda:${this.region}:${this.account}:function:mc-${stage}-*`,
      ],
    }));

    // CloudFront invalidation permissions
    this.buildProject.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudfront:CreateInvalidation',
        'cloudfront:GetDistribution',
        'cloudfront:ListDistributions',
      ],
      resources: ['*'],
    }));

    // CodePipeline
    this.pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: `merchconnect-${stage}-pipeline`,
      artifactBucket: artifactsBucket,
      crossRegionReplicationBuckets: {
        [this.region]: artifactsBucket,
      },
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeStarConnectionsSourceAction({
              actionName: 'GitHub_Source',
              owner: githubOwner,
              repo: githubRepo,
              branch: githubBranch,
              connectionArn: githubConnectionArn,
              output: new codepipeline.Artifact('SourceOutput'),
              triggerOnPush: true,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build',
              project: this.buildProject,
              input: new codepipeline.Artifact('SourceOutput'),
              outputs: [new codepipeline.Artifact('BuildOutput')],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.S3DeployAction({
              actionName: 'Deploy_Web_Assets',
              bucket: artifactsBucket,
              input: new codepipeline.Artifact('BuildOutput'),
              extract: true,
              objectKey: `web/${stage}`,
            }),
          ],
        },
      ],
    });

    // Outputs
    new cdk.CfnOutput(this, 'PipelineArn', {
      value: this.pipeline.pipelineArn,
      description: 'CodePipeline ARN',
    });

    new cdk.CfnOutput(this, 'BuildProjectArn', {
      value: this.buildProject.projectArn,
      description: 'CodeBuild Project ARN',
    });
  }
}
