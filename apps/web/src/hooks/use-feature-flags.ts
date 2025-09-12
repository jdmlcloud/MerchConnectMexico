"use client"

import { useState, useEffect } from 'react'
import { AVAILABLE_FEATURES, getFilteredNavigation, type FeatureFlag, type NavigationGroup } from '../lib/feature-flags'

export function useFeatureFlags() {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de feature flags desde API
    const loadFeatureFlags = async () => {
      try {
        // Por ahora usar localStorage, después será API
        if (typeof window !== 'undefined') {
          const savedFlags = localStorage.getItem('feature-flags')
          if (savedFlags) {
            setFeatureFlags(JSON.parse(savedFlags))
          } else {
            // Valores por defecto
            const defaultFlags: Record<string, boolean> = {}
            AVAILABLE_FEATURES.forEach(feature => {
              defaultFlags[feature.id] = feature.enabled
            })
            setFeatureFlags(defaultFlags)
          }
        } else {
          // Valores por defecto para SSR
          const defaultFlags: Record<string, boolean> = {}
          AVAILABLE_FEATURES.forEach(feature => {
            defaultFlags[feature.id] = feature.enabled
          })
          setFeatureFlags(defaultFlags)
        }
      } catch (error) {
        console.error('Error loading feature flags:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeatureFlags()
  }, [])

  const updateFeatureFlag = (featureId: string, enabled: boolean) => {
    const newFlags = { ...featureFlags, [featureId]: enabled }
    setFeatureFlags(newFlags)
    if (typeof window !== 'undefined') {
      localStorage.setItem('feature-flags', JSON.stringify(newFlags))
    }
  }

  const getFilteredWorkshopNavigation = (): NavigationGroup[] => {
    return getFilteredNavigation(featureFlags)
  }

  const isFeatureEnabled = (featureId: string): boolean => {
    return featureFlags[featureId] === true
  }

  return {
    featureFlags,
    loading,
    updateFeatureFlag,
    getFilteredWorkshopNavigation,
    isFeatureEnabled
  }
}
