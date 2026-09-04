import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from '@/auth.config';
import { dbConnect, User } from '@/lib/mongo';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
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

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

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
  },
});
