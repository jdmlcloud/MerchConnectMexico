import { Feature, FeatureOverride, PlanFeatures, FeatureContext, FeatureCheckResult } from '@merchconnect/types';
export declare class FeatureFlagService {
    private features;
    private planFeatures;
    private overrides;
    constructor();
    private initializeFeatures;
    private getPlanDisplayName;
    createFeature(feature: Omit<Feature, 'id' | 'metadata'>): Promise<Feature>;
    updateFeature(featureId: string, updates: Partial<Feature>): Promise<Feature | null>;
    deleteFeature(featureId: string): Promise<boolean>;
    toggleFeature(featureId: string, enabled: boolean): Promise<boolean>;
    updatePlanFeatures(planId: string, features: string[]): Promise<PlanFeatures>;
    addFeatureToPlan(planId: string, featureId: string): Promise<boolean>;
    removeFeatureFromPlan(planId: string, featureId: string): Promise<boolean>;
    createFeatureOverride(override: Omit<FeatureOverride, 'id' | 'createdAt'>): Promise<FeatureOverride>;
    updateFeatureOverride(orgId: string, overrideId: string, updates: Partial<FeatureOverride>): Promise<FeatureOverride | null>;
    removeFeatureOverride(orgId: string, overrideId: string): Promise<boolean>;
    hasFeature(context: FeatureContext, featureId: string): Promise<FeatureCheckResult>;
    getAvailableFeatures(context: FeatureContext): Promise<Feature[]>;
    private getOrganizationOverride;
    private checkCustomRules;
    private evaluateConditions;
    private getAlternativeFeatures;
    private generateFeatureId;
    private generateOverrideId;
    getAllFeatures(): Promise<Feature[]>;
    getFeaturesByCategory(category: string): Promise<Feature[]>;
    getAllPlans(): Promise<PlanFeatures[]>;
    getOrganizationOverrides(orgId: string): Promise<FeatureOverride[]>;
    getFeatureUsage(featureId: string): Promise<{
        totalOrgs: number;
        enabledOrgs: number;
    }>;
}
export declare const featureFlagService: FeatureFlagService;
