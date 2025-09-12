import { 
  Feature, 
  FeatureOverride, 
  PlanFeatures, 
  FeatureContext, 
  FeatureCheckResult,
  AVAILABLE_FEATURES,
  DEFAULT_PLAN_FEATURES
} from '@merchconnect/types'

export class FeatureFlagService {
  private features: Map<string, Feature> = new Map()
  private planFeatures: Map<string, PlanFeatures> = new Map()
  private overrides: Map<string, FeatureOverride[]> = new Map()

  constructor() {
    this.initializeFeatures()
  }

  private initializeFeatures() {
    // Load available features
    AVAILABLE_FEATURES.forEach(feature => {
      this.features.set(feature.id, feature)
    })

    // Load default plan features
    Object.entries(DEFAULT_PLAN_FEATURES).forEach(([planId, featureIds]) => {
      this.planFeatures.set(planId, {
        planId,
        planName: this.getPlanDisplayName(planId),
        features: featureIds
      })
    })
  }

  private getPlanDisplayName(planId: string): string {
    const names: Record<string, string> = {
      basic: 'Básico',
      pro: 'Pro',
      premium: 'Premium',
      enterprise: 'Enterprise'
    }
    return names[planId] || planId
  }

  // Admin Methods - Feature Management
  async createFeature(feature: Omit<Feature, 'id' | 'metadata'>): Promise<Feature> {
    const newFeature: Feature = {
      ...feature,
      id: this.generateFeatureId(feature.name),
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        createdBy: 'admin'
      }
    }

