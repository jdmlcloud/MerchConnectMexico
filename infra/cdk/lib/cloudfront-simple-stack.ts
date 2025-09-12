import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { CloudFrontWebDistribution, OriginAccessIdentity, ViewerProtocolPolicy, PriceClass } from 'aws-cdk-lib/aws-cloudfront';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { IHttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface CloudFrontSimpleStackProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  webBucket: IBucket;
  apiGateway: IHttpApi;
  hostedZone: IHostedZone;
  certificate: Certificate;
  domainName: string;
}

export class CloudFrontSimpleStack extends Stack {
  public readonly webDistribution: CloudFrontWebDistribution;
  public readonly apiDistribution: CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, props: CloudFrontSimpleStackProps) {
    super(scope, id, props);

    const { stage, webBucket, apiGateway, hostedZone, certificate, domainName } = props;

    // Origin Access Identity para S3
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: `MerchConnect ${stage} OAI`,
    });

    // CloudFront Distribution para la web app (muy simplificado)
    this.webDistribution = new CloudFrontWebDistribution(this, 'WebDistribution', {
      comment: `MerchConnect ${stage} Web Distribution`,
      priceClass: PriceClass.PRICE_CLASS_100,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      defaultRootObject: 'index.html',
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: webBucket,
            originAccessIdentity: originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              compress: true,
            },
          ],
        },
      ],
    });

    // CloudFront Distribution para API Gateway (muy simplificado)
    this.apiDistribution = new CloudFrontWebDistribution(this, 'ApiDistribution', {
      comment: `MerchConnect ${stage} API Distribution`,
      priceClass: PriceClass.PRICE_CLASS_100,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originConfigs: [
        {
          customOriginSource: {
            domainName: `fawy9flh4m.execute-api.${this.region}.amazonaws.com`,
            httpPort: 443,
            httpsPort: 443,
            originProtocolPolicy: 'https-only' as any,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              compress: true,
            },
          ],
        },
      ],
    });

    // DNS Records
    new ARecord(this, 'WebARecord', {
      zone: hostedZone,
      recordName: stage,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.webDistribution)),
    });

    new ARecord(this, 'ApiARecord', {
      zone: hostedZone,
      recordName: `api-${stage}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.apiDistribution)),
    });

    // Outputs
    new CfnOutput(this, 'WebDistributionId', {
      value: this.webDistribution.distributionId,
      description: 'Web CloudFront Distribution ID',
    });

    new CfnOutput(this, 'WebDistributionDomainName', {
      value: this.webDistribution.distributionDomainName,
      description: 'Web CloudFront Distribution Domain',
    });

    new CfnOutput(this, 'ApiDistributionId', {
      value: this.apiDistribution.distributionId,
      description: 'API CloudFront Distribution ID',
    });

    new CfnOutput(this, 'ApiDistributionDomainName', {
      value: this.apiDistribution.distributionDomainName,
      description: 'API CloudFront Distribution Domain',
    });

    new CfnOutput(this, 'WebUrl', {
      value: `https://${stage}.${domainName}`,
      description: 'Web Application URL',
    });

    new CfnOutput(this, 'ApiUrl', {
      value: `https://api-${stage}.${domainName}`,
      description: 'API URL',
    });

    // Tags
    Tags.of(this).add('App', 'MerchConnect');
    Tags.of(this).add('Stage', stage);
    Tags.of(this).add('Owner', 'Jahaziel');
    Tags.of(this).add('Component', 'CloudFront');
  }
}
