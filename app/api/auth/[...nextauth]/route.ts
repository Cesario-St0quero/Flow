import { prisma } from "@/prisma/db"; // ⚠️ Altere se seu prisma estiver em outro caminho
import { compare } from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // 🔗 Usa o PrismaAdapter para login via Google funcionar com ID numérico

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid || !user.active) return null;

        return user; // ⚠️ Retorna o objeto inteiro com id:number
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id; // 👈 Salva o id do banco no token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as number;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth",
  },
};

// 👇 Tipagem do session.user.id como number
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: number;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