    this.features.set(newFeature.id, newFeature)
    return newFeature
  }

  async updateFeature(featureId: string, updates: Partial<Feature>): Promise<Feature | null> {
    const feature = this.features.get(featureId)
    if (!feature) return null

    const updatedFeature: Feature = {
      ...feature,
      ...updates,
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        createdBy: 'admin',
        ...feature.metadata
      }
    }

    this.features.set(featureId, updatedFeature)
    return updatedFeature
  }

  async deleteFeature(featureId: string): Promise<boolean> {
    return this.features.delete(featureId)
  }

  async toggleFeature(featureId: string, enabled: boolean): Promise<boolean> {
    const feature = this.features.get(featureId)
    if (!feature) return false

    feature.enabled = enabled
    if (feature.metadata) {
      feature.metadata.lastUpdated = new Date().toISOString()
    }
    return true
  }

  // Admin Methods - Plan Management
  async updatePlanFeatures(planId: string, features: string[]): Promise<PlanFeatures> {
    const planFeatures: PlanFeatures = {
      planId,
      planName: this.getPlanDisplayName(planId),
      features
    }

    this.planFeatures.set(planId, planFeatures)
    return planFeatures
  }

  async addFeatureToPlan(planId: string, featureId: string): Promise<boolean> {
    const plan = this.planFeatures.get(planId)
    if (!plan) return false

    if (!plan.features.includes(featureId)) {
      plan.features.push(featureId)
    }
    return true
  }

  async removeFeatureFromPlan(planId: string, featureId: string): Promise<boolean> {
    const plan = this.planFeatures.get(planId)
    if (!plan) return false

    plan.features = plan.features.filter(id => id !== featureId)
    return true
  }

  // Admin Methods - Organization Overrides
  async createFeatureOverride(override: Omit<FeatureOverride, 'id' | 'createdAt'>): Promise<FeatureOverride> {
    const newOverride: FeatureOverride = {
      ...override,
      id: this.generateOverrideId(),
      createdAt: new Date().toISOString()
    }

    const orgOverrides = this.overrides.get(override.orgId) || []
    orgOverrides.push(newOverride)
    this.overrides.set(override.orgId, orgOverrides)

    return newOverride
  }

  async updateFeatureOverride(orgId: string, overrideId: string, updates: Partial<FeatureOverride>): Promise<FeatureOverride | null> {
    const orgOverrides = this.overrides.get(orgId) || []
    const index = orgOverrides.findIndex(o => o.id === overrideId)
    
    if (index === -1) return null

    orgOverrides[index] = { ...orgOverrides[index], ...updates }
    return orgOverrides[index]
  }

  async removeFeatureOverride(orgId: string, overrideId: string): Promise<boolean> {
    const orgOverrides = this.overrides.get(orgId) || []
    const filtered = orgOverrides.filter(o => o.id !== overrideId)
    
    if (filtered.length === orgOverrides.length) return false

    this.overrides.set(orgId, filtered)
    return true
  }

  // Feature Check Methods
  async hasFeature(context: FeatureContext, featureId: string): Promise<FeatureCheckResult> {
    const feature = this.features.get(featureId)
    if (!feature || !feature.enabled) {
      return {
        hasAccess: false,
        reason: 'Feature not available or disabled'
      }
    }

    // Check organization override first
    const orgOverride = this.getOrganizationOverride(context.orgId, featureId)
    if (orgOverride) {
      return {
        hasAccess: orgOverride.enabled,
        reason: orgOverride.enabled ? 'Organization override enabled' : 'Organization override disabled'
      }
    }

    // Check plan access
    const plan = this.planFeatures.get(context.plan)
    if (!plan || !plan.features.includes(featureId)) {
      return {
        hasAccess: false,
        reason: `Feature not included in ${context.plan} plan`,
        upgradeRequired: true,
        alternatives: this.getAlternativeFeatures(featureId, context.plan)
      }
    }

    // Check custom rules
    if (feature.customRules) {
      const customCheck = this.checkCustomRules(feature.customRules, context)
      if (!customCheck) {
        return {
          hasAccess: false,
          reason: 'Custom rules not met'
        }
      }
    }

    return { hasAccess: true }
  }

  async getAvailableFeatures(context: FeatureContext): Promise<Feature[]> {
    const plan = this.planFeatures.get(context.plan)
    if (!plan) return []

    const availableFeatures: Feature[] = []
    
    for (const featureId of plan.features) {
      const feature = this.features.get(featureId)
      if (feature && feature.enabled) {
        // Check if there's an override
        const override = this.getOrganizationOverride(context.orgId, featureId)
        if (!override || override.enabled) {
          availableFeatures.push(feature)
        }
      }
    }

    return availableFeatures
  }

  // Helper Methods
  private getOrganizationOverride(orgId: string, featureId: string): FeatureOverride | null {
    const orgOverrides = this.overrides.get(orgId) || []
    return orgOverrides.find(o => o.featureId === featureId) || null
  }

  private checkCustomRules(rules: any, context: FeatureContext): boolean {
    if (rules.orgId && !rules.orgId.includes(context.orgId)) return false
    if (rules.stage && !rules.stage.includes(context.stage)) return false
    if (rules.conditions) {
      // Implement custom condition checking logic
      return this.evaluateConditions(rules.conditions, context)
    }
    return true
  }

  private evaluateConditions(conditions: Record<string, any>, context: FeatureContext): boolean {
    // Simple condition evaluation - can be extended
    for (const [key, value] of Object.entries(conditions)) {
      if (context.customData?.[key] !== value) return false
    }
    return true
  }

  private getAlternativeFeatures(featureId: string, currentPlan: string): string[] {
    // Find features that provide similar functionality
    const alternatives: string[] = []
    const feature = this.features.get(featureId)
    
    if (feature?.dependencies) {
      alternatives.push(...feature.dependencies)
    }

    return alternatives
  }

  private generateFeatureId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  }

  private generateOverrideId(): string {
    return `override_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Admin Getters
  async getAllFeatures(): Promise<Feature[]> {
    return Array.from(this.features.values())
  }

  async getFeaturesByCategory(category: string): Promise<Feature[]> {
    return Array.from(this.features.values()).filter(f => f.category === category)
  }

  async getAllPlans(): Promise<PlanFeatures[]> {
    return Array.from(this.planFeatures.values())
  }

  async getOrganizationOverrides(orgId: string): Promise<FeatureOverride[]> {
    return this.overrides.get(orgId) || []
  }

  async getFeatureUsage(featureId: string): Promise<{ totalOrgs: number; enabledOrgs: number }> {
    let totalOrgs = 0
    let enabledOrgs = 0

    for (const plan of this.planFeatures.values()) {
      if (plan.features.includes(featureId)) {
        totalOrgs++ // This would need actual org count per plan
      }
    }

    for (const overrides of this.overrides.values()) {
      const override = overrides.find(o => o.featureId === featureId)
      if (override) {
        if (override.enabled) enabledOrgs++
      }
    }

    return { totalOrgs, enabledOrgs }
  }
}

// Singleton instance
export const featureFlagService = new FeatureFlagService()
