'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Settings } from 'lucide-react';

const actions = [
  {
    title: 'Nuevo Usuario',
    description: 'Agregar un nuevo usuario al sistema',
    icon: Plus,
    href: '/admin/users/new',
  },
  {
    title: 'Crear Documento',
    description: 'Generar un nuevo documento',
    icon: FileText,
    href: '/admin/documents/new',
  },
  {
    title: 'Gestionar Usuarios',
    description: 'Ver y editar usuarios existentes',
    icon: Users,
    href: '/admin/users',
  },
  {
    title: 'Configuración',
    description: 'Ajustar configuraciones del sistema',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <a href={action.href}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-gray-500 text-left">
                    {action.description}
                  </p>
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}