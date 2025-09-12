export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Features</h1>
          <p className="text-gray-600">Controla qué funcionalidades están disponibles para cada plan</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Features Disponibles</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Generador de Propuestas</h3>
                  <p className="text-sm text-gray-600">Permite crear propuestas automáticas</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Pro+</span>
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Activo
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Analytics Avanzado</h3>
                  <p className="text-sm text-gray-600">Reportes detallados y métricas</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Premium+</span>
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Activo
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Integración WhatsApp</h3>
                  <p className="text-sm text-gray-600">Comunicación automática por WhatsApp</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Enterprise</span>
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    Beta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}