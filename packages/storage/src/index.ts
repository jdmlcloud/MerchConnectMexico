import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export type Stage = 'dev' | 'sbx' | 'prod';

export function assetBucket(stage: Stage) {
  return `mc-${stage}-assets`;
}
export function publicBucket(stage: Stage) {
  return `mc-${stage}-public`;
}

export function orgAssetPrefix(orgId: string) {
  return `orgs/${orgId}/assets/`;
}
export function orgPublicPrefix(orgId: string) {
  return `orgs/${orgId}/`;
}

export async function putPublicPage(
  client: S3Client,
  stage: Stage,
  orgId: string,
  slug: string,
  body: string,
) {
  const Key = `${orgPublicPrefix(orgId)}pages/${slug}.html`;
  await client.send(
    new PutObjectCommand({
      Bucket: publicBucket(stage),
      Key,
      Body: body,
      ContentType: 'text/html; charset=utf-8',
    }),
  );
  return { bucket: publicBucket(stage), key: Key };
}
