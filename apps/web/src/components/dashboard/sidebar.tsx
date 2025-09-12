"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Package,
  FileText,
  ShoppingCart,
  CreditCard,
  Bell,
  HelpCircle,
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
  Workflow,
  Package2,
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
  FileBarChart,
  Globe,
  UserCog,
  BadgeCheck,
  Settings2
} from "lucide-react"
import { useState, useEffect } from "react"
import { useFeatureFlags, FeatureGate } from "@/hooks/use-feature-flags"

interface SidebarProps {
  role: "admin" | "workshop" | "provider"
  orgName?: string
  plan?: string
}

// Navigation items with feature mapping
const navigationItems = {
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home, feature: "dashboard-overview" },
    { name: "Organizaciones", href: "/admin/organizations", icon: Building2, feature: "multi-tenant-management" },
    { name: "Usuarios", href: "/admin/users", icon: Users, feature: "multi-tenant-management" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, feature: "advanced-analytics" },
    { name: "Features", href: "/admin/features", icon: Settings, feature: "multi-tenant-management" },
    { name: "Configuración", href: "/admin/settings", icon: Settings, feature: "multi-tenant-management" },
  ],
  workshop: [
    // DASHBOARD
    { name: "Dashboard", href: "/workshop", icon: Home, feature: "dashboard-overview" },
    
    // BASE DE DATOS
    { name: "Proveedores", href: "/workshop/base-de-datos/proveedores", icon: Factory, feature: "suppliers-database" },
    { name: "Productos", href: "/workshop/base-de-datos/productos", icon: Boxes, feature: "products-database" },
    { name: "Logos", href: "/workshop/base-de-datos/logos", icon: Image, feature: "logos-database" },
    { name: "Usuarios", href: "/workshop/base-de-datos/usuarios", icon: Users, feature: "users-management" },
    
    // OPERACIONES
    { name: "RFQs", href: "/workshop/operaciones/rfq", icon: ClipboardList, feature: "advanced-rfq" },
    { name: "Nuevo RFQ", href: "/workshop/operaciones/rfq/nuevo", icon: PlusSquare, feature: "new-rfq" },
    { name: "Cotizaciones", href: "/workshop/operaciones/cotizaciones", icon: FileSpreadsheet, feature: "quote-management" },
    { name: "Órdenes", href: "/workshop/operaciones/ordenes", icon: PackageSearch, feature: "order-tracking" },
    { name: "Tareas", href: "/workshop/operaciones/tareas", icon: CheckSquare, feature: "tasks-management" },
    
    // COMUNICACIÓN
    { name: "WhatsApp + IA", href: "/workshop/comunicacion/whatsapp-ia", icon: MessagesSquare, feature: "whatsappIntegration" },
    
    // PROPUESTAS
    { name: "Propuestas", href: "/workshop/propuestas", icon: FileSignature, feature: "proposals-management" },
    { name: "Nueva Propuesta", href: "/workshop/propuestas/nueva", icon: Sparkles, feature: "proposalEditor" },
    
    // HERRAMIENTAS
    { name: "Editor Visual", href: "/workshop/herramientas/editor-visual/select-product", icon: PenTool, feature: "visual-editor" },
    { name: "Generador PDFs", href: "/workshop/herramientas/generador-pdfs", icon: FileDown, feature: "pdf-generator" },
    
    // ANÁLISIS Y REPORTES
    { name: "Analytics", href: "/workshop/analisis-reportes/analytics", icon: BarChart3, feature: "analytics-basic" },
    { name: "Reportes", href: "/workshop/analisis-reportes/reportes", icon: FileBarChart, feature: "reports-management" },
    { name: "Envío y Tracking", href: "/workshop/analisis-reportes/envio-tracking", icon: Truck, feature: "shipping-tracking" },
    
    // WEBSITE
    { name: "Páginas", href: "/workshop/website/pages", icon: Globe, feature: "landingEditable" },
    
    // CONFIGURACIÓN
    { name: "Branding", href: "/workshop/settings/branding", icon: Palette, feature: "custom-branding" },
    { name: "Usuarios", href: "/workshop/settings/usuarios", icon: UserCog, feature: "users-management" },
    { name: "Planes y Features", href: "/workshop/settings/planes-y-features", icon: BadgeCheck, feature: "advanced-settings" },
    { name: "Avanzados", href: "/workshop/settings/avanzados", icon: Settings2, feature: "advanced-settings" },
  ],
  provider: [
    { name: "Dashboard", href: "/proveedor", icon: Home, feature: "dashboard-overview" },
    { name: "Inventario", href: "/proveedor/inventory", icon: Package, feature: "basic-inventory" },
    { name: "Inventario Avanzado", href: "/proveedor/inventory-advanced", icon: Package2, feature: "advanced-inventory" },
    { name: "RFQs Recibidos", href: "/proveedor/rfqs", icon: FileText, feature: "basic-rfq" },
    { name: "Cotizaciones", href: "/proveedor/quotes", icon: Calculator, feature: "quote-management" },
    { name: "Órdenes", href: "/proveedor/orders", icon: ShoppingCart, feature: "order-tracking" },
    { name: "Analytics", href: "/proveedor/analytics", icon: BarChart3, feature: "analytics-basic" },
    { name: "Branding", href: "/proveedor/branding", icon: Palette, feature: "custom-branding" },
    { name: "Mi Sitio", href: "/proveedor/website", icon: Building2, feature: "custom-branding" },
  ],
}

export function Sidebar({ role, orgName = "Mi Organización", plan = "free" }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { hasFeatureSync } = useFeatureFlags()

  // Auto-close mobile menu after 1 second when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      const timer = setTimeout(() => {
        setIsMobileMenuOpen(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [pathname, isMobileMenuOpen])

  // Filter navigation based on available features
  const currentNavigation = navigationItems[role].filter(item => {
    // Always show dashboard
    if (item.feature === "dashboard-overview") return true
    
    // Check if user has access to the feature
    return hasFeatureSync(item.feature)
  })

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-background/95 backdrop-blur shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">MerchConnect</h1>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium truncate">{orgName}</p>
                <Badge variant="secondary" className="text-xs">
                  {plan}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Organización</DropdownMenuLabel>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuItem>Cambiar plan</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Salir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Navigation - Fixed height, no scroll */}
          <nav className="flex-1 p-4 space-y-1">
            {currentNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <FeatureGate key={item.name} feature={item.feature}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </FeatureGate>
              )
            })}
          </nav>

          {/* Footer - Fixed at bottom */}
          <div className="p-4 border-t space-y-2 bg-background">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Bell className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Notificaciones</span>
              <Badge variant="destructive" className="ml-auto text-xs flex-shrink-0">
                3
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Ayuda</span>
            </div>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
