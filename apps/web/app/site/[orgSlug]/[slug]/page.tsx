export default function SitePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Página del Sitio
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Esta es una página de ejemplo para el sitio web de la organización.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contenido de la Página
          </h2>
          <p className="text-gray-600 mb-4">
            Aquí se mostraría el contenido específico de la página según la organización y el slug.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border">
              <h3 className="font-medium text-gray-900">Sección 1</h3>
              <p className="text-sm text-gray-600">Contenido de la primera sección</p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-medium text-gray-900">Sección 2</h3>
              <p className="text-sm text-gray-600">Contenido de la segunda sección</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}