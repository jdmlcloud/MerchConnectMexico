#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const merchconnect_stack_1 = require("../lib/merchconnect-stack");
const stage = process.env.STAGE || 'dev';
if (!['dev', 'sbx', 'prod'].includes(stage)) {
    throw new Error('STAGE inválido. Use dev|sbx|prod');
}
const account = process.env.CDK_DEFAULT_ACCOUNT || 'TODO_ACCOUNT_ID';
const region = process.env.CDK_DEFAULT_REGION || 'us-east-1';
// GitHub configuration
const githubOwner = process.env.GITHUB_OWNER || 'jdmlcloud';
const githubRepo = process.env.GITHUB_REPO || 'MerchConnectMexico';
const githubBranch = process.env.GITHUB_BRANCH || (stage === 'dev' ? 'develop' : stage === 'sbx' ? 'sandbox' : 'main');
const githubConnectionArn = process.env.GITHUB_CONNECTION_ARN || 'arn:aws:codeconnections:us-east-1:209350187548:connection/dc84f0a6-30c7-4282-aa1d-25271ea24b7b';
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
new merchconnect_stack_1.MerchConnectStack(app, `mc-${stage}`, {
    env: { account, region },
    description: `MerchConnect ${stage} Stack`,
    stage,
    githubOwner,
    githubRepo,
    githubBranch,
    githubConnectionArn,
});
