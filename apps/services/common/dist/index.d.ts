import { z } from 'zod';
export declare const EnvSchema: z.ZodObject<{
    STAGE: z.ZodEnum<["dev", "sbx", "prod"]>;
    AWS_REGION: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    STAGE: "dev" | "sbx" | "prod";
    AWS_REGION: string;
}, {
    STAGE: "dev" | "sbx" | "prod";
    AWS_REGION?: string | undefined;
}>;
export type Env = z.infer<typeof EnvSchema>;
export declare function getEnv(): Env;
export declare function getDdb(): import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
