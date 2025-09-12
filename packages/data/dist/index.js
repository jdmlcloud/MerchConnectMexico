import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export function createDynamoClient(region) {
    const client = new DynamoDBClient({ region });
    return DynamoDBDocumentClient.from(client);
}
export function tableName(stage) {
    return `MerchConnect-${stage}`;
}
export const keys = {
    orgPk: (orgId) => `ORG#${orgId}`,
    userSk: (userId) => `USER#${userId}`,
    planPk: (plan) => `PLAN#${plan}`,
    featureSk: (key) => `FEATURE#${key}`,
    pageSk: (slug) => `PAGE#${slug}`,
    rfqSk: (id) => `RFQ#${id}`,
    quoteSk: (providerOrgId, id) => `QUOTE#${providerOrgId}#${id}`,
    orderSk: (id) => `ORDER#${id}`,
    auditPk: (date) => `AUDIT#${date}`,
    tsSk: (timestamp, actor, action) => `TS#${timestamp}#${actor}#${action}`,
};
