// MerchConnect México - Configuración de Seguridad
// Configuración centralizada para todas las medidas de seguridad

export const SECURITY_CONFIG = {
  // Configuración de WAF
  waf: {
    enabled: true,
    rules: {
      sqlInjection: true,
      xss: true,
      pathTraversal: true,
      commandInjection: true,
      noSqlInjection: true,
      ldapInjection: true,
      xpathInjection: true,
      xmlInjection: true,
      jsonInjection: true,
      crlfInjection: true,
      nullByteInjection: true,
      unicodeInjection: true,
      base64Injection: true,
      hexInjection: true,
      octalInjection: true,
      binaryInjection: true,
      regexInjection: true,
      templateInjection: true,
      sstiInjection: true,
      rceInjection: true,
      fileInclusion: true,
      deserialization: true,
      prototypePollution: true,
      ssrfInjection: true,
      xxeInjection: true,
    }
  },

  // Configuración de Rate Limiting
  rateLimiting: {
    enabled: true,
    global: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
    },
    perIP: {
      requestsPerMinute: 50,
      requestsPerHour: 500,
      requestsPerDay: 5000,
    },
    perAPIKey: {
      requestsPerMinute: 200,
      requestsPerHour: 2000,
      requestsPerDay: 20000,
    },
    perUser: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
    }
  },

  // Configuración de DDoS Protection
  ddosProtection: {
    enabled: true,
    shieldAdvanced: true,
    cloudFront: true,
    autoScaling: true,
    thresholds: {
      requestsPerSecond: 1000,
      concurrentConnections: 10000,
      bandwidthMbps: 1000,
    }
  },

  // Configuración de Validación de Entrada
  inputValidation: {
    enabled: true,
    maxStringLength: 10000,
    maxObjectDepth: 10,
    maxArrayLength: 1000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    sanitizeInput: true,
    escapeHtml: true,
    validateJson: true,
    validateXml: true,
    validateYaml: true,
  },

  // Configuración de CORS
  cors: {
    enabled: true,
    allowedOrigins: [
      'https://dev.merchconnectmexico.com',
      'https://sbx.merchconnectmexico.com',
      'https://merchconnectmexico.com',
      'http://localhost:3000', // Solo para desarrollo
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Requested-With',
      'X-Org-ID',
      'X-User-ID',
    ],
    allowCredentials: true,
    maxAge: 86400, // 24 horas
  },

  // Configuración de Headers de Seguridad
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  },

  // Configuración de Autenticación
  authentication: {
    enabled: true,
    jwt: {
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
      expiresIn: '24h',
      refreshExpiresIn: '7d',
    },
    apiKeys: {
      enabled: true,
      required: true,
      rotationPeriod: 90, // días
      maxKeysPerOrg: 5,
    },
    mfa: {
      enabled: true,
      required: false,
      methods: ['totp', 'sms', 'email'],
    },
    session: {
      maxAge: 24 * 60 * 60, // 24 horas
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    }
  },

  // Configuración de Autorización
  authorization: {
    enabled: true,
    rbac: {
      enabled: true,
      roles: ['admin', 'user', 'viewer'],
      permissions: [
        'read', 'write', 'delete', 'admin',
        'users:manage', 'settings:manage', 'billing:manage',
        'inventory:manage', 'orders:manage', 'reports:view'
      ],
    },
    featureFlags: {
      enabled: true,
      perOrg: true,
      perPlan: true,
    }
  },

  // Configuración de Logging
  logging: {
    enabled: true,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    destinations: ['console', 'cloudwatch', 'dynamodb'],
    securityEvents: {
      enabled: true,
      table: 'MerchConnect-SecurityLogs',
      retention: 90, // días
    },
    auditLog: {
      enabled: true,
      table: 'MerchConnect-AuditLogs',
      retention: 365, // días
    }
  },

  // Configuración de Monitoreo
  monitoring: {
    enabled: true,
    metrics: {
      enabled: true,
      interval: 60, // segundos
    },
    alerts: {
      enabled: true,
      channels: ['email', 'slack', 'sms'],
      thresholds: {
        errorRate: 5, // %
        responseTime: 2000, // ms
        memoryUsage: 80, // %
        cpuUsage: 80, // %
      }
    },
    healthChecks: {
      enabled: true,
      interval: 30, // segundos
      timeout: 10, // segundos
    }
  },

  // Configuración de Backup y Recuperación
  backup: {
    enabled: true,
    dynamodb: {
      pointInTimeRecovery: true,
      continuousBackup: true,
    },
    s3: {
      versioning: true,
      crossRegionReplication: true,
    },
    rds: {
      automatedBackups: true,
      retention: 7, // días
    }
  },

  // Configuración de Compliance
  compliance: {
    gdpr: {
      enabled: true,
      dataRetention: 365, // días
      rightToErasure: true,
      dataPortability: true,
    },
    ccpa: {
      enabled: true,
      dataRetention: 365, // días
      optOut: true,
    },
    sox: {
      enabled: true,
      auditTrail: true,
      dataIntegrity: true,
    }
  },

  // Configuración de Geo-blocking
  geoBlocking: {
    enabled: true,
    blockedCountries: ['CN', 'RU', 'KP', 'IR'],
    allowedCountries: ['MX', 'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT'],
    mode: 'block', // 'block' o 'allow'
  },

  // Configuración de IP Whitelisting
  ipWhitelist: {
    enabled: false,
    allowedIPs: [
      '127.0.0.1',
      '::1',
      // Agregar IPs de confianza aquí
    ],
    blockedIPs: [
      // Agregar IPs bloqueadas aquí
    ] as string[],
  },

  // Configuración de Timeout
  timeouts: {
    request: 30, // segundos
    database: 10, // segundos
    external: 15, // segundos
    fileUpload: 60, // segundos
  },

  // Configuración de Cache
  cache: {
    enabled: true,
    ttl: 300, // segundos
    maxSize: 1000, // items
    strategy: 'lru', // 'lru', 'fifo', 'lfu'
  },

  // Configuración de Encryption
  encryption: {
    enabled: true,
    algorithm: 'aes-256-gcm',
    keyRotation: 90, // días
    atRest: true,
    inTransit: true,
  }
};

