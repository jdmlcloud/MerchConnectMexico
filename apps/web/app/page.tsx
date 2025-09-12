export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MerchConnect México
        </h1>
        <p className="text-gray-600 mb-8">
          Marketplace B2B para talleres y proveedores de merchandise
        </p>
        <div className="space-y-4">
          <a 
            href="/admin" 
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Panel de Administración
          </a>
          <a 
            href="/workshop" 
            className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Portal de Talleres
          </a>
          <a 
            href="/proveedor" 
            className="block w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Portal de Proveedores
          </a>
        </div>
      </div>
    </div>
  )
}