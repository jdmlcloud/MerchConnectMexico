import { AuthClaims } from '@merchconnect/types';
export declare function signClaims(claims: AuthClaims, secret: string): Promise<string>;
export declare function verifyClaims(token: string, secret: string): Promise<AuthClaims>;
export declare function requireStage<T extends {
    stage: string;
}>(claims: T, stage: 'dev' | 'sbx' | 'prod'): void;
export declare function requirePermission(perms: string[], required: string | string[]): void;
