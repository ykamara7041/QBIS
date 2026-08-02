import type { NextAuthConfig } from "next-auth"

function getSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET
  if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required in production")
  }
  return "fallback-dev-secret-do-not-use-in-production"
}

export const authConfig = {
  secret: getSecret(),
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
