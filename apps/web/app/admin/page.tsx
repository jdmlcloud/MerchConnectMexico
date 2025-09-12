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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSession } from "next-auth/react"
import { Building2, Users, TrendingUp, DollarSign, Settings, Wrench } from "lucide-react"
import { FeatureGate } from "@/hooks/use-feature-flags"

export default function AdminPage() {
  const { data: session } = useSession()

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar role="admin" orgName="MerchConnect Admin" plan="enterprise" />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title="Dashboard Admin" 
          subtitle="Gestiona organizaciones, usuarios y configuración del sistema"
        />
        
        <main className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
          {/* Session Debug Info - Solo en desarrollo */}
          {process.env.NODE_ENV === 'development' && session && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Session Info (Debug)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="organizations">Organizaciones</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <StatsCards role="admin" />

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <RecentActivity role="admin" />
                </div>

                {/* Quick Actions */}
                <div>
                  <QuickActions role="admin" />
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversión</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.5%</div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% vs mes anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2 días</div>
                    <p className="text-xs text-muted-foreground">
                      Tiempo de respuesta
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8/5</div>
                    <p className="text-xs text-muted-foreground">
                      Basado en 156 reseñas
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Comisión</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,261</div>
                    <p className="text-xs text-muted-foreground">
                      Este mes (5% comisión)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="organizations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar Organizaciones</CardTitle>
                  <CardDescription>
                    Administra todas las organizaciones registradas en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar organizaciones..." className="max-w-sm" />
                    <Button>Buscar</Button>
                    <Button variant="outline">Filtrar</Button>
                    <Button className="ml-auto">+ Nueva Organización</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Usuarios</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Última Actividad</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">OnPoint Workshop</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Workshop</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Pro</Badge>
                        </TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell>Hace 2 horas</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Forpromo Solutions</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Provider</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Premium</Badge>
                        </TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell>Hace 1 hora</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TechCorp</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Workshop</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Free</Badge>
                        </TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Suspendido</Badge>
                        </TableCell>
                        <TableCell>Hace 3 días</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar Usuarios</CardTitle>
                  <CardDescription>
                    Administra usuarios y permisos del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar usuarios..." className="max-w-sm" />
                    <Button>Buscar</Button>
                    <Button variant="outline">Filtrar</Button>
                    <Button className="ml-auto">+ Invitar Usuario</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Organización</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Admin OnPoint</TableCell>
                        <TableCell>admin@onpoint.com</TableCell>
                        <TableCell>OnPoint Workshop</TableCell>
                        <TableCell>
                          <Badge variant="default">Admin</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell>Hace 30 min</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Admin Forpromo</TableCell>
                        <TableCell>admin@forpromo.com</TableCell>
                        <TableCell>Forpromo Solutions</TableCell>
                        <TableCell>
                          <Badge variant="default">Admin</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell>Hace 1 hora</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Juan Pérez</TableCell>
                        <TableCell>juan@techcorp.com</TableCell>
                        <TableCell>TechCorp</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Usuario</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">Suspendido</Badge>
                        </TableCell>
                        <TableCell>Hace 3 días</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <FeatureGate feature="multi-tenant-management">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wrench className="h-5 w-5" />
                      <span>Gestión de Features</span>
                    </CardTitle>
                    <CardDescription>
                      Controla qué funcionalidades están disponibles para cada plan y organización
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <p className="text-sm text-muted-foreground">Features Activos</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">4</div>
                          <p className="text-sm text-muted-foreground">Planes Configurados</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">3</div>
                          <p className="text-sm text-muted-foreground">Overrides Activos</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Features Recientes</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <Settings className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Generador de Propuestas</span>
                              <Badge variant="outline" className="text-xs">Custom</Badge>
                            </div>
                            <Badge variant="secondary">Pro+</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Analytics Avanzado</span>
                              <Badge variant="outline" className="text-xs">Premium</Badge>
                            </div>
                            <Badge variant="secondary">Premium+</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full" asChild>
                          <a href="/admin/features">
                            <Settings className="h-4 w-4 mr-2" />
                            Gestionar Features
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FeatureGate>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Crecimiento de Usuarios</CardTitle>
                    <CardDescription>
                      Nuevos usuarios registrados por mes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Gráfico de usuarios</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos por Mes</CardTitle>
                    <CardDescription>
                      Comisiones generadas por la plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Gráfico de ingresos</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Rendimiento</CardTitle>
                  <CardDescription>
                    KPIs principales del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">98.5%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">2.3s</div>
                      <p className="text-sm text-muted-foreground">Tiempo de respuesta</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">99.9%</div>
                      <p className="text-sm text-muted-foreground">Disponibilidad</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}