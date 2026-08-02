import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  debug: true,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
} satisfies NextAuthConfig
