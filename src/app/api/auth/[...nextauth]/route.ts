import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@/lib/models/User';
import connectDB from '@/lib/db/mongodb';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Debug log
        console.log('User from DB:', {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Debug log
        console.log('Setting JWT token:', { userId: user.id, role: user.role });
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // Debug log
        console.log('Setting session:', { tokenId: token.id, role: token.role });
        session.user.id = token.id;
        session.user.role = token.role;
      }
      // Debug log
      console.log('Final session:', session);
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true // Enable debug logs in development
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };