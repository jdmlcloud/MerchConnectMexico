export interface Feature {
    id: string;
    name: string;
    description: string;
    category: 'core' | 'premium' | 'enterprise' | 'custom';
    icon: string;
    enabled: boolean;
    requiredPlan?: string[];
    customRules?: {
        orgId?: string[];
        stage?: string[];
        conditions?: Record<string, any>;
    };
    dependencies?: string[];
    metadata?: {
        version: string;
        lastUpdated: string;
        createdBy: string;
    };
}
export interface FeatureOverride {
    id: string;
    featureId: string;
    orgId: string;
    enabled: boolean;
    customConfig?: Record<string, any>;
    expiresAt?: string;
    reason?: string;
    createdBy: string;
    createdAt: string;
}
export interface PlanFeatures {
    planId: string;
    planName: string;
    features: string[];
    customFeatures?: string[];
    overrides?: FeatureOverride[];
}
export interface FeatureContext {
    orgId: string;
    plan: string;
    stage: string;
    userId: string;
    role: string;
    customData?: Record<string, any>;
}
export interface FeatureCheckResult {
    hasAccess: boolean;
    reason?: string;
    alternatives?: string[];
    upgradeRequired?: boolean;
}
export declare const FEATURE_CATEGORIES: {
    readonly CORE: "core";
    readonly PREMIUM: "premium";
    readonly ENTERPRISE: "enterprise";
    readonly CUSTOM: "custom";
};
export declare const DEFAULT_PLAN_FEATURES: Record<string, string[]>;
export declare const AVAILABLE_FEATURES: Feature[];
