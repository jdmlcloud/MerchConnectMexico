'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const activities = [
  {
    id: 1,
    user: 'Juan Pérez',
    action: 'Creó un nuevo documento',
    time: 'Hace 2 horas',
    type: 'document' as const,
  },
  {
    id: 2,
    user: 'María García',
    action: 'Actualizó su perfil',
    time: 'Hace 4 horas',
    type: 'profile' as const,
  },
  {
    id: 3,
    user: 'Carlos López',
    action: 'Subió una imagen',
    time: 'Hace 6 horas',
    type: 'upload' as const,
  },
  {
    id: 4,
    user: 'Ana Martínez',
    action: 'Completó un formulario',
    time: 'Hace 8 horas',
    type: 'form' as const,
  },
];

const typeColors = {
  document: 'bg-blue-100 text-blue-800',
  profile: 'bg-green-100 text-green-800',
  upload: 'bg-purple-100 text-purple-800',
  form: 'bg-orange-100 text-orange-800',
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Badge 
                  className={typeColors[activity.type]}
                  variant="secondary"
                >
                  {activity.type}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.action}
                </p>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-400">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}