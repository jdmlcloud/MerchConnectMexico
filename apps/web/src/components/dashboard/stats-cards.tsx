"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  ShoppingCart,
  DollarSign,
  Package,
  FileText,
  CreditCard,
  Activity,
} from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  subtitle?: string
  progress?: number
}

function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  subtitle,
  progress,
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />
      case "negative":
        return <TrendingDown className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {change !== undefined && (
          <div className={`flex items-center text-xs ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="ml-1">
              {change > 0 ? "+" : ""}{change}%
            </span>
            <span className="ml-1 text-muted-foreground">vs mes anterior</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progress}% del objetivo mensual
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  role: "admin" | "workshop" | "provider"
}

export function StatsCards({ role }: StatsCardsProps) {
  const adminStats = [
    {
      title: "Organizaciones Activas",
      value: 24,
      change: 12.5,
      changeType: "positive" as const,
      icon: Building2,
      subtitle: "2 nuevas este mes",
    },
    {
      title: "Usuarios Totales",
      value: 156,
      change: 8.2,
      changeType: "positive" as const,
      icon: Users,
      subtitle: "13 nuevos usuarios",
    },
    {
      title: "Órdenes del Mes",
      value: 89,
      change: -2.1,
      changeType: "negative" as const,
      icon: ShoppingCart,
      subtitle: "vs 91 el mes pasado",
    },
    {
      title: "Ingresos Totales",
      value: "$45,230",
      change: 15.3,
      changeType: "positive" as const,
      icon: DollarSign,
      subtitle: "Comisión del 5%",
      progress: 75,
    },
  ]

  const workshopStats = [
    {
      title: "RFQs Activos",
      value: 5,
      change: 25.0,
      changeType: "positive" as const,
      icon: FileText,
      subtitle: "1 nuevo esta semana",
    },
    {
      title: "Cotizaciones Recibidas",
      value: 12,
      change: 8.3,
      changeType: "positive" as const,
      icon: CreditCard,
      subtitle: "3 pendientes de revisión",
    },
    {
      title: "Órdenes Completadas",
      value: 8,
      change: 0,
      changeType: "neutral" as const,
      icon: ShoppingCart,
      subtitle: "Este mes",
    },
    {
      title: "Presupuesto Gastado",
      value: "$12,450",
      change: -5.2,
      changeType: "negative" as const,
      icon: DollarSign,
      subtitle: "de $15,000 presupuestado",
      progress: 83,
    },
  ]

  const providerStats = [
    {
      title: "Productos en Inventario",
      value: 156,
      change: 8.0,
      changeType: "positive" as const,
      icon: Package,
      subtitle: "12 nuevos productos",
    },
    {
      title: "RFQs Recibidos",
      value: 23,
      change: 15.4,
      changeType: "positive" as const,
      icon: FileText,
      subtitle: "5 nuevos esta semana",
    },
    {
      title: "Cotizaciones Enviadas",
      value: 18,
      change: 12.5,
      changeType: "positive" as const,
      icon: CreditCard,
      subtitle: "Tasa de respuesta: 78%",
    },
    {
      title: "Ventas del Mes",
      value: "$28,750",
      change: 22.1,
      changeType: "positive" as const,
      icon: DollarSign,
      subtitle: "vs $23,500 el mes pasado",
      progress: 95,
    },
  ]

  const getStats = () => {
    switch (role) {
      case "admin":
        return adminStats
      case "workshop":
        return workshopStats
      case "provider":
        return providerStats
      default:
        return []
    }
  }

  const stats = getStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
