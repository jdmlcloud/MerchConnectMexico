"use client"

import { DashboardLayout } from "../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/badge"
import { useFeatureFlags } from "../../src/hooks/use-feature-flags"
import { 
  Package, 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Download,
  LayoutDashboard,
  Factory,
  Boxes,
  Image,
  ClipboardList,
  PlusSquare,
  FileSpreadsheet,
  PackageSearch,
  CheckSquare,
  MessagesSquare,
  FileSignature,
  Sparkles,
  PenTool,
  FileDown,
  BarChart3,
  FileBarChart,
  Truck,
  Globe,
  Palette,
  UserCog,
  BadgeCheck,
  Settings2
} from "lucide-react"

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Factory,
  Boxes,
  Image,
  Users,
  ClipboardList,
  PlusSquare,
  FileSpreadsheet,
  PackageSearch,
  CheckSquare,
  MessagesSquare,
  FileSignature,
  Sparkles,
  PenTool,
  FileDown,
  BarChart3,
  FileBarChart,
  Truck,
  Globe,
  Palette,
  UserCog,
  BadgeCheck,
  Settings2
}

const workshopStats = [
  {
    title: "RFQs Activos",
    value: "12",
    change: "+3",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Cotizaciones Recibidas",
    value: "45",
    change: "+8",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Proveedores Activos",
    value: "23",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Órdenes Completadas",
    value: "8",
    change: "+1",
    changeType: "positive" as const,
    icon: Package,
  },
]

export default function WorkshopPage() {
  const { getFilteredWorkshopNavigation, loading } = useFeatureFlags()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando...</div>
        </div>
      </DashboardLayout>
    )
  }

  const navigation = getFilteredWorkshopNavigation()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portal de Talleres</h1>
            <p className="text-gray-600">Gestiona tus RFQs, cotizaciones y órdenes de compra</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo RFQ
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workshopStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Badge 
                      variant={stat.changeType === "positive" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <span>desde la semana pasada</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Navegación del Workshop */}
        <div className="grid gap-6">
          {navigation.map((group) => (
            <Card key={group.group}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {group.group}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => {
                    const Icon = iconMap[item.icon]
                    return (
                      <Button
                        key={item.path}
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        asChild
                      >
                        <a href={item.path}>
                          <Icon className="mr-3 h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">{item.label}</div>
                            {item.feature && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Feature
                              </Badge>
                            )}
                            {item.perm && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {item.perm}
                              </Badge>
                            )}
                          </div>
                        </a>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información sobre features */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades Disponibles</CardTitle>
            <p className="text-sm text-gray-600">
              Las funcionalidades mostradas arriba están controladas por el administrador del sistema. 
              Contacta con tu administrador si necesitas acceso a funcionalidades adicionales.
            </p>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  )
}