"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_apigatewayv2_1 = require("aws-cdk-lib/aws-apigatewayv2");
class ApiStack extends aws_cdk_lib_1.Stack {
    httpApi;
    httpApiUrl;
    constructor(scope, id, props) {
        super(scope, id, props);
        const allowedOrigins = props.stage === 'dev'
            ? ['https://dev.app.dominio.com']
            : props.stage === 'sbx'
                ? ['https://sbx.app.dominio.com']
                : ['https://app.dominio.com'];
        const api = new aws_apigatewayv2_1.HttpApi(this, 'HttpApi', {
            apiName: `mc-${props.stage}-api`,
            corsPreflight: {
                allowHeaders: ['Content-Type', 'Authorization'],
                allowMethods: [aws_apigatewayv2_1.CorsHttpMethod.ANY],
                allowOrigins: allowedOrigins,
            },
            createDefaultStage: false,
        });
        aws_cdk_lib_1.Tags.of(api).add('Stage', props.stage);
        new aws_apigatewayv2_1.CfnStage(this, 'V1Stage', {
            apiId: api.apiId,
            stageName: 'v1',
            autoDeploy: true,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'ApiEndpoint', { value: `${api.apiEndpoint}/v1` });
        this.httpApi = api;
        this.httpApiUrl = `${api.apiEndpoint}/v1`;
    }
}
exports.ApiStack = ApiStack;
