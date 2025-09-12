import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { Project, BuildSpec, LinuxBuildImage, ComputeType } from 'aws-cdk-lib/aws-codebuild';
import { Role, ServicePrincipal, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface CicdSimpleStackProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubConnectionArn: string;
  artifactsBucket: IBucket;
  webBucket: IBucket;
}

export class CicdSimpleStack extends Stack {
  public readonly buildProject: Project;

  constructor(scope: Construct, id: string, props: CicdSimpleStackProps) {
    super(scope, id, props);

    const { 
      stage, 
      githubOwner, 
      githubRepo, 
      githubBranch, 
      githubConnectionArn, 
      artifactsBucket,
      webBucket
    } = props;

    // IAM Role para CodeBuild
    const codeBuildRole = new Role(this, 'CodeBuildRole', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      description: `MerchConnect ${stage} CodeBuild Role`,
    });

    // Permisos para CodeBuild
    codeBuildRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:GetObject',
        's3:GetObjectVersion',
        's3:PutObject',
        's3:PutObjectAcl',
        's3:DeleteObject',
        's3:ListBucket',
      ],
      resources: [
        artifactsBucket.bucketArn,
        `${artifactsBucket.bucketArn}/*`,
        webBucket.bucketArn,
        `${webBucket.bucketArn}/*`,
      ],
    }));

    codeBuildRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'lambda:UpdateFunctionCode',
        'lambda:GetFunction',
        'lambda:ListFunctions',
      ],
      resources: ['*'],
    }));

    codeBuildRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: ['*'],
    }));

    // CodeBuild Project
    this.buildProject = new Project(this, 'BuildProject', {
      projectName: `merchconnect-${stage}-build`,
      description: `MerchConnect ${stage} build project`,
      role: codeBuildRole,
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        computeType: ComputeType.MEDIUM,
        privileged: false,
        environmentVariables: {
          STAGE: { value: stage },
          NEXT_PUBLIC_STAGE: { value: stage },
          NEXT_PUBLIC_DOMAIN: { value: `${stage}.merchconnectmexico.com` },
          NEXT_PUBLIC_API_URL: { value: `https://api-${stage}.merchconnectmexico.com/v1` },
          WEB_BUCKET_NAME: { value: webBucket.bucketName },
        },
      },
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install -g pnpm@9.6.0',
              'pnpm config set store-dir ~/.pnpm-store',
              'pnpm install --frozen-lockfile',
            ],
          },
          pre_build: {
            commands: [
              'pnpm lint',
              'pnpm type-check',
              'pnpm test',
            ],
          },
          build: {
            commands: [
              'pnpm build:packages',
              'pnpm build:web',
              'pnpm build:services',
            ],
          },
          post_build: {
            commands: [
              // Deploy static assets to S3
              'aws s3 sync apps/web/.next/static s3://$WEB_BUCKET_NAME/static/ --delete --cache-control "public, max-age=31536000, immutable"',
              'aws s3 sync apps/web/public s3://$WEB_BUCKET_NAME/ --delete --cache-control "public, max-age=31536000"',
              'aws s3 cp apps/web/.next/standalone/ s3://$WEB_BUCKET_NAME/ --recursive --cache-control "public, max-age=31536000"',
            ],
          },
        },
        cache: {
          paths: [
            '~/.pnpm-store',
            'node_modules',
            'apps/web/.next/cache',
          ],
        },
      }),
    });

    // Outputs
    new CfnOutput(this, 'BuildProjectName', {
      value: this.buildProject.projectName,
      description: 'CodeBuild Project Name',
    });

    new CfnOutput(this, 'BuildProjectArn', {
      value: this.buildProject.projectArn,
      description: 'CodeBuild Project ARN',
    });

    // Tags
    Tags.of(this).add('App', 'MerchConnect');
    Tags.of(this).add('Stage', stage);
    Tags.of(this).add('Owner', 'Jahaziel');
    Tags.of(this).add('Component', 'CI/CD');
  }
}
