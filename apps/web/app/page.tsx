'use client';

import { useSession } from 'next-auth/react';
import { LoginForm } from '@/components/login-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-6">Cargando...</div>;
  }

  if (!session) {
    return (
      <main className="p-6 flex items-center justify-center min-h-screen">
        <LoginForm />
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-mc-deep-navy">MerchConnect México</h1>
        <p className="text-mc-deep-navy/70 mt-2">MVP multi-tenant B2B</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
              <CardDescription>Gestión de organizaciones y planes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin">Ir a Admin</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workshop</CardTitle>
              <CardDescription>RFQs y gestión de órdenes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/workshop">Ir a Workshop</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proveedor</CardTitle>
              <CardDescription>Inventario y cotizaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/proveedor">Ir a Proveedor</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Demo Site</CardTitle>
              <CardDescription>Landing pública de organización</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <a href="/site/onpoint/home">Ver Site Demo</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
