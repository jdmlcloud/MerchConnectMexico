"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { FeatureGate } from "@/hooks/use-feature-flags"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  FileText,
  CreditCard,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Upload,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

export default function ProviderPage() {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar role="provider" orgName="Forpromo Solutions" plan="premium" />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title="Dashboard Proveedor" 
          subtitle="Gestiona tu inventario, RFQs y cotizaciones"
        />
        
        <main className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="rfqs">RFQs Recibidos</TabsTrigger>
              <TabsTrigger value="quotes">Mis Cotizaciones</TabsTrigger>
              <TabsTrigger value="orders">Órdenes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <StatsCards role="provider" />

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <RecentActivity role="provider" />
                </div>

                {/* Quick Actions */}
                <div>
                  <QuickActions role="provider" />
                </div>
              </div>

              {/* RFQs Pendientes */}
              <Card>
                <CardHeader>
                  <CardTitle>RFQs Pendientes</CardTitle>
                  <CardDescription>
                    Solicitudes de cotización que requieren tu atención
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Camisetas para evento corporativo</h3>
                          <p className="text-sm text-muted-foreground">
                            OnPoint Workshop • 1000 unidades • Vence en 3 días
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">Urgente</Badge>
                        <Button size="sm">Cotizar</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Tazas personalizadas</h3>
                          <p className="text-sm text-muted-foreground">
                            TechCorp • 500 unidades • Vence en 5 días
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Pendiente</Badge>
                        <Button size="sm">Cotizar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <FeatureGate feature="basic-inventory">
                <Card>
                  <CardHeader>
                    <CardTitle>Mi Inventario</CardTitle>
                    <CardDescription>
                      Gestiona tus productos y precios
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar productos..." className="max-w-sm" />
                    <Button>Buscar</Button>
                    <Button variant="outline">Filtrar</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="ml-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Producto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                          <DialogDescription>
                            Añade un producto a tu inventario
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Nombre del Producto</Label>
                              <Input id="name" placeholder="Ej: Camisetas 100% Algodón" />
                            </div>
                            <div>
                              <Label htmlFor="sku">SKU</Label>
                              <Input id="sku" placeholder="TSH-001" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea 
                              id="description" 
                              placeholder="Describe el producto..."
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="stock">Stock</Label>
                              <Input id="stock" type="number" placeholder="100" />
                            </div>
                            <div>
                              <Label htmlFor="basePrice">Precio Base</Label>
                              <Input id="basePrice" type="number" placeholder="5.50" />
                            </div>
                            <div>
                              <Label htmlFor="leadTime">Tiempo de Entrega (días)</Label>
                              <Input id="leadTime" type="number" placeholder="7" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="image">Imagen del Producto</Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Arrastra una imagen aquí o haz clic para seleccionar
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Agregar Producto</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Precio Base</TableHead>
                        <TableHead>Lead Time</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">Camisetas 100% Algodón</p>
                              <p className="text-sm text-muted-foreground">Premium quality</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>TSH-001</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>500</span>
                            <Badge variant="secondary">Disponible</Badge>
                          </div>
                        </TableCell>
                        <TableCell>$5.50</TableCell>
                        <TableCell>7 días</TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">Tazas Cerámicas</p>
                              <p className="text-sm text-muted-foreground">Para sublimación</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>MUG-001</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>200</span>
                            <Badge variant="destructive">Stock Bajo</Badge>
                          </div>
                        </TableCell>
                        <TableCell>$3.20</TableCell>
                        <TableCell>5 días</TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                </Card>
              </FeatureGate>
            </TabsContent>

            <TabsContent value="rfqs" className="space-y-6">
              <FeatureGate feature="basic-rfq">
                <Card>
                  <CardHeader>
                    <CardTitle>RFQs Recibidos</CardTitle>
                    <CardDescription>
                      Solicitudes de cotización de talleres
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* RFQ 1 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Camisetas para evento corporativo</h3>
                          <p className="text-sm text-muted-foreground">
                            OnPoint Workshop • 1000 unidades • Presupuesto: $5,000
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">Urgente</Badge>
                          <Badge variant="outline">Vence en 3 días</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm">
                          Necesitamos 1000 camisetas de algodón con logo bordado para evento corporativo. 
                          Colores: azul marino, blanco y gris. Tallas: S, M, L, XL.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Cantidad:</span> 1000 unidades
                          </div>
                          <div>
                            <span className="font-medium">Presupuesto:</span> $5,000
                          </div>
                          <div>
                            <span className="font-medium">Fecha límite:</span> 20 Dic 2024
                          </div>
                          <div>
                            <span className="font-medium">Categoría:</span> Textiles
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Ver detalles</Button>
                          <Button>Enviar Cotización</Button>
                        </div>
                      </div>
                    </div>

                    {/* RFQ 2 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Tazas personalizadas</h3>
                          <p className="text-sm text-muted-foreground">
                            TechCorp • 500 unidades • Presupuesto: $2,500
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Normal</Badge>
                          <Badge variant="outline">Vence en 5 días</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm">
                          Tazas de cerámica blanca para sublimación. Diseño personalizado con logo de empresa.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Cantidad:</span> 500 unidades
                          </div>
                          <div>
                            <span className="font-medium">Presupuesto:</span> $2,500
                          </div>
                          <div>
                            <span className="font-medium">Fecha límite:</span> 22 Dic 2024
                          </div>
                          <div>
                            <span className="font-medium">Categoría:</span> Promocionales
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Ver detalles</Button>
                          <Button>Enviar Cotización</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </FeatureGate>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <FeatureGate feature="quote-management">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Cotizaciones</CardTitle>
                    <CardDescription>
                      Cotizaciones enviadas y su estado
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RFQ</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Lead Time</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Tazas personalizadas</TableCell>
                        <TableCell>OnPoint Workshop</TableCell>
                        <TableCell>$2,100</TableCell>
                        <TableCell>5 días</TableCell>
                        <TableCell>
                          <Badge variant="default">Aceptada</Badge>
                        </TableCell>
                        <TableCell>15 Dic</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Ver</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Camisetas evento</TableCell>
                        <TableCell>TechCorp</TableCell>
                        <TableCell>$4,500</TableCell>
                        <TableCell>7 días</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pendiente</Badge>
                        </TableCell>
                        <TableCell>18 Dic</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Material promocional</TableCell>
                        <TableCell>Design Studio</TableCell>
                        <TableCell>$1,800</TableCell>
                        <TableCell>10 días</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Rechazada</Badge>
                        </TableCell>
                        <TableCell>12 Dic</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Ver</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                </Card>
              </FeatureGate>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <FeatureGate feature="order-tracking">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Órdenes</CardTitle>
                    <CardDescription>
                      Órdenes recibidas y su estado de producción
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Orden en producción */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Orden #1235 - Tazas personalizadas</h3>
                          <p className="text-sm text-muted-foreground">
                            OnPoint Workshop • 500 unidades • $2,100
                          </p>
                        </div>
                        <Badge variant="secondary">En Producción</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Progreso de producción</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Confirmada</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>En Producción</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span>Pendiente</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <p className="font-medium">Entrega estimada: 25 de Diciembre</p>
                            <p className="text-sm text-muted-foreground">
                              Tiempo restante: 3 días
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Actualizar estado</Button>
                        </div>
                      </div>
                    </div>

                    {/* Orden completada */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Orden #1234 - Camisetas corporativas</h3>
                          <p className="text-sm text-muted-foreground">
                            Creative Agency • 1000 unidades • $4,500
                          </p>
                        </div>
                        <Badge variant="default">Entregada</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="font-medium">Entregada el 15 de Diciembre</p>
                          <p className="text-sm text-muted-foreground">
                            Cliente satisfecho • Calificación: 5/5
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Ver detalles</Button>
                          <Button variant="outline" size="sm">Reordenar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </FeatureGate>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}