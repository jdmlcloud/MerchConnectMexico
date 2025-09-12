"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Package,
  Users,
  Award,
  MessageCircle,
} from "lucide-react"

interface PublicPageProps {
  params: {
    orgSlug: string
    slug: string
  }
}

export default function PublicPage({ params }: PublicPageProps) {
  const { orgSlug, slug } = params

  // Datos de ejemplo basados en el orgSlug
  const getOrgData = (slug: string) => {
    switch (slug) {
      case "onpoint":
        return {
          name: "OnPoint Workshop",
          type: "workshop",
          description: "Especialistas en merchandise personalizado para empresas",
          services: [
            "Camisetas personalizadas",
            "Tazas con logo",
            "Material promocional",
            "Diseño gráfico"
          ],
          contact: {
            email: "admin@onpoint.com",
            phone: "+52 55 1234 5678",
            address: "Av. Insurgentes Sur 123, CDMX"
          },
          rating: 4.8,
          reviews: 156,
          established: "2020"
        }
      case "forpromo":
        return {
          name: "Forpromo Solutions",
          type: "provider",
          description: "Proveedor líder en merchandise personalizado",
          services: [
            "Productos textiles",
            "Artículos promocionales",
            "Servicios de impresión",
            "Tiempos de entrega rápidos"
          ],
          contact: {
            email: "admin@forpromo.com",
            phone: "+52 55 9876 5432",
            address: "Calle Reforma 456, CDMX"
          },
          rating: 4.9,
          reviews: 234,
          established: "2018"
        }
      default:
        return {
          name: "Organización Demo",
          type: "workshop",
          description: "Descripción de la organización",
          services: ["Servicio 1", "Servicio 2"],
          contact: {
            email: "contact@demo.com",
            phone: "+52 55 0000 0000",
            address: "Dirección demo"
          },
          rating: 4.5,
          reviews: 50,
          established: "2023"
        }
    }
  }

  const orgData = getOrgData(orgSlug)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{orgData.name}</h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {orgData.type === "workshop" ? "Taller" : "Proveedor"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{orgData.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({orgData.reviews} reseñas)
                </span>
              </div>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">{orgData.name}</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            {orgData.description}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>Establecido en {orgData.established}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{orgData.reviews}+ clientes satisfechos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>Productos de calidad</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <h3 className="text-2xl font-bold text-center mb-8">Nuestros Servicios</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {orgData.services.map((service, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Servicio profesional con garantía de calidad
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-muted/30 rounded-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">¿Por qué elegirnos?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos soluciones completas para todas tus necesidades de merchandise
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Calidad Garantizada</h4>
              <p className="text-muted-foreground">
                Todos nuestros productos pasan por estrictos controles de calidad
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Entrega Rápida</h4>
              <p className="text-muted-foreground">
                Tiempos de entrega optimizados para satisfacer tus necesidades
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Satisfacción del Cliente</h4>
              <p className="text-muted-foreground">
                {orgData.rating}/5 estrellas basado en {orgData.reviews} reseñas
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contáctanos</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{orgData.contact.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{orgData.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{orgData.contact.address}</span>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un mensaje</CardTitle>
                <CardDescription>
                  Estaremos encantados de ayudarte con tu proyecto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
                </div>
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Cuéntanos sobre tu proyecto..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  Enviar mensaje
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center bg-primary text-primary-foreground rounded-lg">
          <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar tu proyecto?</h3>
          <p className="text-lg mb-6 opacity-90">
            Contáctanos hoy mismo y recibe una cotización personalizada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Solicitar cotización
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Phone className="h-5 w-5 mr-2" />
              Llamar ahora
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 {orgData.name}. Todos los derechos reservados.</p>
            <p className="mt-2">
              Powered by <span className="font-medium">MerchConnect México</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}