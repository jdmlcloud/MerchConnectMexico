import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate, CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface DomainStackProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  domainName: string;
}

export class DomainStack extends Stack {
  public readonly hostedZone: IHostedZone;
  public readonly certificate: Certificate;
  public readonly apiCertificate: Certificate;

  constructor(scope: Construct, id: string, props: DomainStackProps) {
    super(scope, id, props);

    const { stage, domainName } = props;

    // Hosted Zone para el dominio principal
    this.hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName: domainName,
      comment: `MerchConnect México ${stage} hosted zone`,
    });

    // Certificado para la web app (wildcard para subdominios)
    this.certificate = new DnsValidatedCertificate(this, 'WebCertificate', {
      domainName: `*.${domainName}`,
      subjectAlternativeNames: [domainName],
      hostedZone: this.hostedZone,
      region: 'us-east-1', // CloudFront requiere certificados en us-east-1
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    // Certificado para API Gateway
    this.apiCertificate = new DnsValidatedCertificate(this, 'ApiCertificate', {
      domainName: `api-${stage}.${domainName}`,
      hostedZone: this.hostedZone,
      region: this.region,
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    // Outputs
    new CfnOutput(this, 'HostedZoneId', {
      value: this.hostedZone.hostedZoneId,
      description: 'Route 53 Hosted Zone ID',
    });

    new CfnOutput(this, 'HostedZoneNameServers', {
      value: this.hostedZone.hostedZoneNameServers?.join(',') || '',
      description: 'Route 53 Name Servers',
    });

    new CfnOutput(this, 'WebCertificateArn', {
      value: this.certificate.certificateArn,
      description: 'Web Certificate ARN',
    });

    new CfnOutput(this, 'ApiCertificateArn', {
      value: this.apiCertificate.certificateArn,
      description: 'API Certificate ARN',
    });

    // Tags
    Tags.of(this).add('App', 'MerchConnect');
    Tags.of(this).add('Stage', stage);
    Tags.of(this).add('Owner', 'Jahaziel');
    Tags.of(this).add('Component', 'Domain');
  }
}
