'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Settings, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Save,
  X,
  Building2,
  Users,
  BarChart3,
  Package,
  FileText,
  Calculator,
  Truck,
  Palette,
  TrendingUp,
  Upload,
  Code,
  Headphones,
  Plug,
  Shield,
  Wrench,
  Lock,
  FileSearch,
  Workflow
} from 'lucide-react'
import { Feature, FeatureOverride, PlanFeatures } from '@merchconnect/types'

const iconMap: Record<string, any> = {
  LayoutDashboard: BarChart3,
  User: Users,
  Package: Package,
  Package2: Package,
  FileText: FileText,
  Calculator: Calculator,
  Truck: Truck,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Upload: Upload,
  Code: Code,
  Headphones: Headphones,
  Plug: Plug,
  Shield: Shield,
  Wrench: Wrench,
  Lock: Lock,
  FileSearch: FileSearch,
  Workflow: Workflow,
  Building2: Building2
}

interface FeatureManagementProps {
  className?: string
}

export function FeatureManagement({ className }: FeatureManagementProps) {
  const [features, setFeatures] = useState<Feature[]>([])
  const [plans, setPlans] = useState<PlanFeatures[]>([])
  const [overrides, setOverrides] = useState<FeatureOverride[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreatingFeature, setIsCreatingFeature] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('features')

  // Mock data - in production this would come from API
  useEffect(() => {
    const mockFeatures: Feature[] = [
      // CORE FEATURES
      {
        id: 'dashboard-overview',
        name: 'Dashboard Principal',
        description: 'Vista general del dashboard con estadísticas básicas',
        enabled: true,
        category: 'core',
        icon: 'LayoutDashboard',
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'profile-management',
        name: 'Gestión de Perfil',
        description: 'Gestión de perfil de usuario y organización',
        enabled: true,
        category: 'core',
        icon: 'User',
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'basic-inventory',
        name: 'Inventario Básico',
        description: 'Gestión básica de inventario de productos',
        enabled: true,
        category: 'core',
        icon: 'Package',
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'basic-rfq',
        name: 'RFQ Básico',
        description: 'Solicitudes de cotización básicas',
        enabled: true,
        category: 'core',
        icon: 'FileText',
        requiredPlan: ['basic', 'pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // WORKSHOP DATABASE FEATURES
      {
        id: 'suppliers-database',
        name: 'Base de Datos - Proveedores',
        description: 'Gestión de base de datos de proveedores',
        enabled: false,
        category: 'premium',
        icon: 'Factory',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'products-database',
        name: 'Base de Datos - Productos',
        description: 'Gestión de base de datos de productos',
        enabled: false,
        category: 'premium',
        icon: 'Boxes',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'logos-database',
        name: 'Base de Datos - Logos',
        description: 'Gestión de base de datos de logos',
        enabled: false,
        category: 'premium',
        icon: 'Image',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'users-management',
        name: 'Gestión de Usuarios',
        description: 'Gestión avanzada de usuarios del sistema',
        enabled: false,
        category: 'premium',
        icon: 'Users',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // WORKSHOP OPERATIONS FEATURES
      {
        id: 'advanced-rfq',
        name: 'RFQs Avanzados',
        description: 'Gestión avanzada de RFQs con plantillas',
        enabled: false,
        category: 'premium',
        icon: 'ClipboardList',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'new-rfq',
        name: 'Nuevo RFQ',
        description: 'Creación de nuevos RFQs con asistente',
        enabled: false,
        category: 'premium',
        icon: 'PlusSquare',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'quote-management',
        name: 'Gestión de Cotizaciones',
        description: 'Gestión avanzada de cotizaciones y comparación',
        enabled: false,
        category: 'premium',
        icon: 'FileSpreadsheet',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'order-tracking',
        name: 'Seguimiento de Órdenes',
        description: 'Seguimiento de órdenes en tiempo real',
        enabled: false,
        category: 'premium',
        icon: 'PackageSearch',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'tasks-management',
        name: 'Gestión de Tareas',
        description: 'Sistema de gestión de tareas y seguimiento',
        enabled: false,
        category: 'premium',
        icon: 'CheckSquare',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // COMMUNICATION FEATURES
      {
        id: 'whatsappIntegration',
        name: 'WhatsApp + IA',
        description: 'Integración con WhatsApp y asistente de IA',
        enabled: false,
        category: 'premium',
        icon: 'MessagesSquare',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // PROPOSALS FEATURES
      {
        id: 'proposals-management',
        name: 'Gestión de Propuestas',
        description: 'Sistema completo de gestión de propuestas',
        enabled: false,
        category: 'premium',
        icon: 'FileSignature',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'proposalEditor',
        name: 'Editor de Propuestas',
        description: 'Editor visual para crear propuestas personalizadas',
        enabled: false,
        category: 'premium',
        icon: 'Sparkles',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // TOOLS FEATURES
      {
        id: 'visual-editor',
        name: 'Editor Visual',
        description: 'Editor visual para diseño de productos',
        enabled: false,
        category: 'premium',
        icon: 'PenTool',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'pdf-generator',
        name: 'Generador de PDFs',
        description: 'Generación automática de PDFs para propuestas',
        enabled: false,
        category: 'premium',
        icon: 'FileDown',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // ANALYTICS FEATURES
      {
        id: 'analytics-basic',
        name: 'Analytics Básicos',
        description: 'Analytics básicos y reportes simples',
        enabled: false,
        category: 'premium',
        icon: 'BarChart3',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'reports-management',
        name: 'Gestión de Reportes',
        description: 'Sistema completo de reportes y análisis',
        enabled: false,
        category: 'premium',
        icon: 'FileBarChart',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'shipping-tracking',
        name: 'Envío y Tracking',
        description: 'Sistema de seguimiento de envíos',
        enabled: false,
        category: 'premium',
        icon: 'Truck',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // WEBSITE FEATURES
      {
        id: 'landingEditable',
        name: 'Páginas Editables',
        description: 'Sistema de páginas web editables',
        enabled: false,
        category: 'premium',
        icon: 'Globe',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // SETTINGS FEATURES
      {
        id: 'custom-branding',
        name: 'Personalización de Marca',
        description: 'Personalización de marca y colores',
        enabled: false,
        category: 'premium',
        icon: 'Palette',
        requiredPlan: ['pro', 'premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'advanced-settings',
        name: 'Configuración Avanzada',
        description: 'Configuración avanzada del sistema',
        enabled: false,
        category: 'enterprise',
        icon: 'Settings2',
        requiredPlan: ['premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },

      // ENTERPRISE FEATURES
      {
        id: 'advanced-analytics',
        name: 'Analytics Avanzados',
        description: 'Analytics avanzados con métricas detalladas',
        enabled: false,
        category: 'enterprise',
        icon: 'TrendingUp',
        requiredPlan: ['premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'bulk-operations',
        name: 'Operaciones Masivas',
        description: 'Operaciones masivas y procesamiento por lotes',
        enabled: false,
        category: 'enterprise',
        icon: 'Upload',
        requiredPlan: ['premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'api-access',
        name: 'Acceso a API',
        description: 'Acceso a APIs para integraciones externas',
        enabled: false,
        category: 'enterprise',
        icon: 'Code',
        requiredPlan: ['premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'priority-support',
        name: 'Soporte Prioritario',
        description: 'Soporte prioritario y atención personalizada',
        enabled: false,
        category: 'enterprise',
        icon: 'Headphones',
        requiredPlan: ['premium', 'enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'custom-integrations',
        name: 'Integraciones Personalizadas',
        description: 'Integraciones personalizadas y desarrollos a medida',
        enabled: false,
        category: 'enterprise',
        icon: 'Plug',
        requiredPlan: ['enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'white-label',
        name: 'White Label',
        description: 'Solución white label para revendedores',
        enabled: false,
        category: 'enterprise',
        icon: 'Shield',
        requiredPlan: ['enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'custom-features',
        name: 'Features Personalizados',
        description: 'Desarrollo de features personalizados',
        enabled: false,
        category: 'custom',
        icon: 'Wrench',
        requiredPlan: ['enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'advanced-security',
        name: 'Seguridad Avanzada',
        description: 'Seguridad avanzada y auditoría',
        enabled: false,
        category: 'enterprise',
        icon: 'Lock',
        requiredPlan: ['enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'audit-logs',
        name: 'Logs de Auditoría',
        description: 'Registro de auditoría y trazabilidad',
        enabled: false,
        category: 'enterprise',
        icon: 'FileSearch',
        requiredPlan: ['enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        id: 'multi-tenant-management',
        name: 'Gestión Multi-tenant',
        description: 'Gestión de múltiples organizaciones y tenants',
        enabled: false,
        category: 'enterprise',
        icon: 'Workflow',
        requiredPlan: ['enterprise'],
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          createdBy: 'system'
        }
      }
    ]

    const mockPlans: PlanFeatures[] = [
      {
        planId: 'basic',
        planName: 'Básico',
        features: ['dashboard-overview', 'profile-management', 'basic-inventory', 'basic-rfq']
      },
      {
        planId: 'pro',
        planName: 'Pro',
        features: ['dashboard-overview', 'profile-management', 'basic-inventory', 'basic-rfq', 'advanced-inventory', 'quote-management', 'order-tracking', 'analytics-basic', 'custom-branding']
      },
      {
        planId: 'premium',
        planName: 'Premium',
        features: ['dashboard-overview', 'profile-management', 'basic-inventory', 'basic-rfq', 'advanced-inventory', 'quote-management', 'order-tracking', 'analytics-basic', 'custom-branding', 'advanced-analytics', 'bulk-operations', 'api-access', 'priority-support', 'custom-integrations']
      },
      {
        planId: 'enterprise',
        planName: 'Enterprise',
        features: ['dashboard-overview', 'profile-management', 'basic-inventory', 'basic-rfq', 'advanced-inventory', 'quote-management', 'order-tracking', 'analytics-basic', 'custom-branding', 'advanced-analytics', 'bulk-operations', 'api-access', 'priority-support', 'custom-integrations', 'white-label', 'custom-features', 'advanced-security', 'audit-logs', 'multi-tenant-management']
      }
    ]

    const mockOrganizations = [
      {
        id: 'org-1',
        name: 'OnPoint Workshop',
        type: 'workshop',
        plan: 'pro',
        status: 'active',
        loyaltyTier: 'gold',
        createdAt: '2024-01-15'
      },
      {
        id: 'org-2', 
        name: 'Forpromo Solutions',
        type: 'provider',
        plan: 'premium',
        status: 'active',
        loyaltyTier: 'platinum',
        createdAt: '2024-02-20'
      },
      {
        id: 'org-3',
        name: 'Creative Studio MX',
        type: 'workshop', 
        plan: 'basic',
        status: 'active',
        loyaltyTier: 'silver',
        createdAt: '2024-03-10'
      }
    ]

    setFeatures(mockFeatures)
    setPlans(mockPlans)
    setOrganizations(mockOrganizations)
    setIsLoading(false)
  }, [])

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleToggleFeature = async (featureId: string, enabled: boolean) => {
    setFeatures(prev => prev.map(f => 
      f.id === featureId 
        ? { 
            ...f, 
            enabled, 
            metadata: { 
              version: '1.0.0',
              lastUpdated: new Date().toISOString(),
              createdBy: 'admin',
              ...f.metadata
            } 
          }
        : f
    ))
  }

  const handleCreateFeature = async (featureData: Omit<Feature, 'id' | 'metadata'>) => {
    const newFeature: Feature = {
      ...featureData,
      id: featureData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        createdBy: 'admin'
      }
    }
    
    setFeatures(prev => [...prev, newFeature])
    setIsCreatingFeature(false)
  }

  const handleUpdateFeature = async (featureId: string, updates: Partial<Feature>) => {
    setFeatures(prev => prev.map(f => 
      f.id === featureId 
        ? { 
            ...f, 
            ...updates, 
            metadata: { 
              version: '1.0.0',
              lastUpdated: new Date().toISOString(),
              createdBy: 'admin',
              ...f.metadata
            } 
          }
        : f
    ))
    setEditingFeature(null)
  }

  const handleDeleteFeature = async (featureId: string) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId))
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      core: 'bg-blue-100 text-blue-800',
      premium: 'bg-green-100 text-green-800',
      enterprise: 'bg-purple-100 text-purple-800',
      custom: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPlanColor = (planId: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      premium: 'bg-green-100 text-green-800',
      enterprise: 'bg-purple-100 text-purple-800'
    }
    return colors[planId as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Features</h1>
            <p className="text-muted-foreground mt-2">
              Controla qué funcionalidades están disponibles para cada plan, organización y cliente de lealtad
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
            <Dialog open={isCreatingFeature} onOpenChange={setIsCreatingFeature}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Feature
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Feature</DialogTitle>
                  <DialogDescription>
                    Define una nueva funcionalidad que podrás asignar a planes específicos
                  </DialogDescription>
                </DialogHeader>
                <CreateFeatureForm onSubmit={handleCreateFeature} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Features</p>
                <p className="text-2xl font-bold">{features.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Features Activos</p>
                <p className="text-2xl font-bold">{features.filter(f => f.enabled).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Organizaciones</p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Overrides Activos</p>
                <p className="text-2xl font-bold">{overrides.length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="plans">Planes</TabsTrigger>
          <TabsTrigger value="organizations">Organizaciones</TabsTrigger>
          <TabsTrigger value="overrides">Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4">
            {filteredFeatures.map((feature) => {
              const IconComponent = iconMap[feature.icon] || FileText
              return (
                <Card key={feature.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(feature.category)}>
                          {feature.category}
                        </Badge>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={(enabled) => handleToggleFeature(feature.id, enabled)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingFeature(feature)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFeature(feature.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium">Planes requeridos:</Label>
                        <div className="flex space-x-1">
                          {feature.requiredPlan?.map(planId => (
                            <Badge key={planId} variant="outline" className={getPlanColor(planId)}>
                              {plans.find(p => p.planId === planId)?.planName || planId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Última actualización: {new Date(feature.metadata?.lastUpdated || '').toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PlansManagement plans={plans} features={features} onUpdatePlan={setPlans} />
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <OrganizationsManagement 
            organizations={organizations} 
            features={features}
            onUpdateOrganizations={setOrganizations}
            onCreateOverride={(override) => setOverrides(prev => [...prev, override])}
          />
        </TabsContent>

        <TabsContent value="overrides" className="space-y-6">
          <OverridesManagement 
            overrides={overrides} 
            organizations={organizations}
            features={features}
            onUpdateOverrides={setOverrides} 
          />
        </TabsContent>
      </Tabs>

      {/* Edit Feature Dialog */}
      {editingFeature && (
        <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Feature</DialogTitle>
              <DialogDescription>
                Modifica la configuración del feature
              </DialogDescription>
            </DialogHeader>
            <EditFeatureForm 
              feature={editingFeature} 
              onSubmit={(updates) => handleUpdateFeature(editingFeature.id, updates)}
              onCancel={() => setEditingFeature(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Create Feature Form Component
function CreateFeatureForm({ onSubmit }: { onSubmit: (feature: Omit<Feature, 'id' | 'metadata'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'custom' as const,
    icon: 'FileText',
    enabled: false,
    requiredPlan: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Feature</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ej: Generador de Propuestas"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe qué hace este feature..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="icon">Icono</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FileText">FileText</SelectItem>
              <SelectItem value="BarChart3">BarChart3</SelectItem>
              <SelectItem value="Package">Package</SelectItem>
              <SelectItem value="Calculator">Calculator</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Palette">Palette</SelectItem>
              <SelectItem value="TrendingUp">TrendingUp</SelectItem>
              <SelectItem value="Upload">Upload</SelectItem>
              <SelectItem value="Code">Code</SelectItem>
              <SelectItem value="Headphones">Headphones</SelectItem>
              <SelectItem value="Plug">Plug</SelectItem>
              <SelectItem value="Shield">Shield</SelectItem>
              <SelectItem value="Wrench">Wrench</SelectItem>
              <SelectItem value="Lock">Lock</SelectItem>
              <SelectItem value="FileSearch">FileSearch</SelectItem>
              <SelectItem value="Workflow">Workflow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Planes requeridos</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['basic', 'pro', 'premium', 'enterprise'].map(plan => (
            <div key={plan} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={plan}
                checked={formData.requiredPlan.includes(plan)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, requiredPlan: [...prev.requiredPlan, plan] }))
                  } else {
                    setFormData(prev => ({ ...prev, requiredPlan: prev.requiredPlan.filter(p => p !== plan) }))
                  }
                }}
              />
              <Label htmlFor={plan} className="text-sm capitalize">{plan}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
        />
        <Label htmlFor="enabled">Habilitado por defecto</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Crear Feature</Button>
      </div>
    </form>
  )
}

// Edit Feature Form Component
function EditFeatureForm({ 
  feature, 
  onSubmit, 
  onCancel 
}: { 
  feature: Feature
  onSubmit: (updates: Partial<Feature>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: feature.name,
    description: feature.description,
    category: feature.category,
    icon: feature.icon,
    enabled: feature.enabled,
    requiredPlan: feature.requiredPlan || []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Feature</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="icon">Icono</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FileText">FileText</SelectItem>
              <SelectItem value="BarChart3">BarChart3</SelectItem>
              <SelectItem value="Package">Package</SelectItem>
              <SelectItem value="Calculator">Calculator</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Palette">Palette</SelectItem>
              <SelectItem value="TrendingUp">TrendingUp</SelectItem>
              <SelectItem value="Upload">Upload</SelectItem>
              <SelectItem value="Code">Code</SelectItem>
              <SelectItem value="Headphones">Headphones</SelectItem>
              <SelectItem value="Plug">Plug</SelectItem>
              <SelectItem value="Shield">Shield</SelectItem>
              <SelectItem value="Wrench">Wrench</SelectItem>
              <SelectItem value="Lock">Lock</SelectItem>
              <SelectItem value="FileSearch">FileSearch</SelectItem>
              <SelectItem value="Workflow">Workflow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Planes requeridos</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['basic', 'pro', 'premium', 'enterprise'].map(plan => (
            <div key={plan} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={plan}
                checked={formData.requiredPlan.includes(plan)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, requiredPlan: [...prev.requiredPlan, plan] }))
                  } else {
                    setFormData(prev => ({ ...prev, requiredPlan: prev.requiredPlan.filter(p => p !== plan) }))
                  }
                }}
              />
              <Label htmlFor={plan} className="text-sm capitalize">{plan}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
        />
        <Label htmlFor="enabled">Habilitado</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  )
}

// Plans Management Component
function PlansManagement({ 
  plans, 
  features, 
  onUpdatePlan 
}: { 
  plans: PlanFeatures[]
  features: Feature[]
  onUpdatePlan: (plans: PlanFeatures[]) => void
}) {
  const handleToggleFeatureInPlan = (planId: string, featureId: string) => {
    const updatedPlans = plans.map(plan => {
      if (plan.planId === planId) {
        const hasFeature = plan.features.includes(featureId)
        return {
          ...plan,
          features: hasFeature 
            ? plan.features.filter(f => f !== featureId)
            : [...plan.features, featureId]
        }
      }
      return plan
    })
    onUpdatePlan(updatedPlans)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {plans.map(plan => (
          <Card key={plan.planId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.planName}
                <Badge variant="outline">{plan.features.length} features</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {features.map(feature => {
                  const isIncluded = plan.features.includes(feature.id)
                  const IconComponent = iconMap[feature.icon] || FileText
                  
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{feature.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                      <Switch
                        checked={isIncluded}
                        onCheckedChange={() => handleToggleFeatureInPlan(plan.planId, feature.id)}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Organizations Management Component
function OrganizationsManagement({ 
  organizations, 
  features,
  onUpdateOrganizations,
  onCreateOverride
}: { 
  organizations: any[]
  features: Feature[]
  onUpdateOrganizations: (orgs: any[]) => void
  onCreateOverride: (override: FeatureOverride) => void
}) {
  const [selectedOrg, setSelectedOrg] = useState<any>(null)
  const [isCreatingOverride, setIsCreatingOverride] = useState(false)

  const handleCreateOverride = (orgId: string, featureId: string, enabled: boolean) => {
    const newOverride: FeatureOverride = {
      id: `override_${Date.now()}`,
      featureId,
      orgId,
      enabled,
      reason: 'Override manual',
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    }
    onCreateOverride(newOverride)
    setIsCreatingOverride(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organizations List */}
        <Card>
          <CardHeader>
            <CardTitle>Organizaciones</CardTitle>
            <CardDescription>
              Selecciona una organización para gestionar sus features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {organizations.map((org) => (
                <div 
                  key={org.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOrg?.id === org.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedOrg(org)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{org.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {org.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {org.plan}
                        </Badge>
                        <Badge 
                          variant={org.loyaltyTier === 'platinum' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {org.loyaltyTier}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Activa</p>
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Organization Features */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedOrg ? `Features de ${selectedOrg.name}` : 'Selecciona una organización'}
            </CardTitle>
            <CardDescription>
              {selectedOrg ? 'Gestiona los features específicos para esta organización' : 'Elige una organización para ver sus features'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedOrg ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Plan actual: {selectedOrg.plan}</p>
                    <p className="text-sm text-muted-foreground">
                      Tier de lealtad: {selectedOrg.loyaltyTier}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setIsCreatingOverride(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Override
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Features disponibles</h4>
                  {features.map((feature) => {
                    const IconComponent = iconMap[feature.icon] || FileText
                    return (
                      <div key={feature.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{feature.name}</p>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {feature.category}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateOverride(selectedOrg.id, feature.id, true)}
                          >
                            Habilitar
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona una organización para gestionar sus features</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Overrides Management Component
function OverridesManagement({ 
  overrides, 
  organizations,
  features,
  onUpdateOverrides 
}: { 
  overrides: FeatureOverride[]
  organizations: any[]
  features: Feature[]
  onUpdateOverrides: (overrides: FeatureOverride[]) => void
}) {
  const getOrgName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId)
    return org?.name || 'Organización desconocida'
  }

  const getFeatureName = (featureId: string) => {
    const feature = features.find(f => f.id === featureId)
    return feature?.name || 'Feature desconocido'
  }

  const handleRemoveOverride = (overrideId: string) => {
    onUpdateOverrides(overrides.filter(o => o.id !== overrideId))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overrides de Organización</CardTitle>
          <CardDescription>
            Personaliza features específicos para organizaciones individuales y clientes de lealtad
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overrides.length > 0 ? (
            <div className="space-y-4">
              {overrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{getOrgName(override.orgId)}</h4>
                        <Badge variant={override.enabled ? 'default' : 'destructive'}>
                          {override.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Feature: {getFeatureName(override.featureId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Razón: {override.reason} • Creado: {new Date(override.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveOverride(override.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay overrides configurados</p>
              <p className="text-sm">Los overrides te permiten habilitar/deshabilitar features específicos para organizaciones individuales</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
