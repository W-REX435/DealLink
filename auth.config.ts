import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Edge-safe auth config — used by middleware.ts.
 * NO Node-only imports here (mongoose/bcrypt live in auth.ts only).
 */
export const authConfig = {
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'deallink-auth-fallback-secret-at-least-32-chars-long',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/creator/login',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'creator';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = ((token.role as string) || 'creator') as
          | 'creator'
          | 'business'
          | 'admin';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
