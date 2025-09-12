#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aspects, Tags } from 'aws-cdk-lib';
import { Stage } from '@merchconnect/types';
import { MerchConnectStack } from '../lib/merchconnect-stack';

const stage = (process.env.STAGE as Stage) || 'dev';
if (!['dev', 'sbx', 'prod'].includes(stage)) {
  throw new Error('STAGE inválido. Use dev|sbx|prod');
}

const account = process.env.CDK_DEFAULT_ACCOUNT || 'TODO_ACCOUNT_ID';
const region = process.env.CDK_DEFAULT_REGION || 'us-east-1';

// GitHub configuration
const githubOwner = process.env.GITHUB_OWNER || 'jdmlcloud';
const githubRepo = process.env.GITHUB_REPO || 'MerchConnectMexico';
const githubBranch = process.env.GITHUB_BRANCH || (stage === 'dev' ? 'develop' : stage === 'sbx' ? 'sandbox' : 'main');
const githubTokenSecretArn = process.env.GITHUB_TOKEN_SECRET_ARN || 'arn:aws:secretsmanager:us-east-1:209350187548:secret:github-token';

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

new MerchConnectStack(app, `mc-${stage}`, {
  env: { account, region },
  description: `MerchConnect ${stage} Stack`,
  stage,
  githubOwner,
  githubRepo,
  githubBranch,
  githubTokenSecretArn,
});
