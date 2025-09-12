export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Gestiona organizaciones, usuarios y configuración del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Usuarios</h3>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-xs text-green-600">+12% desde el mes pasado</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Organizaciones</h3>
            <p className="text-2xl font-bold">45</p>
            <p className="text-xs text-green-600">+8% desde el mes pasado</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Ingresos</h3>
            <p className="text-2xl font-bold">$12,345</p>
            <p className="text-xs text-red-600">-2% desde el mes pasado</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Crecimiento</h3>
            <p className="text-2xl font-bold">23%</p>
            <p className="text-xs text-green-600">+5% desde el mes pasado</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Juan Pérez creó un nuevo documento</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">María García actualizó su perfil</p>
                  <p className="text-xs text-gray-500">Hace 4 horas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                + Nuevo Usuario
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                + Nueva Organización
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Gestionar Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}