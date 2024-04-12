import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { prisma } from './lib/prisma'

export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({user, token}) {
      if (user) {
        token.profileComplete = user.profileComplete;
      }
      return token;
    },
    async session({token, session}) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.profileComplete = token.profileComplete as boolean;
      }
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})