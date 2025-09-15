"use client"

import React, { useState, useEffect } from 'react'
import { getEnvironmentInfo, setEnvironment, getAllConfigs, type Environment } from '../lib/config'

export function EnvironmentSelector() {
  const [currentEnv, setCurrentEnv] = useState<Environment>('dev')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const envInfo = getEnvironmentInfo()
    setCurrentEnv(envInfo.environment)
  }, [])

  const handleEnvironmentChange = (env: Environment) => {
    setEnvironment(env)
    setCurrentEnv(env)
  }

  const configs = getAllConfigs()

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Entorno:</span>
        <div className="flex space-x-2">
          {Object.entries(configs).map(([env, config]) => (
            <button
              key={env}
              onClick={() => handleEnvironmentChange(env as Environment)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentEnv === env
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {env.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <div>API: {configs[currentEnv].apiGatewayId}</div>
        <div>Tabla: {configs[currentEnv].tableName}</div>
      </div>
    </div>
  )
}
