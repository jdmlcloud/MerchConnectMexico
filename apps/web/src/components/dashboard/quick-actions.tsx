"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  FileText,
  Package,
  Users,
  Settings,
  BarChart3,
  Building2,
  CreditCard,
  ShoppingCart,
  Upload,
} from "lucide-react"

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  variant?: "default" | "secondary" | "outline"
  badge?: string
}

interface QuickActionsProps {
  role: "admin" | "workshop" | "provider"
}

export function QuickActions({ role }: QuickActionsProps) {
  const adminActions: QuickAction[] = [
    {
      title: "Nueva Organización",
      description: "Registrar una nueva organización en la plataforma",
      icon: Building2,
      action: () => console.log("Crear organización"),
      variant: "default",
    },
    {
      title: "Gestionar Usuarios",
      description: "Ver y administrar usuarios del sistema",
      icon: Users,
      action: () => console.log("Gestionar usuarios"),
      variant: "secondary",
    },
    {
      title: "Ver Analytics",
      description: "Revisar métricas y estadísticas del sistema",
      icon: BarChart3,
      action: () => console.log("Ver analytics"),
      variant: "outline",
    },
    {
      title: "Configuración",
      description: "Ajustar configuraciones del sistema",
      icon: Settings,
      action: () => console.log("Configuración"),
      variant: "outline",
    },
  ]

  const workshopActions: QuickAction[] = [
    {
      title: "Crear RFQ",
      description: "Solicitar cotizaciones para productos",
      icon: FileText,
      action: () => console.log("Crear RFQ"),
      variant: "default",
      badge: "Popular",
    },
    {
      title: "Ver Cotizaciones",
      description: "Revisar cotizaciones recibidas",
      icon: CreditCard,
      action: () => console.log("Ver cotizaciones"),
      variant: "secondary",
    },
    {
      title: "Mis Órdenes",
      description: "Gestionar órdenes activas y completadas",
      icon: ShoppingCart,
      action: () => console.log("Ver órdenes"),
      variant: "outline",
    },
    {
      title: "Mi Sitio Web",
      description: "Personalizar mi página pública",
      icon: Building2,
      action: () => console.log("Editar sitio"),
      variant: "outline",
    },
  ]

  const providerActions: QuickAction[] = [
    {
      title: "Agregar Producto",
      description: "Añadir nuevo producto al inventario",
      icon: Package,
      action: () => console.log("Agregar producto"),
      variant: "default",
      badge: "Nuevo",
    },
    {
      title: "Ver RFQs",
      description: "Revisar RFQs recibidos",
      icon: FileText,
      action: () => console.log("Ver RFQs"),
      variant: "secondary",
    },
    {
      title: "Enviar Cotización",
      description: "Responder a RFQs con cotizaciones",
      icon: CreditCard,
      action: () => console.log("Enviar cotización"),
      variant: "outline",
    },
    {
      title: "Subir Imágenes",
      description: "Agregar imágenes de productos",
      icon: Upload,
      action: () => console.log("Subir imágenes"),
      variant: "outline",
    },
  ]

  const getActions = () => {
    switch (role) {
      case "admin":
        return adminActions
      case "workshop":
        return workshopActions
      case "provider":
        return providerActions
      default:
        return []
    }
  }

  const actions = getActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Button
                  variant={action.variant}
                  className="h-auto p-4 justify-start"
                  onClick={action.action}
                >
                  <div className="flex items-start space-x-3">
                    <action.icon className="h-5 w-5 mt-0.5" />
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{action.title}</span>
                        {action.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{action.title}</DialogTitle>
                  <DialogDescription>
                    {action.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Esta funcionalidad estará disponible próximamente. 
                    Por ahora, puedes explorar el dashboard y familiarizarte 
                    con la interfaz.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
