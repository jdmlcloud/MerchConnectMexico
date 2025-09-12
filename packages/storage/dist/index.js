import { PutObjectCommand } from '@aws-sdk/client-s3';
export function assetBucket(stage) {
    return `mc-${stage}-assets`;
}
export function publicBucket(stage) {
    return `mc-${stage}-public`;
}
export function orgAssetPrefix(orgId) {
    return `orgs/${orgId}/assets/`;
}
export function orgPublicPrefix(orgId) {
    return `orgs/${orgId}/`;
}
export async function putPublicPage(client, stage, orgId, slug, body) {
    const Key = `${orgPublicPrefix(orgId)}pages/${slug}.html`;
    await client.send(new PutObjectCommand({
        Bucket: publicBucket(stage),
        Key,
        Body: body,
        ContentType: 'text/html; charset=utf-8',
    }));
    return { bucket: publicBucket(stage), key: Key };
}
