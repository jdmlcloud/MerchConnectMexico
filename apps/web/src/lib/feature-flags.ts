export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
  permissions?: string[]
}

export interface NavigationItem {
  label: string
  path: string
  icon: string
  feature?: string
  perm?: string
}

export interface NavigationGroup {
  group: string
  items: NavigationItem[]
}

// Feature flags disponibles
export const AVAILABLE_FEATURES: FeatureFlag[] = [
  {
    id: 'whatsappIntegration',
    name: 'WhatsApp + IA',
    description: 'Integración con WhatsApp y asistente de IA',
    enabled: false,
    category: 'Comunicación'
  },
  {
    id: 'proposalEditor',
    name: 'Editor de Propuestas',
    description: 'Editor visual para crear propuestas personalizadas',
    enabled: false,
    category: 'Propuestas'
  },
  {
    id: 'landingEditable',
    name: 'Páginas Editables',
    description: 'Editor de páginas web personalizables',
    enabled: false,
    category: 'Website'
  }
]

// Navegación del workshop con feature flags
export const WORKSHOP_NAVIGATION: NavigationGroup[] = [
  { 
    "group": "DASHBOARD", 
    "items": [
      { "label": "Dashboard", "path": "/workshop", "icon": "LayoutDashboard" }
    ]
  },
  { 
    "group": "BASE DE DATOS", 
    "items": [
      { "label": "Proveedores", "path": "/workshop/base-de-datos/proveedores", "icon": "Factory" },
      { "label": "Productos", "path": "/workshop/base-de-datos/productos", "icon": "Boxes" },
      { "label": "Logos", "path": "/workshop/base-de-datos/logos", "icon": "Image" },
      { "label": "Usuarios", "path": "/workshop/base-de-datos/usuarios", "icon": "Users", "perm": "users:manage" }
    ]
  },
  { 
    "group": "OPERACIONES", 
    "items": [
      { "label": "RFQs", "path": "/workshop/operaciones/rfq", "icon": "ClipboardList" },
      { "label": "Nuevo RFQ", "path": "/workshop/operaciones/rfq/nuevo", "icon": "PlusSquare" },
      { "label": "Cotizaciones", "path": "/workshop/operaciones/cotizaciones", "icon": "FileSpreadsheet" },
      { "label": "Órdenes", "path": "/workshop/operaciones/ordenes", "icon": "PackageSearch" },
      { "label": "Tareas", "path": "/workshop/operaciones/tareas", "icon": "CheckSquare" }
    ]
  },
  { 
    "group": "COMUNICACIÓN", 
    "items": [
      { "label": "WhatsApp + IA", "path": "/workshop/comunicacion/whatsapp-ia", "icon": "MessagesSquare", "feature": "whatsappIntegration" }
    ]
  },
  { 
    "group": "PROPUESTAS", 
    "items": [
      { "label": "Propuestas", "path": "/workshop/propuestas", "icon": "FileSignature" },
      { "label": "Nueva Propuesta", "path": "/workshop/propuestas/nueva", "icon": "Sparkles", "feature": "proposalEditor" }
    ]
  },
  { 
    "group": "HERRAMIENTAS", 
    "items": [
      { "label": "Editor Visual", "path": "/workshop/herramientas/editor-visual/select-product", "icon": "PenTool", "feature": "proposalEditor", "perm": "design:create" },
      { "label": "Generador PDFs", "path": "/workshop/herramientas/generador-pdfs", "icon": "FileDown", "perm": "proposals:export" }
    ]
  },
  { 
    "group": "ANÁLISIS Y REPORTES", 
    "items": [
      { "label": "Analytics", "path": "/workshop/analisis-reportes/analytics", "icon": "BarChart3" },
      { "label": "Reportes", "path": "/workshop/analisis-reportes/reportes", "icon": "FileBarChart" },
      { "label": "Envío y Tracking", "path": "/workshop/analisis-reportes/envio-tracking", "icon": "Truck" }
    ]
  },
  { 
    "group": "WEBSITE", 
    "items": [
      { "label": "Páginas", "path": "/workshop/website/pages", "icon": "Globe", "feature": "landingEditable" }
    ]
  },
  { 
    "group": "CONFIGURACIÓN", 
    "items": [
      { "label": "Branding", "path": "/workshop/settings/branding", "icon": "Palette" },
      { "label": "Usuarios", "path": "/workshop/settings/usuarios", "icon": "UserCog", "perm": "users:manage" },
      { "label": "Planes y Features", "path": "/workshop/settings/planes-y-features", "icon": "BadgeCheck", "perm": "plan:manage" },
      { "label": "Avanzados", "path": "/workshop/settings/avanzados", "icon": "Settings2", "perm": "settings:advanced" }
    ]
  }
]

// Función para filtrar navegación basada en feature flags
export function getFilteredNavigation(featureFlags: Record<string, boolean>): NavigationGroup[] {
  return WORKSHOP_NAVIGATION.map(group => ({
    ...group,
    items: group.items.filter(item => {
      // Si no tiene feature flag, siempre mostrar
      if (!item.feature) return true
      
      // Si tiene feature flag, verificar si está habilitado
      return featureFlags[item.feature] === true
    })
  })).filter(group => group.items.length > 0) // Filtrar grupos vacíos
}
