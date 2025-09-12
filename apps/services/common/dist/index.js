import { z } from 'zod';
import { createDynamoClient } from '@merchconnect/data';
export const EnvSchema = z.object({
    STAGE: z.enum(['dev', 'sbx', 'prod']),
    AWS_REGION: z.string().default('us-east-1'),
});
export function getEnv() {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
        throw new Error(`Env inválido: ${parsed.error.message}`);
    }
    return parsed.data;
}
export function getDdb() {
    const env = getEnv();
    return createDynamoClient(env.AWS_REGION);
}
