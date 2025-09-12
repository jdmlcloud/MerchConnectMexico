import { DashboardLayout } from "../../../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card"
import { Button } from "../../../../src/components/ui/button"
import { Sparkles, FileSignature } from "lucide-react"

export default function NuevaPropuestaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Propuesta</h1>
            <p className="text-gray-600">Crea una nueva propuesta personalizada</p>
          </div>
          <Button>
            <FileSignature className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editor de Propuestas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Sparkles className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Feature Deshabilitada</h3>
              <p className="mt-1 text-sm text-gray-500">El editor de propuestas está deshabilitado por el administrador.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
