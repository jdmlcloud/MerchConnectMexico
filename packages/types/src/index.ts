import { z } from 'zod';

export const StageSchema = z.enum(['dev', 'sbx', 'prod']);
export type Stage = z.infer<typeof StageSchema>;

export const PlanKeySchema = z.enum(['free', 'pro', 'premium']);
export type PlanKey = z.infer<typeof PlanKeySchema>;

export const OrgTypeSchema = z.enum(['workshop', 'provider']);
export type OrgType = z.infer<typeof OrgTypeSchema>;

export const AuthClaimsSchema = z.object({
  stage: StageSchema,
  orgId: z.string().min(1),
  orgType: OrgTypeSchema,
  plan: PlanKeySchema,
  features: z.array(z.string()).default([]),
  roles: z.array(z.string()).default([]),
  perms: z.array(z.string()).default([])
});
export type AuthClaims = z.infer<typeof AuthClaimsSchema>;

export const FeatureKeySchema = z.enum([
  'landingEditable',
  'seoControls',
  'whatsappIntegration',
  'prioritySupport'
]);
export type FeatureKey = z.infer<typeof FeatureKeySchema>;

export const PaginationSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  cursor: z.string().optional()
});
export type Pagination = z.infer<typeof PaginationSchema>;

export * as zod from 'zod';
