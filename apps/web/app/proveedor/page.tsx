import { DashboardLayout } from "../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/badge"
import { 
  Package, 
  FileText, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react"

const providerStats = [
  {
    title: "RFQs Disponibles",
    value: "28",
    change: "+5",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Cotizaciones Enviadas",
    value: "67",
    change: "+12",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Órdenes Ganadas",
    value: "15",
    change: "+3",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Ingresos del Mes",
    value: "$45,230",
    change: "+18%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const availableRfqs = [
  {
    id: "RFQ-001",
    title: "Cascos de Seguridad Industrial",
    quantity: 500,
    deadline: "3 días",
    category: "Seguridad",
    budget: "$50,000 - $75,000",
    status: "active",
  },
  {
    id: "RFQ-002", 
    title: "Uniformes de Trabajo",
    quantity: 200,
    deadline: "5 días",
    category: "Textiles",
    budget: "$15,000 - $25,000",
    status: "active",
  },
  {
    id: "RFQ-003",
    title: "Herramientas Eléctricas",
    quantity: 100,
    deadline: "2 días",
    category: "Herramientas",
    budget: "$30,000 - $45,000",
    status: "urgent",
  },
]

const myQuotes = [
  {
    id: "Q-001",
    rfqTitle: "Cascos de Seguridad Industrial",
    amount: "$65,000",
    status: "pending",
    submitted: "2 horas ago",
  },
  {
    id: "Q-002",
    rfqTitle: "Uniformes de Trabajo", 
    amount: "$22,500",
    status: "accepted",
    submitted: "1 día ago",
  },
  {
    id: "Q-003",
    rfqTitle: "Herramientas Eléctricas",
    amount: "$38,000",
    status: "rejected",
    submitted: "3 días ago",
  },
]

const quickActions = [
  {
    title: "Buscar RFQs",
    description: "Explorar nuevas oportunidades",
    icon: Search,
    href: "/proveedor/rfqs",
  },
  {
    title: "Mis Cotizaciones",
    description: "Gestionar propuestas enviadas",
    icon: FileText,
    href: "/proveedor/quotes",
  },
  {
    title: "Mi Inventario",
    description: "Actualizar productos disponibles",
    icon: Package,
    href: "/proveedor/inventory",
  },
  {
    title: "Perfil de Empresa",
    description: "Configurar información de la empresa",
    icon: Eye,
    href: "/proveedor/profile",
  },
]

export default function ProveedorPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portal de Proveedores</h1>
            <p className="text-gray-600">Encuentra oportunidades, envía cotizaciones y gestiona tu negocio</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cotización
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {providerStats.map((stat) => {
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
          {/* RFQs Disponibles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>RFQs Disponibles</CardTitle>
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableRfqs.map((rfq) => (
                  <div key={rfq.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rfq.title}</h4>
                      <Badge 
                        variant={rfq.status === "urgent" ? "destructive" : "default"}
                      >
                        {rfq.status === "urgent" ? "Urgente" : "Activo"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div>Cantidad: {rfq.quantity}</div>
                      <div>Plazo: {rfq.deadline}</div>
                      <div>Categoría: {rfq.category}</div>
                      <div>Presupuesto: {rfq.budget}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                      <Button size="sm">
                        Cotizar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mis Cotizaciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mis Cotizaciones</CardTitle>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{quote.rfqTitle}</h4>
                        <Badge 
                          variant={quote.status === "accepted" ? "default" : 
                                  quote.status === "pending" ? "secondary" : "destructive"}
                        >
                          {quote.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Monto: {quote.amount} • {quote.submitted}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
    </DashboardLayout>
  )
}