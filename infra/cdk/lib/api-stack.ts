import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { HttpApi, CorsHttpMethod, CfnStage, CfnIntegration, CfnRoute } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Fn } from 'aws-cdk-lib';

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
      ? ['https://dev.merchconnectmexico.com']
      : props.stage === 'sbx'
      ? ['https://sbx.merchconnectmexico.com']
      : ['https://merchconnectmexico.com'];

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

    // Lambda functions for HTTP endpoints
    const orgsCreate = new NodejsFunction(this, 'OrgsCreateFn', {
      functionName: `mc-${props.stage}-orgs-create`,
      runtime: Runtime.NODEJS_20_X,
      entry: '../../apps/services/orgs/src/handlers.ts',
      handler: 'createOrg',
      environment: { STAGE: props.stage },
    });

    const orgsList = new NodejsFunction(this, 'OrgsListFn', {
      functionName: `mc-${props.stage}-orgs-list`,
      runtime: Runtime.NODEJS_20_X,
      entry: '../../apps/services/orgs/src/handlers.ts',
      handler: 'listOrgs',
      environment: { STAGE: props.stage },
    });

    const billingWebhook = new NodejsFunction(this, 'BillingWebhookFn', {
      functionName: `mc-${props.stage}-billing-webhook`,
      runtime: Runtime.NODEJS_20_X,
      entry: '../../apps/services/billing/src/webhook.ts',
      handler: 'webhook',
      environment: { STAGE: props.stage },
    });

    // Create integrations
    const region = Fn.select(3, Fn.split(':', this.account ? this.stackId : '')) || (this.region || 'us-east-1');
    const makeIntegrationUri = (fnArn: string) => `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${fnArn}/invocations`;

    const orgsCreateIntegration = new CfnIntegration(this, 'OrgsCreateIntegration', {
      apiId: api.apiId,
      integrationType: 'AWS_PROXY',
      integrationUri: makeIntegrationUri(orgsCreate.functionArn),
      payloadFormatVersion: '2.0',
    });

    const orgsListIntegration = new CfnIntegration(this, 'OrgsListIntegration', {
      apiId: api.apiId,
      integrationType: 'AWS_PROXY',
      integrationUri: makeIntegrationUri(orgsList.functionArn),
      payloadFormatVersion: '2.0',
    });

    const billingIntegration = new CfnIntegration(this, 'BillingIntegration', {
      apiId: api.apiId,
      integrationType: 'AWS_PROXY',
      integrationUri: makeIntegrationUri(billingWebhook.functionArn),
      payloadFormatVersion: '2.0',
    });

    // Allow API Gateway to invoke Lambdas
    orgsCreate.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [orgsCreate.functionArn],
    }));
    orgsList.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [orgsList.functionArn],
    }));
    billingWebhook.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [billingWebhook.functionArn],
    }));

    // Create JWT Authorizer using Cognito User Pool
    const issuer = `https://cognito-idp.${this.region}.amazonaws.com/${props.userPool.userPoolId}`;
    const authorizer = new CfnAuthorizer(this, 'CognitoJwtAuthorizer', {
      apiId: api.apiId,
      name: 'CognitoJwtAuthorizer',
      authorizerType: 'JWT',
      identitySource: ['$request.header.Authorization'],
      jwtConfiguration: { issuer, audience: [] },
    });

    // Routes
    new CfnRoute(this, 'CreateOrgRoute', {
      apiId: api.apiId,
      routeKey: 'POST /api/v1/orgs',
      target: `integrations/${orgsCreateIntegration.ref}`,
      authorizationType: 'JWT',
      authorizerId: authorizer.ref,
    });

    new CfnRoute(this, 'ListOrgsRoute', {
      apiId: api.apiId,
      routeKey: 'GET /api/v1/orgs',
      target: `integrations/${orgsListIntegration.ref}`,
      authorizationType: 'JWT',
      authorizerId: authorizer.ref,
    });

    new CfnRoute(this, 'BillingWebhookRoute', {
      apiId: api.apiId,
      routeKey: 'POST /api/v1/payments/mercadopago/webhook',
      target: `integrations/${billingIntegration.ref}`,
      authorizationType: 'NONE',
    });
  }
}
