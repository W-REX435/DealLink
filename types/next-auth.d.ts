import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'creator' | 'business' | 'admin';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    emailVerified?: boolean;
    niche?: string | null;
    role?: string;
  }
}
