import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { AuthClaims, AuthClaimsSchema } from '@merchconnect/types';

export async function signClaims(claims: AuthClaims, secret: string) {
  const payload: JWTPayload = { ...claims };
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(new TextEncoder().encode(secret));
}

export async function verifyClaims(token: string, secret: string): Promise<AuthClaims> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  const parsed = AuthClaimsSchema.safeParse(payload);
  if (!parsed.success) throw new Error('Invalid claims');
  return parsed.data;
}

export function requireStage<T extends { stage: string }>(claims: T, stage: 'dev' | 'sbx' | 'prod') {
  if (claims.stage !== stage) throw new Error('Stage mismatch');
}

export function requirePermission(perms: string[], required: string | string[]) {
  const list = Array.isArray(required) ? required : [required];
  const ok = list.every((p) => perms.includes(p));
  if (!ok) throw new Error('Missing permission');
}
