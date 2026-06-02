import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordCorrect =
          await bcrypt.compare(
            credentials.password as string,
            user.password
          );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});