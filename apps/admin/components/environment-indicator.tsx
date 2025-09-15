"use client"

import React, { useState, useEffect } from 'react'
import { getEnvironmentInfo } from '../lib/config'

export function EnvironmentIndicator() {
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const info = getEnvironmentInfo()
    setEnvInfo(info)
  }, [])

  if (!isClient || !envInfo) {
    return null
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'prod':
        return 'bg-green-500'
      case 'sbx':
        return 'bg-yellow-500'
      case 'dev':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getEnvironmentLabel = (env: string) => {
    switch (env) {
      case 'prod':
        return 'PRODUCCIÓN'
      case 'sbx':
        return 'SANDBOX'
      case 'dev':
        return 'DESARROLLO'
      default:
        return 'DESCONOCIDO'
    }
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`${getEnvironmentColor(envInfo.environment)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
        {getEnvironmentLabel(envInfo.environment)}
      </div>
      <div className="mt-1 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
        <div>API: {envInfo.config.apiGatewayId}</div>
        <div>Tabla: {envInfo.config.tableName}</div>
      </div>
    </div>
  )
}
