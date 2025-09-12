import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export function createDynamoClient(region: string) {
  const client = new DynamoDBClient({ region });
  return DynamoDBDocumentClient.from(client);
}

export function tableName(stage: 'dev' | 'sbx' | 'prod') {
  return `MerchConnect-${stage}`;
}

export const keys = {
  orgPk: (orgId: string) => `ORG#${orgId}`,
  userSk: (userId: string) => `USER#${userId}`,
  planPk: (plan: string) => `PLAN#${plan}`,
  featureSk: (key: string) => `FEATURE#${key}`,
  pageSk: (slug: string) => `PAGE#${slug}`,
  rfqSk: (id: string) => `RFQ#${id}`,
  quoteSk: (providerOrgId: string, id: string) => `QUOTE#${providerOrgId}#${id}`,
  orderSk: (id: string) => `ORDER#${id}`,
  auditPk: (date: string) => `AUDIT#${date}`,
  tsSk: (timestamp: string, actor: string, action: string) => `TS#${timestamp}#${actor}#${action}`,
};
