import { DashboardLayout } from "../../../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card"
import { Button } from "../../../../src/components/ui/button"
import { MessagesSquare, Bot } from "lucide-react"

export default function WhatsAppIAPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp + IA</h1>
            <p className="text-gray-600">Integración con WhatsApp y asistente de IA</p>
          </div>
          <Button>
            <Bot className="mr-2 h-4 w-4" />
            Configurar IA
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la Integración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessagesSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Feature Deshabilitada</h3>
              <p className="mt-1 text-sm text-gray-500">Esta funcionalidad está deshabilitada por el administrador.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
