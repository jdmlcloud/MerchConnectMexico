import { getDdb } from '@merchconnect/svc-common';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { keys, tableName } from '@merchconnect/data';
import { z } from 'zod';
const CreateOrgSchema = z.object({
    orgId: z.string().min(1),
    orgType: z.enum(['workshop', 'provider']),
    orgSlug: z.string().min(1),
    plan: z.enum(['free', 'pro', 'premium'])
});
export const createOrg = async (event) => {
    const body = event.body ? JSON.parse(event.body) : {};
    const parsed = CreateOrgSchema.safeParse(body);
    if (!parsed.success)
        return { statusCode: 400, body: JSON.stringify({ error: parsed.error.message }) };
    const ddb = getDdb();
    const item = {
        pk: keys.orgPk(parsed.data.orgId),
        sk: 'PROFILE',
        gsi1pk: `ORG#TYPE#${parsed.data.orgType}`,
        plan: parsed.data.plan,
        orgSlug: parsed.data.orgSlug,
        createdAt: new Date().toISOString()
    };
    await ddb.send(new PutCommand({ TableName: tableName(process.env.STAGE), Item: item }));
    return { statusCode: 201, body: JSON.stringify(item) };
};
export const listOrgs = async () => {
    const ddb = getDdb();
    const resp = await ddb.send(new QueryCommand({
        TableName: tableName(process.env.STAGE),
        IndexName: 'GSI1',
        KeyConditionExpression: 'gsi1pk = :g',
        ExpressionAttributeValues: { ':g': 'ORG#TYPE#provider' }
    }));
    return { statusCode: 200, body: JSON.stringify(resp.Items || []) };
};