// Función para obtener configuración de seguridad por ambiente
export function getSecurityConfig(environment: 'dev' | 'sbx' | 'prod' = 'dev') {
  const baseConfig = { ...SECURITY_CONFIG };
  
  switch (environment) {
    case 'dev':
      return {
        ...baseConfig,
        rateLimiting: {
          ...baseConfig.rateLimiting,
          global: {
            requestsPerMinute: 1000,
            requestsPerHour: 10000,
            requestsPerDay: 100000,
          }
        },
        logging: {
          ...baseConfig.logging,
          level: 'debug'
        }
      };
    
    case 'sbx':
      return {
        ...baseConfig,
        rateLimiting: {
          ...baseConfig.rateLimiting,
          global: {
            requestsPerMinute: 500,
            requestsPerHour: 5000,
            requestsPerDay: 50000,
          }
        },
        logging: {
          ...baseConfig.logging,
          level: 'info'
        }
      };
    
    case 'prod':
      return {
        ...baseConfig,
        rateLimiting: {
          ...baseConfig.rateLimiting,
          global: {
            requestsPerMinute: 100,
            requestsPerHour: 1000,
            requestsPerDay: 10000,
          }
        },
        logging: {
          ...baseConfig.logging,
          level: 'warn'
        }
      };
    
    default:
      return baseConfig;
  }
}

// Función para validar configuración de seguridad
export function validateSecurityConfig(config: typeof SECURITY_CONFIG): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validar rate limiting
  if (config.rateLimiting.enabled) {
    if (config.rateLimiting.global.requestsPerMinute <= 0) {
      errors.push('Global requests per minute must be greater than 0');
    }
    if (config.rateLimiting.perIP.requestsPerMinute > config.rateLimiting.global.requestsPerMinute) {
      errors.push('Per-IP requests per minute cannot exceed global limit');
    }
  }
  
  // Validar CORS
  if (config.cors.enabled) {
    if (config.cors.allowedOrigins.length === 0) {
      errors.push('At least one CORS origin must be specified');
    }
    if (config.cors.allowedMethods.length === 0) {
      errors.push('At least one CORS method must be specified');
    }
  }
  
  // Validar timeouts
  if (config.timeouts.request <= 0) {
    errors.push('Request timeout must be greater than 0');
  }
  
  // Validar input validation
  if (config.inputValidation.enabled) {
    if (config.inputValidation.maxStringLength <= 0) {
      errors.push('Max string length must be greater than 0');
    }
    if (config.inputValidation.maxObjectDepth <= 0) {
      errors.push('Max object depth must be greater than 0');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Función para obtener headers de seguridad
export function getSecurityHeaders(): Record<string, string> {
  return SECURITY_CONFIG.securityHeaders;
}

// Función para verificar si una IP está bloqueada
export function isIPBlocked(ip: string): boolean {
  if (!SECURITY_CONFIG.ipWhitelist.enabled) {
    return false;
  }
  
  // Verificar IPs bloqueadas
  if (SECURITY_CONFIG.ipWhitelist.blockedIPs.includes(ip)) {
    return true;
  }
  
  // Verificar IPs permitidas
  if (SECURITY_CONFIG.ipWhitelist.allowedIPs.length > 0) {
    return !SECURITY_CONFIG.ipWhitelist.allowedIPs.includes(ip);
  }
  
  return false;
}

// Función para verificar si un país está bloqueado
export function isCountryBlocked(countryCode: string): boolean {
  if (!SECURITY_CONFIG.geoBlocking.enabled) {
    return false;
  }
  
  if (SECURITY_CONFIG.geoBlocking.mode === 'block') {
    return SECURITY_CONFIG.geoBlocking.blockedCountries.includes(countryCode);
  } else {
    return !SECURITY_CONFIG.geoBlocking.allowedCountries.includes(countryCode);
  }
}

// Función para obtener configuración de rate limiting
export function getRateLimitConfig(type: 'global' | 'perIP' | 'perAPIKey' | 'perUser') {
  return SECURITY_CONFIG.rateLimiting[type];
}

// Función para verificar si una característica de seguridad está habilitada
export function isSecurityFeatureEnabled(feature: keyof typeof SECURITY_CONFIG): boolean {
  const config = SECURITY_CONFIG[feature];
  return typeof config === 'object' && 'enabled' in config ? config.enabled : true;
}
