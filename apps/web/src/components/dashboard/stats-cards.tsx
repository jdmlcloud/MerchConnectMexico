'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, TrendingUp, DollarSign } from 'lucide-react';

const stats = [
  {
    title: 'Total Usuarios',
    value: '1,234',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Documentos',
    value: '456',
    change: '+8%',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    title: 'Crecimiento',
    value: '23%',
    change: '+5%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
  {
    title: 'Ingresos',
    value: '$12,345',
    change: '-2%',
    changeType: 'negative' as const,
    icon: DollarSign,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}