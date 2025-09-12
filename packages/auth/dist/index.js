import { SignJWT, jwtVerify } from 'jose';
import { AuthClaimsSchema } from '@merchconnect/types';
export async function signClaims(claims, secret) {
    const payload = { ...claims };
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('8h')
        .sign(new TextEncoder().encode(secret));
}
export async function verifyClaims(token, secret) {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const parsed = AuthClaimsSchema.safeParse(payload);
    if (!parsed.success)
        throw new Error('Invalid claims');
    return parsed.data;
}
export function requireStage(claims, stage) {
    if (claims.stage !== stage)
        throw new Error('Stage mismatch');
}
export function requirePermission(perms, required) {
    const list = Array.isArray(required) ? required : [required];
    const ok = list.every((p) => perms.includes(p));
    if (!ok)
        throw new Error('Missing permission');
}
