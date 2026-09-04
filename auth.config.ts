import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Edge-safe auth config — used by middleware.ts.
 * NO Node-only imports here (mongoose/bcrypt live in auth.ts only).
 */
export const authConfig = {
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
