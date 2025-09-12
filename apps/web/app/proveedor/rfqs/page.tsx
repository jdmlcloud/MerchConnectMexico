import { DashboardLayout } from "../../../src/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card"
import { Button } from "../../../src/components/ui/button"
import { Badge } from "../../../src/components/ui/badge"
import { Search, Filter, Clock, DollarSign, Package } from "lucide-react"

const rfqs = [
  {
    id: "RFQ-001",
    title: "Cascos de Seguridad Industrial",
    company: "Taller Metalúrgico ABC",
    quantity: 500,
    deadline: "3 días",
    category: "Seguridad",
    budget: "$50,000 - $75,000",
    status: "active",
    description: "Necesitamos cascos de seguridad certificados para personal de taller metalúrgico. Deben cumplir con normativas OSHA.",
  },
  {
    id: "RFQ-002", 
    title: "Uniformes de Trabajo",
    company: "Construcciones XYZ",
    quantity: 200,
    deadline: "5 días",
    category: "Textiles",
    budget: "$15,000 - $25,000",
    status: "active",
    description: "Uniformes de trabajo resistentes para personal de construcción. Incluye camisas, pantalones y chalecos reflectantes.",
  },
  {
    id: "RFQ-003",
    title: "Herramientas Eléctricas",
    company: "Taller Automotriz 123",
    quantity: 100,
    deadline: "2 días",
    category: "Herramientas",
    budget: "$30,000 - $45,000",
    status: "urgent",
    description: "Set completo de herramientas eléctricas para taller automotriz. Incluye taladros, amoladoras, sierras circulares.",
  },
  {
    id: "RFQ-004",
    title: "Equipos de Protección Personal",
    company: "Minería del Norte",
    quantity: 1000,
    deadline: "7 días",
    category: "Seguridad",
    budget: "$100,000 - $150,000",
    status: "active",
    description: "EPP completo para personal minero: cascos, lentes, guantes, botas de seguridad y chalecos reflectantes.",
  },
]

export default function RfqsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">RFQs Disponibles</h1>
            <p className="text-gray-600">Explora oportunidades de negocio disponibles</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todas las categorías</option>
                  <option>Seguridad</option>
                  <option>Textiles</option>
                  <option>Herramientas</option>
                  <option>Equipos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presupuesto
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Cualquier presupuesto</option>
                  <option>Menos de $10,000</option>
                  <option>$10,000 - $50,000</option>
                  <option>$50,000 - $100,000</option>
                  <option>Más de $100,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Cualquier plazo</option>
                  <option>Menos de 3 días</option>
                  <option>3-7 días</option>
                  <option>1-2 semanas</option>
                  <option>Más de 2 semanas</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de RFQs */}
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <Card key={rfq.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{rfq.title}</h3>
                      <Badge 
                        variant={rfq.status === "urgent" ? "destructive" : "default"}
                      >
                        {rfq.status === "urgent" ? "Urgente" : "Activo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rfq.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{rfq.quantity} unidades</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Plazo: {rfq.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>{rfq.budget}</span>
                      </div>
                      <div className="text-gray-600">
                        Empresa: {rfq.company}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button>
                      Ver Detalles
                    </Button>
                    <Button variant="outline">
                      Enviar Cotización
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
