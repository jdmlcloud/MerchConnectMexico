import NextAuth, { type NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import Credentials from 'next-auth/providers/credentials';

const stage = (process.env.NEXT_PUBLIC_STAGE as 'dev' | 'sbx' | 'prod') || 'dev';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(stage === 'dev'
      ? [
          Credentials({
            name: 'Dev Login',
            credentials: {
              email: { label: 'Email', type: 'email' },
              orgId: { label: 'OrgId', type: 'text' },
              orgType: { label: 'OrgType', type: 'text', value: 'provider' },
            },
            async authorize(credentials) {
              const email = credentials?.email as string;
              const orgId = (credentials?.orgId as string) || 'demo-org';
              const orgType = (credentials?.orgType as string) || 'provider';
              if (!email) return null;
              return {
                id: email,
                email,
                name: email.split('@')[0],
                orgId,
                orgType,
              } as any;
            },
          }),
        ]
      : []),
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || 'missing',
      clientSecret: '',
      issuer: `https://cognito-idp.${process.env.AWS_REGION ?? 'us-east-1'}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID || 'missing'}`,
      checks: ['pkce', 'state'],
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user }) {
      token.stage = stage;
      token.orgId = (token.orgId as string) || (user as any)?.orgId || 'demo-org';
      token.orgType = (token.orgType as string) || (user as any)?.orgType || 'provider';
      token.plan = token.plan || 'pro';
      token.features = token.features || [];
      token.roles = token.roles || ['admin'];
      token.perms = token.perms || ['*'];
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
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-only',
};

export const { auth } = NextAuth(authOptions);
