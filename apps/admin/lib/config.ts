// MerchConnect México - Configuración por Entorno
export type Environment = 'dev' | 'sbx' | 'prod'

export interface ApiConfig {
  baseUrl: string
  stage: string
  tableName: string
  apiGatewayId: string
}

const configs: Record<Environment, ApiConfig> = {
  dev: {
    baseUrl: 'https://api-dev.merchconnectmexico.com/v1',
    stage: 'dev',
    tableName: 'MerchConnect-dev',
    apiGatewayId: 'fawy9flh4m'
  },
  sbx: {
    baseUrl: 'https://api-sbx.merchconnectmexico.com/v1',
    stage: 'sbx',
    tableName: 'MerchConnect-sbx',
    apiGatewayId: 'ioar0odtg1'
  },
  prod: {
    baseUrl: 'https://api.merchconnectmexico.com/v1',
    stage: 'prod',
    tableName: 'MerchConnect-prod',
    apiGatewayId: 's3lrxj7xx7'
  }
}

// Obtener el entorno actual desde variables de entorno, localStorage o detección de dominio
export function getCurrentEnvironment(): Environment {
  if (typeof window !== 'undefined') {
    // Detectar entorno basado en el dominio
    const hostname = window.location.hostname
    
    if (hostname === 'merchconnectmexico.com') {
      return 'prod'
    } else if (hostname === 'sbx.merchconnectmexico.com') {
      return 'sbx'
    } else if (hostname === 'dev.merchconnectmexico.com') {
      return 'dev'
    }
    
    // En localhost, verificar localStorage
    const savedEnv = localStorage.getItem('merchconnect-environment') as Environment
    if (savedEnv && configs[savedEnv]) {
      return savedEnv
    }
  }
  
  // Fallback a variables de entorno
  const envFromProcess = process.env.NEXT_PUBLIC_STAGE as Environment
  if (envFromProcess && configs[envFromProcess]) {
    return envFromProcess
  }
  
  // Default a desarrollo en rama develop
  return 'dev'
}

// Obtener configuración del entorno actual
export function getConfig(): ApiConfig {
  const env = getCurrentEnvironment()
  return configs[env]
}

// Cambiar entorno (solo en cliente)
export function setEnvironment(env: Environment) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('merchconnect-environment', env)
    // Recargar la página para aplicar los cambios
    window.location.reload()
  }
}

// Obtener todas las configuraciones disponibles
export function getAllConfigs(): Record<Environment, ApiConfig> {
  return configs
}

// Obtener información del entorno actual
export function getEnvironmentInfo() {
  const env = getCurrentEnvironment()
  const config = getConfig()
  
  return {
    environment: env,
    config,
    isDev: env === 'dev',
    isSandbox: env === 'sbx',
    isProd: env === 'prod'
  }
}
