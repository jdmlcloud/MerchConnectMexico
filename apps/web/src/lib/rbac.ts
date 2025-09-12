'use client';

import { ReactNode } from 'react';

type Claims = {
  stage: 'dev' | 'sbx' | 'prod';
  roles: string[];
  perms: string[];
  plan: 'free' | 'pro' | 'premium';
  features: string[];
};

export function hasRole(claims: Claims | undefined, role: string) {
  return !!claims?.roles?.includes(role);
}

export function hasPerm(claims: Claims | undefined, perm: string) {
  return !!claims?.perms?.includes(perm) || !!claims?.perms?.includes('*');
}

export function PlanGate({ claims, feature, children }: { claims?: Claims; feature: string; children: ReactNode }) {
  if (!claims) return null;
  if (claims.features?.includes(feature)) return children as ReactNode;
  if (claims.plan === 'pro' || claims.plan === 'premium') return children as ReactNode;
  return null;
}
