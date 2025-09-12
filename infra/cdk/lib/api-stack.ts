import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { HttpApi, CorsHttpMethod, CfnStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

interface ApiProps extends StackProps {
  stage: 'dev' | 'sbx' | 'prod';
  dataTable: Table;
  queue: Queue;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  public readonly httpApi: HttpApi;
  public readonly httpApiUrl: string;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const allowedOrigins = props.stage === 'dev'
      ? ['https://dev.app.dominio.com']
      : props.stage === 'sbx'
      ? ['https://sbx.app.dominio.com']
      : ['https://app.dominio.com'];

    const api = new HttpApi(this, 'HttpApi', {
      apiName: `mc-${props.stage}-api`,
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: allowedOrigins,
      },
      createDefaultStage: false,
    });
    Tags.of(api).add('Stage', props.stage);

    new CfnStage(this, 'V1Stage', {
      apiId: api.apiId,
      stageName: 'v1',
      autoDeploy: true,
    });

    new CfnOutput(this, 'ApiEndpoint', { value: `${api.apiEndpoint}/v1` });

    this.httpApi = api;
    this.httpApiUrl = `${api.apiEndpoint}/v1`;
  }
}
