import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { CfnWebACL, CfnWebACLAssociation, CfnRuleGroup } from 'aws-cdk-lib/aws-wafv2';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

export interface WafStackProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  webDistribution: CloudFrontWebDistribution;
  apiDistribution: CloudFrontWebDistribution;
}

export class WafStack extends Stack {
  public readonly webAcl: CfnWebACL;

  constructor(scope: Construct, id: string, props: WafStackProps) {
    super(scope, id, props);

    const { stage, webDistribution, apiDistribution } = props;

    // Rate limiting rule group
    const rateLimitRuleGroup = new CfnRuleGroup(this, 'RateLimitRuleGroup', {
      name: `merchconnect-${stage}-rate-limit-rules`,
      description: 'Rate limiting rules for MerchConnect',
      scope: 'CLOUDFRONT',
      capacity: 100,
      rules: [
        {
          name: 'RateLimitRule',
          priority: 1,
          statement: {
            rateBasedStatement: {
              limit: 2000, // 2000 requests per 5 minutes
              aggregateKeyType: 'IP',
            },
          },
          action: {
            block: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimitRule',
          },
        },
      ],
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'RateLimitRuleGroup',
      },
    });

    // Geo blocking rule group (solo México)
    const geoBlockRuleGroup = new CfnRuleGroup(this, 'GeoBlockRuleGroup', {
      name: `merchconnect-${stage}-geo-block-rules`,
      description: 'Geo blocking rules for MerchConnect (Mexico only)',
      scope: 'CLOUDFRONT',
      capacity: 50,
      rules: [
        {
          name: 'GeoBlockRule',
          priority: 1,
          statement: {
            notStatement: {
              statement: {
                geoMatchStatement: {
                  countryCodes: ['MX'], // Solo México
                },
              },
            },
          },
          action: {
            block: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'GeoBlockRule',
          },
        },
      ],
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'GeoBlockRuleGroup',
      },
    });

    // Web ACL principal
    this.webAcl = new CfnWebACL(this, 'WebACL', {
      name: `merchconnect-${stage}-web-acl`,
      description: `MerchConnect ${stage} Web ACL`,
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      rules: [
        // AWS Managed Rules
        {
          name: 'AWSManagedRulesCommonRuleSet',
          priority: 1,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRulesCommonRuleSet',
          },
        },
        {
          name: 'AWSManagedRulesSQLiRuleSet',
          priority: 2,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesSQLiRuleSet',
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRulesSQLiRuleSet',
          },
        },
        {
          name: 'AWSManagedRulesKnownBadInputsRuleSet',
          priority: 3,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesKnownBadInputsRuleSet',
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRulesKnownBadInputsRuleSet',
          },
        },
        {
          name: 'AWSManagedRulesLinuxOperatingSystemRuleSet',
          priority: 4,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesLinuxOperatingSystemRuleSet',
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRulesLinuxOperatingSystemRuleSet',
          },
        },
        // Custom rules
        {
          name: 'RateLimitRule',
          priority: 10,
          statement: {
            ruleGroupReferenceStatement: {
              arn: rateLimitRuleGroup.attrArn,
            },
          },
          action: {
            block: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimitRule',
          },
        },
        {
          name: 'GeoBlockRule',
          priority: 11,
          statement: {
            ruleGroupReferenceStatement: {
              arn: geoBlockRuleGroup.attrArn,
            },
          },
          action: {
            block: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'GeoBlockRule',
          },
        },
      ],
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'MerchConnectWebACL',
      },
    });

    // Asociar WAF con CloudFront distributions
    new CfnWebACLAssociation(this, 'WebDistributionAssociation', {
      resourceArn: `arn:aws:cloudfront::${this.account}:distribution/${webDistribution.distributionId}`,
      webAclArn: this.webAcl.attrArn,
    });

    new CfnWebACLAssociation(this, 'ApiDistributionAssociation', {
      resourceArn: `arn:aws:cloudfront::${this.account}:distribution/${apiDistribution.distributionId}`,
      webAclArn: this.webAcl.attrArn,
    });

    // Outputs
    new CfnOutput(this, 'WebACLArn', {
      value: this.webAcl.attrArn,
      description: 'Web ACL ARN',
    });

    new CfnOutput(this, 'WebACLId', {
      value: this.webAcl.attrId,
      description: 'Web ACL ID',
    });

    // Tags
    Tags.of(this).add('App', 'MerchConnect');
    Tags.of(this).add('Stage', stage);
    Tags.of(this).add('Owner', 'Jahaziel');
    Tags.of(this).add('Component', 'WAF');
  }
}
