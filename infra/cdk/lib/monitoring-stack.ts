import { Stack, StackProps, CfnOutput, Tags, Duration } from 'aws-cdk-lib';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Alarm, Metric, ComparisonOperator, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export interface MonitoringStackProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  webDistributionId: string;
  apiDistributionId: string;
  alarmEmail: string;
}

export class MonitoringStack extends Stack {
  public readonly logGroup: LogGroup;
  public readonly alarmTopic: Topic;

  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    const { stage, webDistributionId, apiDistributionId, alarmEmail } = props;

    // Log Group para la aplicación
    this.logGroup = new LogGroup(this, 'ApplicationLogGroup', {
      logGroupName: `/aws/merchconnect/${stage}/application`,
      retention: stage === 'prod' ? RetentionDays.ONE_YEAR : RetentionDays.ONE_MONTH,
    });

    // SNS Topic para alertas
    this.alarmTopic = new Topic(this, 'AlarmTopic', {
      topicName: `merchconnect-${stage}-alarms`,
      displayName: `MerchConnect ${stage} Alarms`,
    });

    // Suscripción por email (solo para prod)
    if (stage === 'prod') {
      this.alarmTopic.addSubscription(new EmailSubscription(alarmEmail));
    }

    // Alarmas de CloudFront
    const cloudFrontErrorRateAlarm = new Alarm(this, 'CloudFrontErrorRateAlarm', {
      alarmName: `merchconnect-${stage}-cloudfront-error-rate`,
      alarmDescription: 'High error rate in CloudFront distribution',
      metric: new Metric({
        namespace: 'AWS/CloudFront',
        metricName: '4xxErrorRate',
        dimensionsMap: {
          DistributionId: webDistributionId,
        },
        statistic: 'Average',
        period: Duration.minutes(5),
      }),
      threshold: 5, // 5% error rate
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    const cloudFrontCacheHitRateAlarm = new Alarm(this, 'CloudFrontCacheHitRateAlarm', {
      alarmName: `merchconnect-${stage}-cloudfront-cache-hit-rate`,
      alarmDescription: 'Low cache hit rate in CloudFront distribution',
      metric: new Metric({
        namespace: 'AWS/CloudFront',
        metricName: 'CacheHitRate',
        dimensionsMap: {
          DistributionId: webDistributionId,
        },
        statistic: 'Average',
        period: Duration.minutes(5),
      }),
      threshold: 80, // 80% cache hit rate
      evaluationPeriods: 3,
      comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    // Alarmas de API Gateway
    const apiGatewayErrorRateAlarm = new Alarm(this, 'ApiGatewayErrorRateAlarm', {
      alarmName: `merchconnect-${stage}-apigateway-error-rate`,
      alarmDescription: 'High error rate in API Gateway',
      metric: new Metric({
        namespace: 'AWS/ApiGateway',
        metricName: '4XXError',
        statistic: 'Sum',
        period: Duration.minutes(5),
      }),
      threshold: 10, // 10 errors in 5 minutes
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    const apiGatewayLatencyAlarm = new Alarm(this, 'ApiGatewayLatencyAlarm', {
      alarmName: `merchconnect-${stage}-apigateway-latency`,
      alarmDescription: 'High latency in API Gateway',
      metric: new Metric({
        namespace: 'AWS/ApiGateway',
        metricName: 'Latency',
        statistic: 'Average',
        period: Duration.minutes(5),
      }),
      threshold: 5000, // 5 seconds
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    // Alarmas de DynamoDB
    const dynamoDBThrottleAlarm = new Alarm(this, 'DynamoDBThrottleAlarm', {
      alarmName: `merchconnect-${stage}-dynamodb-throttle`,
      alarmDescription: 'DynamoDB throttling detected',
      metric: new Metric({
        namespace: 'AWS/DynamoDB',
        metricName: 'ThrottledRequests',
        dimensionsMap: {
          TableName: `MerchConnect-${stage}`,
        },
        statistic: 'Sum',
        period: Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    // Alarmas de Lambda
    const lambdaErrorAlarm = new Alarm(this, 'LambdaErrorAlarm', {
      alarmName: `merchconnect-${stage}-lambda-errors`,
      alarmDescription: 'High error rate in Lambda functions',
      metric: new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Errors',
        statistic: 'Sum',
        period: Duration.minutes(5),
      }),
      threshold: 5,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    const lambdaDurationAlarm = new Alarm(this, 'LambdaDurationAlarm', {
      alarmName: `merchconnect-${stage}-lambda-duration`,
      alarmDescription: 'High duration in Lambda functions',
      metric: new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Duration',
        statistic: 'Average',
        period: Duration.minutes(5),
      }),
      threshold: 30000, // 30 seconds
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    // Asociar alarmas con SNS
    const alarmAction = new SnsAction(this.alarmTopic);
    
    cloudFrontErrorRateAlarm.addAlarmAction(alarmAction);
    cloudFrontCacheHitRateAlarm.addAlarmAction(alarmAction);
    apiGatewayErrorRateAlarm.addAlarmAction(alarmAction);
    apiGatewayLatencyAlarm.addAlarmAction(alarmAction);
    dynamoDBThrottleAlarm.addAlarmAction(alarmAction);
    lambdaErrorAlarm.addAlarmAction(alarmAction);
    lambdaDurationAlarm.addAlarmAction(alarmAction);

    // Outputs
    new CfnOutput(this, 'LogGroupName', {
      value: this.logGroup.logGroupName,
      description: 'Application Log Group Name',
    });

    new CfnOutput(this, 'AlarmTopicArn', {
      value: this.alarmTopic.topicArn,
      description: 'Alarm SNS Topic ARN',
    });

    // Tags
    Tags.of(this).add('App', 'MerchConnect');
    Tags.of(this).add('Stage', stage);
    Tags.of(this).add('Owner', 'Jahaziel');
    Tags.of(this).add('Component', 'Monitoring');
  }
}
