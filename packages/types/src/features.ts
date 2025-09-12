export interface Feature {
  id: string
  name: string
  description: string
  category: 'core' | 'premium' | 'enterprise' | 'custom'
  icon: string
  enabled: boolean
  requiredPlan?: string[]
  customRules?: {
    orgId?: string[]
    stage?: string[]
    conditions?: Record<string, any>
  }
  dependencies?: string[]
  metadata?: {
    version: string
    lastUpdated: string
    createdBy: string
  }
}

export interface FeatureOverride {
  id: string
  featureId: string
  orgId: string
  enabled: boolean
  customConfig?: Record<string, any>
  expiresAt?: string
  reason?: string
  createdBy: string
  createdAt: string
}

export interface PlanFeatures {
  planId: string
  planName: string
  features: string[] // Feature IDs
  customFeatures?: string[]
  overrides?: FeatureOverride[]
}

export interface FeatureContext {
  orgId: string
  plan: string
  stage: string
  userId: string
  role: string
  customData?: Record<string, any>
}

export interface FeatureCheckResult {
  hasAccess: boolean
  reason?: string
  alternatives?: string[]
  upgradeRequired?: boolean
}

// Feature Categories
export const FEATURE_CATEGORIES = {
  CORE: 'core',
  PREMIUM: 'premium', 
  ENTERPRISE: 'enterprise',
  CUSTOM: 'custom'
} as const

// Default Features by Plan
export const DEFAULT_PLAN_FEATURES: Record<string, string[]> = {
  basic: [
    'dashboard-overview',
    'profile-management',
    'basic-inventory',
    'basic-rfq'
  ],
  pro: [
    'dashboard-overview',
    'profile-management',
    'basic-inventory',
    'basic-rfq',
    'advanced-inventory',
    'quote-management',
    'order-tracking',
    'analytics-basic',
    'custom-branding'
  ],
  premium: [
    'dashboard-overview',
    'profile-management',
    'basic-inventory',
    'basic-rfq',
    'advanced-inventory',
    'quote-management',
    'order-tracking',
    'analytics-basic',
    'custom-branding',
    'advanced-analytics',
    'bulk-operations',
    'api-access',
    'priority-support',
    'custom-integrations'
  ],
  enterprise: [
    'dashboard-overview',
    'profile-management',
    'basic-inventory',
    'basic-rfq',
    'advanced-inventory',
    'quote-management',
    'order-tracking',
    'analytics-basic',
    'custom-branding',
    'advanced-analytics',
    'bulk-operations',
    'api-access',
    'priority-support',
    'custom-integrations',
    'white-label',
    'custom-features',
    'advanced-security',
    'audit-logs',
    'multi-tenant-management'
  ]
}

// Available Features Database
export const AVAILABLE_FEATURES: Feature[] = [
  // Core Features
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

  // Pro Features
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
    id: 'order-tracking',
    name: 'Seguimiento de Órdenes',
    description: 'Tracking en tiempo real de órdenes y entregas',
    category: 'premium',
    icon: 'Truck',
    enabled: true,
    requiredPlan: ['pro', 'premium', 'enterprise']
  },
  {
    id: 'analytics-basic',
    name: 'Analytics Básico',
    description: 'Reportes y estadísticas básicas de ventas',
    category: 'premium',
    icon: 'BarChart3',
    enabled: true,
    requiredPlan: ['pro', 'premium', 'enterprise']
  },
  {
    id: 'custom-branding',
    name: 'Branding Personalizado',
    description: 'Personalizar colores, logos y apariencia',
    category: 'premium',
    icon: 'Palette',
    enabled: true,
    requiredPlan: ['pro', 'premium', 'enterprise']
  },

  // Premium Features
  {
    id: 'advanced-analytics',
    name: 'Analytics Avanzado',
    description: 'Reportes avanzados, KPIs y dashboards personalizados',
    category: 'premium',
    icon: 'TrendingUp',
    enabled: true,
    requiredPlan: ['premium', 'enterprise']
  },
  {
    id: 'bulk-operations',
    name: 'Operaciones Masivas',
    description: 'Importar/exportar datos, operaciones en lote',
    category: 'premium',
    icon: 'Upload',
    enabled: true,
    requiredPlan: ['premium', 'enterprise']
  },
  {
    id: 'api-access',
    name: 'Acceso API',
    description: 'API REST para integraciones externas',
    category: 'premium',
    icon: 'Code',
    enabled: true,
    requiredPlan: ['premium', 'enterprise']
  },
  {
    id: 'priority-support',
    name: 'Soporte Prioritario',
    description: 'Soporte técnico prioritario 24/7',
    category: 'premium',
    icon: 'Headphones',
    enabled: true,
    requiredPlan: ['premium', 'enterprise']
  },
  {
    id: 'custom-integrations',
    name: 'Integraciones Personalizadas',
    description: 'Integraciones con sistemas externos personalizados',
    category: 'premium',
    icon: 'Plug',
    enabled: true,
    requiredPlan: ['premium', 'enterprise']
  },

  // Enterprise Features
  {
    id: 'white-label',
    name: 'White Label',
    description: 'Personalización completa de marca y dominio',
    category: 'enterprise',
    icon: 'Shield',
    enabled: true,
    requiredPlan: ['enterprise']
  },
  {
    id: 'custom-features',
    name: 'Features Personalizados',
    description: 'Desarrollo de funcionalidades específicas',
    category: 'enterprise',
    icon: 'Wrench',
    enabled: true,
    requiredPlan: ['enterprise']
  },
  {
    id: 'advanced-security',
    name: 'Seguridad Avanzada',
    description: 'SSO, 2FA, auditoría de seguridad',
    category: 'enterprise',
    icon: 'Lock',
    enabled: true,
    requiredPlan: ['enterprise']
  },
  {
    id: 'audit-logs',
    name: 'Logs de Auditoría',
    description: 'Registro completo de actividades del sistema',
    category: 'enterprise',
    icon: 'FileSearch',
    enabled: true,
    requiredPlan: ['enterprise']
  },
  {
    id: 'multi-tenant-management',
    name: 'Gestión Multi-tenant',
    description: 'Administración de múltiples organizaciones',
    category: 'enterprise',
    icon: 'Building2',
    enabled: true,
    requiredPlan: ['enterprise']
  },

  // Custom Features (Admin can create)
  {
    id: 'proposal-generator',
    name: 'Generador de Propuestas',
    description: 'Crear propuestas comerciales automáticas',
    category: 'custom',
    icon: 'FileText',
    enabled: false,
    requiredPlan: ['pro', 'premium', 'enterprise']
  },
  {
    id: 'advanced-reporting',
    name: 'Reportes Avanzados',
    description: 'Generador de reportes personalizados',
    category: 'custom',
    icon: 'FileBarChart',
    enabled: false,
    requiredPlan: ['premium', 'enterprise']
  },
  {
    id: 'workflow-automation',
    name: 'Automatización de Flujos',
    description: 'Automatizar procesos de trabajo',
    category: 'custom',
    icon: 'Workflow',
    enabled: false,
    requiredPlan: ['enterprise']
  }
]
