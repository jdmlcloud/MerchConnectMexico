import { DashboardLayout } from "../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/badge"
import { 
  Package, 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Download
} from "lucide-react"

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

const recentRfqs = [
  {
    id: "RFQ-001",
    title: "Cascos de Seguridad Industrial",
    quantity: 500,
    status: "active",
    responses: 8,
    created: "2 horas ago",
  },
  {
    id: "RFQ-002", 
    title: "Uniformes de Trabajo",
    quantity: 200,
    status: "quoted",
    responses: 12,
    created: "1 día ago",
  },
  {
    id: "RFQ-003",
    title: "Herramientas Eléctricas",
    quantity: 100,
    status: "completed",
    responses: 15,
    created: "3 días ago",
  },
]

const quickActions = [
  {
    title: "Nuevo RFQ",
    description: "Crear una nueva solicitud de cotización",
    icon: Plus,
    href: "/workshop/rfq/new",
  },
  {
    title: "Ver Cotizaciones",
    description: "Revisar propuestas recibidas",
    icon: FileText,
    href: "/workshop/quotes",
  },
  {
    title: "Gestionar Órdenes",
    description: "Seguimiento de órdenes activas",
    icon: Package,
    href: "/workshop/orders",
  },
  {
    title: "Proveedores",
    description: "Explorar proveedores disponibles",
    icon: Users,
    href: "/workshop/suppliers",
  },
]

export default function WorkshopPage() {
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* RFQs Recientes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>RFQs Recientes</CardTitle>
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRfqs.map((rfq) => (
                  <div key={rfq.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{rfq.title}</h4>
                        <Badge 
                          variant={rfq.status === "active" ? "default" : 
                                  rfq.status === "quoted" ? "secondary" : "outline"}
                        >
                          {rfq.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Cantidad: {rfq.quantity} unidades • {rfq.responses} respuestas
                      </p>
                      <p className="text-xs text-gray-400">{rfq.created}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      asChild
                    >
                      <a href={action.href}>
                        <Icon className="mr-3 h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-gray-500">{action.description}</div>
                        </div>
                      </a>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}