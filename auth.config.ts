import type { NextAuthConfig } from "next-auth"

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "qbix_production_secret_key_2026_default_fallback"
}

const isProd = process.env.NODE_ENV === "production"

export const authConfig = {
  secret: getSecret(),
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
} satisfies NextAuthConfig
