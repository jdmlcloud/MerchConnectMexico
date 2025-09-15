import { S3Client } from '@aws-sdk/client-s3';
import { putPublicPage } from '@merchconnect/storage';
import type { SQSHandler } from 'aws-lambda';
import { getEnv } from '@merchconnect/svc-common';

interface PublishMessage {
  orgId: string;
  slug: string;
  html: string;
}

export const handler: SQSHandler = async (event) => {
  const env = getEnv();
  const s3 = new S3Client({ region: env.AWS_REGION });
  for (const record of event.Records) {
    const body = JSON.parse(record.body) as PublishMessage;
    await putPublicPage(s3, env.STAGE, body.orgId, body.slug, body.html);
    console.log(`Published page org=${body.orgId} slug=${body.slug}`);

    // Invalidate CloudFront if distribution configured
    if (process.env.CLOUDFRONT_DISTRIBUTION_ID) {
      try {
        const { CloudFrontClient, CreateInvalidationCommand } = await import('@aws-sdk/client-cloudfront');
        const cf = new CloudFrontClient({ region: env.AWS_REGION });
        const cmd = new CreateInvalidationCommand({
          DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
          InvalidationBatch: {
            CallerReference: `mc-inval-${Date.now()}`,
            Paths: { Quantity: 1, Items: [`/orgs/${body.orgId}/*`] }
          }
        });
        await cf.send(cmd);
        console.log('CloudFront invalidation created');
      } catch (err) {
        console.warn('CloudFront invalidation failed', err);
      }
    }
  }
};
