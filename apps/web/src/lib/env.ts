import { z } from 'zod';

const StageSchema = z.enum(['dev', 'sbx', 'prod']);

const EnvSchema = z.object({
  NEXT_PUBLIC_STAGE: StageSchema,
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  COGNITO_USER_POOL_ID: z.string().min(1),
  COGNITO_CLIENT_ID: z.string().min(1),
  API_BASE_URL: z.string().url(),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function getEnv(): AppEnv {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid env: ${parsed.error.message}`);
  }
  const e = parsed.data;
  // Runtime stage guards: API and Cognito must match stage prefixes
  const stagePrefix = e.NEXT_PUBLIC_STAGE;
  if (!e.API_BASE_URL.includes(`/v1`)) throw new Error('API_BASE_URL must end with /v1');
  if (stagePrefix === 'dev' && !e.API_BASE_URL.includes('dev')) throw new Error('Stage dev mismatch');
  if (stagePrefix === 'sbx' && !e.API_BASE_URL.includes('sbx')) throw new Error('Stage sbx mismatch');
  if (stagePrefix === 'prod' && e.API_BASE_URL.includes('dev')) throw new Error('Stage prod mismatch');
  return e;
}
