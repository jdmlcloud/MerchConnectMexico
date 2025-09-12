#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const data_stack_1 = require("../lib/data-stack");
const api_stack_1 = require("../lib/api-stack");
const identity_stack_1 = require("../lib/identity-stack");
const async_stack_1 = require("../lib/async-stack");
const web_stack_1 = require("../lib/web-stack");
const stage = process.env.STAGE || 'dev';
if (!['dev', 'sbx', 'prod'].includes(stage)) {
    throw new Error('STAGE inválido. Use dev|sbx|prod');
}
const account = process.env.CDK_DEFAULT_ACCOUNT || 'TODO_ACCOUNT_ID';
const region = process.env.CDK_DEFAULT_REGION || 'us-east-1';
const app = new aws_cdk_lib_1.App();
aws_cdk_lib_1.Aspects.of(app).add({
    visit: (node) => {
        try {
            aws_cdk_lib_1.Tags.of(node).add('App', 'MerchConnect');
            aws_cdk_lib_1.Tags.of(node).add('Stage', stage);
            aws_cdk_lib_1.Tags.of(node).add('Owner', 'Jahaziel');
        }
        catch { }
    },
});
const data = new data_stack_1.DataStack(app, `mc-${stage}-data`, {
    env: { account, region },
    description: `MerchConnect ${stage} Data Stack`,
    stage,
});
const identity = new identity_stack_1.IdentityStack(app, `mc-${stage}-identity`, {
    env: { account, region },
    description: `MerchConnect ${stage} Identity Stack`,
    stage,
});
const asyncStack = new async_stack_1.AsyncStack(app, `mc-${stage}-async`, {
    env: { account, region },
    description: `MerchConnect ${stage} Async Stack`,
    stage,
});
const api = new api_stack_1.ApiStack(app, `mc-${stage}-api`, {
    env: { account, region },
    description: `MerchConnect ${stage} API Stack`,
    stage,
    dataTable: data.table,
    queue: asyncStack.pagesQueue,
    userPool: identity.userPool,
});
new web_stack_1.WebStack(app, `mc-${stage}-web`, {
    env: { account, region },
    description: `MerchConnect ${stage} Web Stack`,
    stage,
    distributionOrigins: [api.httpApiUrl],
});
