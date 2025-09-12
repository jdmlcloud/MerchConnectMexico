"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  FileText,
  CreditCard,
  ShoppingCart,
  Package,
  Users,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface ActivityItem {
  id: string
  type: "rfq" | "quote" | "order" | "user" | "org" | "inventory"
  title: string
  description: string
  timestamp: string
  status: "completed" | "pending" | "error" | "info"
  user?: string
  amount?: string
}

interface RecentActivityProps {
  role: "admin" | "workshop" | "provider"
}

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "rfq":
      return FileText
    case "quote":
      return CreditCard
    case "order":
      return ShoppingCart
    case "user":
      return Users
    case "org":
      return Building2
    case "inventory":
      return Package
    default:
      return FileText
  }
}

const getStatusIcon = (status: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case "info":
      return <div className="h-4 w-4 rounded-full bg-blue-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "info":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

function ActivityItem({ item }: { item: ActivityItem }) {
  const Icon = getActivityIcon(item.type)

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <div className="flex items-center space-x-2">
            {getStatusIcon(item.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem>Marcar como leído</DropdownMenuItem>
                <DropdownMenuItem>Archivar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={`text-xs ${getStatusColor(item.status)}`}
            >
              {item.status}
            </Badge>
            {item.user && (
              <span className="text-xs text-muted-foreground">
                por {item.user}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {item.amount && (
              <span className="text-sm font-medium text-green-600">
                {item.amount}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RecentActivity({ role }: RecentActivityProps) {
  const adminActivities: ActivityItem[] = [
    {
      id: "1",
      type: "org",
      title: "Nueva organización registrada",
      description: "OnPoint Workshop se registró en la plataforma",
      timestamp: "Hace 2 horas",
      status: "completed",
      user: "Sistema",
    },
    {
      id: "2",
      type: "user",
      title: "Usuario suspendido",
      description: "admin@spam.com fue suspendido por violación de términos",
      timestamp: "Hace 4 horas",
      status: "completed",
      user: "Admin",
    },
    {
      id: "3",
      type: "order",
      title: "Orden procesada",
      description: "Orden #1234 por $2,500 fue completada exitosamente",
      timestamp: "Hace 6 horas",
      status: "completed",
      amount: "$2,500",
    },
    {
      id: "4",
      type: "org",
      title: "Solicitud de upgrade",
      description: "Forpromo Solutions solicitó cambio a plan Premium",
      timestamp: "Hace 1 día",
      status: "pending",
    },
    {
      id: "5",
      type: "user",
      title: "Error de autenticación",
      description: "Múltiples intentos fallidos desde IP 192.168.1.100",
      timestamp: "Hace 2 días",
      status: "error",
    },
  ]

  const workshopActivities: ActivityItem[] = [
    {
      id: "1",
      type: "quote",
      title: "Nueva cotización recibida",
      description: "Forpromo Solutions respondió a tu RFQ de camisetas",
      timestamp: "Hace 1 hora",
      status: "completed",
      amount: "$1,250",
    },
    {
      id: "2",
      type: "order",
      title: "Orden confirmada",
      description: "Tu orden #1234 ha sido confirmada y está en producción",
      timestamp: "Hace 3 horas",
      status: "completed",
      amount: "$2,500",
    },
    {
      id: "3",
      type: "rfq",
      title: "RFQ publicado",
      description: "Publicaste un RFQ para 500 tazas personalizadas",
      timestamp: "Hace 5 horas",
      status: "pending",
    },
    {
      id: "4",
      type: "quote",
      title: "Cotización expirada",
      description: "La cotización de PromoMax expiró sin respuesta",
      timestamp: "Hace 1 día",
      status: "error",
    },
    {
      id: "5",
      type: "order",
      title: "Orden entregada",
      description: "Tu orden #1233 fue entregada exitosamente",
      timestamp: "Hace 2 días",
      status: "completed",
      amount: "$1,800",
    },
  ]

  const providerActivities: ActivityItem[] = [
    {
      id: "1",
      type: "rfq",
      title: "Nuevo RFQ recibido",
      description: "OnPoint Workshop necesita 1000 camisetas personalizadas",
      timestamp: "Hace 30 minutos",
      status: "pending",
    },
    {
      id: "2",
      type: "quote",
      title: "Cotización enviada",
      description: "Enviaste cotización por $1,250 a TechCorp",
      timestamp: "Hace 2 horas",
      status: "completed",
      amount: "$1,250",
    },
    {
      id: "3",
      type: "order",
      title: "Orden recibida",
      description: "Nueva orden #1235 de Creative Agency por $3,200",
      timestamp: "Hace 4 horas",
      status: "completed",
      amount: "$3,200",
    },
    {
      id: "4",
      type: "inventory",
      title: "Stock bajo",
      description: "Solo quedan 50 unidades de camisetas blancas",
      timestamp: "Hace 6 horas",
      status: "error",
    },
    {
      id: "5",
      type: "quote",
      title: "Cotización aceptada",
      description: "Tu cotización de $2,100 fue aceptada por Design Studio",
      timestamp: "Hace 1 día",
      status: "completed",
      amount: "$2,100",
    },
  ]

  const getActivities = () => {
    switch (role) {
      case "admin":
        return adminActivities
      case "workshop":
        return workshopActivities
      case "provider":
        return providerActivities
      default:
        return []
    }
  }

  const activities = getActivities()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} item={activity} />
          ))}
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            Ver toda la actividad
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
