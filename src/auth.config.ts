import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"

import type { NextAuthConfig } from "next-auth"
import { loginSchema } from './lib/schemas/loginSchema'
import { getUserByEmail } from './app/actions/authActions';
import { compare } from 'bcryptjs';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      name: 'credentials',
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds);

        if (validated.success) {
          const { email, password } = validated.data;

          const user = await getUserByEmail(email);

          if (!user || !user.passwordHash || !(await compare(password, user.passwordHash))) return null;

          return user;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig