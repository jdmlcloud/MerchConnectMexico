import NextAuth, { type NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import { getEnv } from '@/lib/env';

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: '',
      issuer: `https://cognito-idp.${process.env.AWS_REGION ?? 'us-east-1'}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      checks: ['pkce', 'state'],
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Attach custom claims from token if present or keep existing
      const stage = process.env.NEXT_PUBLIC_STAGE as 'dev' | 'sbx' | 'prod';
      token.stage = stage;
      // NOTE: In a real flow, map orgId, orgType, plan, roles from your DB or IdP custom claims
      token.orgId = token.orgId ?? 'demo-org';
      token.orgType = token.orgType ?? 'provider';
      token.plan = token.plan ?? 'pro';
      token.features = token.features ?? [];
      token.roles = token.roles ?? ['admin'];
      token.perms = token.perms ?? ['*'];
      return token as any;
    },
    async session({ session, token }) {
      (session as any).claims = {
        stage: token.stage,
        orgId: token.orgId,
        orgType: token.orgType,
        plan: token.plan,
        features: token.features ?? [],
        roles: token.roles ?? [],
        perms: token.perms ?? [],
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { auth } = NextAuth(authOptions);
