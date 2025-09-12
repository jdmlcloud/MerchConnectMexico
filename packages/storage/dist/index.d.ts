import { S3Client } from '@aws-sdk/client-s3';
export type Stage = 'dev' | 'sbx' | 'prod';
export declare function assetBucket(stage: Stage): string;
export declare function publicBucket(stage: Stage): string;
export declare function orgAssetPrefix(orgId: string): string;
export declare function orgPublicPrefix(orgId: string): string;
export declare function putPublicPage(client: S3Client, stage: Stage, orgId: string, slug: string, body: string): Promise<{
    bucket: string;
    key: string;
}>;
