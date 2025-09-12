export default function WorkshopPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portal de Talleres</h1>
          <p className="text-gray-600">Encuentra proveedores y gestiona tus proyectos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Proyectos</h3>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-green-600">3 activos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Proveedores</h3>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-blue-600">Favoritos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Presupuesto</h3>
            <p className="text-2xl font-bold">$15,600</p>
            <p className="text-xs text-green-600">Este mes</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Ahorro</h3>
            <p className="text-2xl font-bold">$2,340</p>
            <p className="text-xs text-green-600">Comparando precios</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos Recientes</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-medium">Camisetas para evento corporativo</p>
                <p className="text-xs text-gray-500">En progreso - 3 proveedores cotizando</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm font-medium">Tazas promocionales</p>
                <p className="text-xs text-gray-500">Completado - 200 unidades</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                + Nuevo Proyecto
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Buscar Proveedores
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Ver Cotizaciones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}