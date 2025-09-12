'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const [email, setEmail] = useState('admin@demo.com');
  const [orgId, setOrgId] = useState('demo-org');
  const [orgType, setOrgType] = useState('provider');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', {
      email,
      orgId,
      orgType,
      callbackUrl: '/admin',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>MerchConnect Dev Login</CardTitle>
        <CardDescription>Credenciales de desarrollo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="orgId">Org ID</Label>
            <Input
              id="orgId"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="orgType">Tipo</Label>
            <Input
              id="orgType"
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
