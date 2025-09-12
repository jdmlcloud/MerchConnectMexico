import { z } from 'zod';
export const StageSchema = z.enum(['dev', 'sbx', 'prod']);
export const PlanKeySchema = z.enum(['free', 'pro', 'premium']);
export const OrgTypeSchema = z.enum(['workshop', 'provider']);
export const AuthClaimsSchema = z.object({
    stage: StageSchema,
    orgId: z.string().min(1),
    orgType: OrgTypeSchema,
    plan: PlanKeySchema,
    features: z.array(z.string()).default([]),
    roles: z.array(z.string()).default([]),
    perms: z.array(z.string()).default([])
});
export const FeatureKeySchema = z.enum([
    'landingEditable',
    'seoControls',
    'whatsappIntegration',
    'prioritySupport'
]);
export const PaginationSchema = z.object({
    limit: z.number().int().positive().max(100).default(20),
    cursor: z.string().optional()
});
export * as zod from 'zod';
