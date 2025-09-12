'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Feature, FeatureCheckResult, FeatureContext } from '@merchconnect/types'

interface UseFeatureFlagsReturn {
  hasFeature: (featureId: string) => Promise<FeatureCheckResult>
  hasFeatureSync: (featureId: string) => boolean
  getAvailableFeatures: () => Promise<Feature[]>
  isLoading: boolean
  error: string | null
  refreshFeatures: () => Promise<void>
}

// Mock implementation for development
const mockFeatureFlags = {
  'dashboard-overview': true,
  'profile-management': true,
  'basic-inventory': true,
  'basic-rfq': true,
  'advanced-inventory': false,
  'quote-management': false,
  'order-tracking': false,
  'analytics-basic': false,
  'custom-branding': false,
  'advanced-analytics': false,
  'bulk-operations': false,
  'api-access': false,
  'priority-support': false,
  'custom-integrations': false,
  'white-label': false,
  'custom-features': false,
  'advanced-security': false,
  'audit-logs': false,
  'multi-tenant-management': false,
  'proposal-generator': false,
  'advanced-reporting': false,
  'workflow-automation': false
}

export function useFeatureFlags(): UseFeatureFlagsReturn {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([])
  const [featureCache, setFeatureCache] = useState<Map<string, boolean>>(new Map())

  const getFeatureContext = useCallback((): FeatureContext | null => {
    if (!session?.user) return null

    return {
      orgId: (session.user as any).orgId || 'default-org',
      plan: (session.user as any).plan || 'basic',
      stage: process.env.NEXT_PUBLIC_STAGE || 'dev',
      userId: (session.user as any).id || 'default-user',
      role: (session.user as any).role || 'user',
      customData: (session.user as any).customData
    }
  }, [session])

  const hasFeature = useCallback(async (featureId: string): Promise<FeatureCheckResult> => {
    const context = getFeatureContext()
    if (!context) {
      return {
        hasAccess: false,
        reason: 'No session context available'
      }
    }

    // Mock implementation - in production this would call the API
    const hasAccess = mockFeatureFlags[featureId as keyof typeof mockFeatureFlags] || false
    
    return {
      hasAccess,
      reason: hasAccess ? 'Feature enabled' : 'Feature not available in current plan'
    }
  }, [getFeatureContext])

  const hasFeatureSync = useCallback((featureId: string): boolean => {
    return featureCache.get(featureId) || false
  }, [featureCache])

  const getAvailableFeatures = useCallback(async (): Promise<Feature[]> => {
    const context = getFeatureContext()
    if (!context) return []

    // Mock implementation - in production this would call the API
    const mockFeatures: Feature[] = [
      {
        id: 'dashboard-overview',
        name: 'Dashboard Principal',
        description: 'Vista general del dashboard con estadísticas básicas',
        category: 'core',
        icon: 'LayoutDashboard',
        enabled: true,
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise']
      },
      {
        id: 'profile-management',
        name: 'Gestión de Perfil',
        description: 'Editar información personal y de organización',
        category: 'core',
        icon: 'User',
        enabled: true,
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise']
      },
      {
        id: 'basic-inventory',
        name: 'Inventario Básico',
        description: 'Gestión básica de productos e inventario',
        category: 'core',
        icon: 'Package',
        enabled: true,
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise']
      },
      {
        id: 'basic-rfq',
        name: 'RFQ Básico',
        description: 'Crear y gestionar solicitudes de cotización básicas',
        category: 'core',
        icon: 'FileText',
        enabled: true,
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise']
      },
      {
        id: 'advanced-inventory',
        name: 'Inventario Avanzado',
        description: 'Gestión avanzada con categorías, variantes y stock automático',
        category: 'premium',
        icon: 'Package2',
        enabled: true,
        requiredPlan: ['pro', 'premium', 'enterprise']
      },
      {
        id: 'quote-management',
        name: 'Gestión de Cotizaciones',
        description: 'Sistema completo de cotizaciones y comparación',
        category: 'premium',
        icon: 'Calculator',
        enabled: true,
        requiredPlan: ['pro', 'premium', 'enterprise']
      },
      {
        id: 'proposal-generator',
        name: 'Generador de Propuestas',
        description: 'Crear propuestas comerciales automáticas',
        category: 'custom',
        icon: 'FileText',
        enabled: false,
        requiredPlan: ['pro', 'premium', 'enterprise']
      }
    ]

    // Filter features based on current plan
    const planFeatures = mockFeatures.filter(feature => 
      feature.requiredPlan?.includes(context.plan) && feature.enabled
    )

    return planFeatures
  }, [getFeatureContext])

  const refreshFeatures = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const features = await getAvailableFeatures()
      setAvailableFeatures(features)

      // Update cache
      const newCache = new Map<string, boolean>()
      for (const feature of features) {
        newCache.set(feature.id, true)
      }
      setFeatureCache(newCache)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load features')
    } finally {
      setIsLoading(false)
    }
  }, [getAvailableFeatures])

  // Load features on mount
  useEffect(() => {
    if (session?.user) {
      refreshFeatures()
    }
  }, [session, refreshFeatures])

  return {
    hasFeature,
    hasFeatureSync,
    getAvailableFeatures,
    isLoading,
    error,
    refreshFeatures
  }
}

// Hook for checking specific features
export function useFeature(featureId: string) {
  const { hasFeature, hasFeatureSync, isLoading } = useFeatureFlags()
  const [hasAccess, setHasAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const checkFeature = async () => {
      setIsChecking(true)
      try {
        const result = await hasFeature(featureId)
        setHasAccess(result.hasAccess)
      } catch (error) {
        console.error('Error checking feature:', error)
        setHasAccess(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkFeature()
  }, [featureId, hasFeature])

  return {
    hasAccess: hasFeatureSync(featureId) || hasAccess,
    isChecking: isChecking || isLoading,
    isLoading
  }
}

// Component wrapper for feature gating
interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
  features?: string[]
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback = null, 
  requireAll = false,
  features = []
}: FeatureGateProps) {
  const { hasAccess, isChecking } = useFeature(feature)
  const { hasFeatureSync } = useFeatureFlags()

  if (isChecking) {
    return <div className="animate-pulse bg-muted h-8 rounded" />
  }

  // Check single feature
  if (!features.length) {
    return hasAccess ? <>{children}</> : <>{fallback}</>
  }

  // Check multiple features
  if (requireAll) {
    const allFeatures = [feature, ...features]
    const hasAllAccess = allFeatures.every(f => hasFeatureSync(f))
    return hasAllAccess ? <>{children}</> : <>{fallback}</>
  } else {
    const anyFeatures = [feature, ...features]
    const hasAnyAccess = anyFeatures.some(f => hasFeatureSync(f))
    return hasAnyAccess ? <>{children}</> : <>{fallback}</>
  }
}
