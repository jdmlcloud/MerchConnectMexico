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
  FileText,
  CreditCard,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react"

export default function WorkshopPage() {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar role="workshop" orgName="OnPoint Workshop" plan="pro" />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title="Dashboard Workshop" 
          subtitle="Gestiona tus RFQs, cotizaciones y órdenes"
        />
        
        <main className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="rfqs">Mis RFQs</TabsTrigger>
              <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
              <TabsTrigger value="orders">Órdenes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <StatsCards role="workshop" />

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <RecentActivity role="workshop" />
                </div>

                {/* Quick Actions */}
                <div>
                  <QuickActions role="workshop" />
                </div>
              </div>

              {/* RFQs en Progreso */}
              <Card>
                <CardHeader>
                  <CardTitle>RFQs en Progreso</CardTitle>
                  <CardDescription>
                    Tus solicitudes de cotización activas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Camisetas para evento corporativo</h3>
                          <p className="text-sm text-muted-foreground">
                            1000 unidades • Vence en 5 días
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">3 cotizaciones</Badge>
                        <Button variant="outline" size="sm">Ver detalles</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Tazas personalizadas</h3>
                          <p className="text-sm text-muted-foreground">
                            500 unidades • Completado
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Ordenada</Badge>
                        <Button variant="outline" size="sm">Ver orden</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rfqs" className="space-y-6">
              <FeatureGate feature="basic-rfq">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis RFQs</CardTitle>
                    <CardDescription>
                      Gestiona tus solicitudes de cotización
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar RFQs..." className="max-w-sm" />
                    <Button>Buscar</Button>
                    <Button variant="outline">Filtrar</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="ml-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo RFQ
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Crear Nuevo RFQ</DialogTitle>
                          <DialogDescription>
                            Solicita cotizaciones para tus productos
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="title">Título del RFQ</Label>
                              <Input id="title" placeholder="Ej: Camisetas para evento" />
                            </div>
                            <div>
                              <Label htmlFor="category">Categoría</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="textiles">Textiles</SelectItem>
                                  <SelectItem value="promocionales">Promocionales</SelectItem>
                                  <SelectItem value="oficina">Oficina</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea 
                              id="description" 
                              placeholder="Describe los productos que necesitas..."
                              rows={4}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="quantity">Cantidad</Label>
                              <Input id="quantity" type="number" placeholder="1000" />
                            </div>
                            <div>
                              <Label htmlFor="budget">Presupuesto</Label>
                              <Input id="budget" type="number" placeholder="5000" />
                            </div>
                            <div>
                              <Label htmlFor="deadline">Fecha límite</Label>
                              <Input id="deadline" type="date" />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Crear RFQ</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Presupuesto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Cotizaciones</TableHead>
                        <TableHead>Vence</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Camisetas para evento</TableCell>
                        <TableCell>Textiles</TableCell>
                        <TableCell>1000</TableCell>
                        <TableCell>$5,000</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Activo</Badge>
                        </TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>5 días</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Ver</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Tazas personalizadas</TableCell>
                        <TableCell>Promocionales</TableCell>
                        <TableCell>500</TableCell>
                        <TableCell>$2,500</TableCell>
                        <TableCell>
                          <Badge variant="default">Completado</Badge>
                        </TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>-</TableCell>
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

            <TabsContent value="quotes" className="space-y-6">
              <FeatureGate feature="quote-management">
                <Card>
                  <CardHeader>
                    <CardTitle>Cotizaciones Recibidas</CardTitle>
                    <CardDescription>
                      Compara y gestiona las cotizaciones de proveedores
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* RFQ con cotizaciones */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Camisetas para evento</h3>
                          <p className="text-sm text-muted-foreground">
                            1000 unidades • Presupuesto: $5,000
                          </p>
                        </div>
                        <Badge variant="secondary">3 cotizaciones</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Cotización 1 */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Forpromo Solutions</p>
                              <p className="text-sm text-muted-foreground">
                                Tiempo de entrega: 7 días
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="font-bold text-green-600">$4,500</p>
                              <p className="text-xs text-muted-foreground">Ahorro: $500</p>
                            </div>
                            <Button size="sm">Aceptar</Button>
                          </div>
                        </div>

                        {/* Cotización 2 */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">PromoMax</p>
                              <p className="text-sm text-muted-foreground">
                                Tiempo de entrega: 5 días
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="font-bold">$4,800</p>
                              <p className="text-xs text-muted-foreground">Ahorro: $200</p>
                            </div>
                            <Button size="sm">Aceptar</Button>
                          </div>
                        </div>

                        {/* Cotización 3 */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Design Studio</p>
                              <p className="text-sm text-muted-foreground">
                                Tiempo de entrega: 10 días
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="font-bold">$5,200</p>
                              <p className="text-xs text-muted-foreground">+$200</p>
                            </div>
                            <Button size="sm">Aceptar</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      Gestiona tus órdenes activas y completadas
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Orden activa */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Orden #1234 - Camisetas para evento</h3>
                          <p className="text-sm text-muted-foreground">
                            Forpromo Solutions • 1000 unidades
                          </p>
                        </div>
                        <Badge variant="secondary">En Producción</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Progreso de producción</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        
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
                            <p className="font-medium">Total: $4,500</p>
                            <p className="text-sm text-muted-foreground">
                              Entrega estimada: 15 de Diciembre
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Ver detalles</Button>
                        </div>
                      </div>
                    </div>

                    {/* Orden completada */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Orden #1233 - Tazas personalizadas</h3>
                          <p className="text-sm text-muted-foreground">
                            PromoMax • 500 unidades
                          </p>
                        </div>
                        <Badge variant="default">Entregada</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="font-medium">Total: $2,100</p>
                          <p className="text-sm text-muted-foreground">
                            Entregada el 10 de Diciembre
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