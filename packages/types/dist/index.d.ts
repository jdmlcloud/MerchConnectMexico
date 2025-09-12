import { z } from 'zod';
export declare const StageSchema: z.ZodEnum<["dev", "sbx", "prod"]>;
export type Stage = z.infer<typeof StageSchema>;
export declare const PlanKeySchema: z.ZodEnum<["free", "pro", "premium"]>;
export type PlanKey = z.infer<typeof PlanKeySchema>;
export declare const OrgTypeSchema: z.ZodEnum<["workshop", "provider"]>;
export type OrgType = z.infer<typeof OrgTypeSchema>;
export declare const AuthClaimsSchema: z.ZodObject<{
    stage: z.ZodEnum<["dev", "sbx", "prod"]>;
    orgId: z.ZodString;
    orgType: z.ZodEnum<["workshop", "provider"]>;
    plan: z.ZodEnum<["free", "pro", "premium"]>;
    features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    roles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    perms: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    stage: "dev" | "sbx" | "prod";
    orgId: string;
    orgType: "workshop" | "provider";
    plan: "premium" | "pro" | "free";
    features: string[];
    roles: string[];
    perms: string[];
}, {
    stage: "dev" | "sbx" | "prod";
    orgId: string;
    orgType: "workshop" | "provider";
    plan: "premium" | "pro" | "free";
    features?: string[] | undefined;
    roles?: string[] | undefined;
    perms?: string[] | undefined;
}>;
export type AuthClaims = z.infer<typeof AuthClaimsSchema>;
export declare const FeatureKeySchema: z.ZodEnum<["landingEditable", "seoControls", "whatsappIntegration", "prioritySupport"]>;
export type FeatureKey = z.infer<typeof FeatureKeySchema>;
export declare const PaginationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export type Pagination = z.infer<typeof PaginationSchema>;
export * from './features.js';
export * as zod from 'zod';
