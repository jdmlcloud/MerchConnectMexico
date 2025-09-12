"use client"

import { DashboardLayout } from "../../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card"
import { Button } from "../../../src/components/ui/button"
import { Badge } from "../../../src/components/ui/badge"
import { Switch } from "../../../src/components/ui/switch"
import { useFeatureFlags } from "../../../src/hooks/use-feature-flags"
import { AVAILABLE_FEATURES } from "../../../src/lib/feature-flags"

export default function FeaturesPage() {
  const { featureFlags, updateFeatureFlag, loading } = useFeatureFlags()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando features...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Features</h1>
            <p className="text-gray-600">Habilita o deshabilita funcionalidades del workshop para diferentes planes y organizaciones.</p>
          </div>
          <Button>Agregar Nueva Feature</Button>
        </div>

        <div className="grid gap-6">
          {AVAILABLE_FEATURES.map((feature) => (
            <Card key={feature.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{feature.name}</span>
                      <Badge variant="outline">{feature.category}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  <Switch 
                    checked={featureFlags[feature.id] || false}
                    onCheckedChange={(enabled) => updateFeatureFlag(feature.id, enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Uso
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vista previa de navegación del workshop */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa - Navegación del Workshop</CardTitle>
            <p className="text-sm text-gray-600">Esta es la navegación que verán los usuarios del workshop basada en las features habilitadas.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AVAILABLE_FEATURES.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{feature.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({feature.category})</span>
                  </div>
                  <Badge variant={featureFlags[feature.id] ? "default" : "secondary"}>
                    {featureFlags[feature.id] ? "Habilitada" : "Deshabilitada"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}