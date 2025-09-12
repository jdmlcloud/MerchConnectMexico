import { getDdb } from '@merchconnect/svc-common';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { keys, tableName } from '@merchconnect/data';
export const webhook = async (event) => {
    const body = event.body ? JSON.parse(event.body) : {};
    // Expecting body with { workshopOrgId, orderId }
    const { workshopOrgId, orderId } = body || {};
    if (!workshopOrgId || !orderId)
        return { statusCode: 400, body: JSON.stringify({ error: 'invalid' }) };
    const ddb = getDdb();
    await ddb.send(new UpdateCommand({
        TableName: tableName(process.env.STAGE),
        Key: { pk: keys.orgPk(workshopOrgId), sk: keys.orderSk(orderId) },
        UpdateExpression: 'SET paymentStatus = :p',
        ExpressionAttributeValues: { ':p': 'paid' }
    }));
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
