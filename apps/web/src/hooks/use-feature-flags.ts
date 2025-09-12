"use client"

import { useState, useEffect } from 'react'
import { AVAILABLE_FEATURES, getFilteredNavigation, type FeatureFlag, type NavigationGroup } from '../lib/feature-flags'

export function useFeatureFlags() {
  // Valores por defecto
  const defaultFlags: Record<string, boolean> = {}
  AVAILABLE_FEATURES.forEach(feature => {
    defaultFlags[feature.id] = feature.enabled
  })

  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>(defaultFlags)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Cargar desde localStorage en el cliente
    if (typeof window !== 'undefined') {
      try {
        const savedFlags = localStorage.getItem('feature-flags')
        if (savedFlags) {
          setFeatureFlags(JSON.parse(savedFlags))
        }
      } catch (error) {
        console.error('Error loading feature flags:', error)
      }
    }
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
