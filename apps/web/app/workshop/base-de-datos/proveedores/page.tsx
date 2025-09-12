import { DashboardLayout } from "../../../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card"
import { Button } from "../../../../src/components/ui/button"
import { Factory, Plus, Search, Filter } from "lucide-react"

export default function ProveedoresPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Base de Datos - Proveedores</h1>
            <p className="text-gray-600">Gestiona tu base de datos de proveedores</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Proveedor
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Factory className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza agregando tu primer proveedor.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
