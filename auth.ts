import NextAuth from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { dbConnect, User } from '@/lib/mongo';

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      await dbConnect();
      const email = (credentials.email as string).toLowerCase().trim();
      const user = await User.findOne({ email }).select('+password');

      if (!user || !user.password) return null;

      const valid = await bcrypt.compare(credentials.password as string, user.password);
      if (!valid) return null;

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || undefined,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/creator/login',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        await dbConnect();
        const email = user.email.toLowerCase();
        const existing = await User.findOne({ email });

        if (!existing) {
          await User.create({
            name: user.name || 'Creator',
            email,
            emailVerified: new Date(),
            image: user.image || undefined,
          });
        } else if (!existing.emailVerified) {
          existing.emailVerified = new Date();
          if (user.image) existing.image = user.image;
          await existing.save();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // Refresh custom profile fields from DB
      if (token.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.emailVerified = Boolean(dbUser.emailVerified);
            token.niche = dbUser.niche || null;
            token.role = (dbUser.role as string) || 'creator';
          }
        } catch {
          // keep stale token values
        }
      }
      return token;
    },

    async session({ session, token }) {
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
});
