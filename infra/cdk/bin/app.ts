#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aspects, Tags } from 'aws-cdk-lib';
import { Stage } from '@merchconnect/types';
import { DataStack } from '../lib/data-stack';
import { ApiStack } from '../lib/api-stack';
import { IdentityStack } from '../lib/identity-stack';
import { AsyncStack } from '../lib/async-stack';
import { WebStack } from '../lib/web-stack';

const stage = (process.env.STAGE as Stage) || 'dev';
if (!['dev', 'sbx', 'prod'].includes(stage)) {
  throw new Error('STAGE inválido. Use dev|sbx|prod');
}

const account = process.env.CDK_DEFAULT_ACCOUNT || 'TODO_ACCOUNT_ID';
const region = process.env.CDK_DEFAULT_REGION || 'us-east-1';

const app = new App();

Aspects.of(app).add({
  visit: (node: any) => {
    try {
      Tags.of(node).add('App', 'MerchConnect');
      Tags.of(node).add('Stage', stage);
      Tags.of(node).add('Owner', 'Jahaziel');
    } catch {}
  },
});

const data = new DataStack(app, `mc-${stage}-data`, {
  env: { account, region },
  description: `MerchConnect ${stage} Data Stack`,
  stage,
});

const identity = new IdentityStack(app, `mc-${stage}-identity`, {
  env: { account, region },
  description: `MerchConnect ${stage} Identity Stack`,
  stage,
});

const asyncStack = new AsyncStack(app, `mc-${stage}-async`, {
  env: { account, region },
  description: `MerchConnect ${stage} Async Stack`,
  stage,
});

const api = new ApiStack(app, `mc-${stage}-api`, {
  env: { account, region },
  description: `MerchConnect ${stage} API Stack`,
  stage,
  dataTable: data.table,
  queue: asyncStack.pagesQueue,
  userPool: identity.userPool,
});

new WebStack(app, `mc-${stage}-web`, {
  env: { account, region },
  description: `MerchConnect ${stage} Web Stack`,
  stage,
  distributionOrigins: [api.httpApiUrl],
});
