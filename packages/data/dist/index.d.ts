import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare function createDynamoClient(region: string): DynamoDBDocumentClient;
export declare function tableName(stage: 'dev' | 'sbx' | 'prod'): string;
export declare const keys: {
    orgPk: (orgId: string) => string;
    userSk: (userId: string) => string;
    planPk: (plan: string) => string;
    featureSk: (key: string) => string;
    pageSk: (slug: string) => string;
    rfqSk: (id: string) => string;
    quoteSk: (providerOrgId: string, id: string) => string;
    orderSk: (id: string) => string;
    auditPk: (date: string) => string;
    tsSk: (timestamp: string, actor: string, action: string) => string;
};
