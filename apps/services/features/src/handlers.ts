import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getDdb } from '@merchconnect/svc-common';
import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { keys, tableName } from '@merchconnect/data';

function genId(prefix = 'ovr') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const createOverride: APIGatewayProxyHandlerV2 = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const { orgId, featureId, enabled, customConfig, expiresAt, createdBy } = body || {};
  if (!orgId || !featureId || typeof enabled !== 'boolean') {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid' }) };
  }
  const id = genId('override');
  const item = {
    pk: keys.orgPk(orgId),
    sk: `FEATURE_OVERRIDE#${id}`,
    featureId,
    enabled,
    customConfig: customConfig || {},
    expiresAt: expiresAt || null,
    createdBy: createdBy || 'system',
    createdAt: new Date().toISOString(),
  };
  const ddb = getDdb();
  await ddb.send(new PutCommand({ TableName: tableName(process.env.STAGE as any), Item: item }));
  return { statusCode: 201, body: JSON.stringify(item) };
};

export const listOverrides: APIGatewayProxyHandlerV2 = async (event) => {
  const orgId = event.pathParameters?.orgId || (event.queryStringParameters && event.queryStringParameters.orgId);
  if (!orgId) return { statusCode: 400, body: JSON.stringify({ error: 'orgId required' }) };
  const ddb = getDdb();
  const resp = await ddb.send(new QueryCommand({
    TableName: tableName(process.env.STAGE as any),
    KeyConditionExpression: 'pk = :p and begins_with(sk, :s)',
    ExpressionAttributeValues: { ':p': keys.orgPk(orgId), ':s': 'FEATURE_OVERRIDE#' }
  }));
  return { statusCode: 200, body: JSON.stringify(resp.Items || []) };
};

export const updateOverride: APIGatewayProxyHandlerV2 = async (event) => {
  const orgId = event.pathParameters?.orgId;
  const overrideId = event.pathParameters?.overrideId;
  if (!orgId || !overrideId) return { statusCode: 400, body: JSON.stringify({ error: 'invalid' }) };
  const body = event.body ? JSON.parse(event.body) : {};
  const { enabled, customConfig, expiresAt } = body || {};
  const updates: string[] = [];
  const exprAttr: any = { ':now': new Date().toISOString() };
  if (typeof enabled === 'boolean') { updates.push('enabled = :e'); exprAttr[':e'] = enabled; }
  if (customConfig !== undefined) { updates.push('customConfig = :c'); exprAttr[':c'] = customConfig; }
  if (expiresAt !== undefined) { updates.push('expiresAt = :x'); exprAttr[':x'] = expiresAt; }
  if (updates.length === 0) return { statusCode: 400, body: JSON.stringify({ error: 'no updates' }) };
  const updateExpr = 'SET ' + updates.join(', ') + ', updatedAt = :now';
  const ddb = getDdb();
  await ddb.send(new UpdateCommand({
    TableName: tableName(process.env.STAGE as any),
    Key: { pk: keys.orgPk(orgId), sk: `FEATURE_OVERRIDE#${overrideId}` },
    UpdateExpression: updateExpr,
    ExpressionAttributeValues: exprAttr,
  }));
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};

export const deleteOverride: APIGatewayProxyHandlerV2 = async (event) => {
  const orgId = event.pathParameters?.orgId;
  const overrideId = event.pathParameters?.overrideId;
  if (!orgId || !overrideId) return { statusCode: 400, body: JSON.stringify({ error: 'invalid' }) };
  const ddb = getDdb();
  await ddb.send(new DeleteCommand({ TableName: tableName(process.env.STAGE as any), Key: { pk: keys.orgPk(orgId), sk: `FEATURE_OVERRIDE#${overrideId}` } }));
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};


