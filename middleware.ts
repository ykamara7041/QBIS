import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req

  // Check both HTTPS secure and HTTP session token cookies across Auth.js and NextAuth naming
  const sessionCookie =
    cookies.get("__Secure-authjs.session-token") ||
    cookies.get("authjs.session-token") ||
    cookies.get("__Secure-next-auth.session-token") ||
    cookies.get("next-auth.session-token")

  const isLoggedIn = !!sessionCookie?.value

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/"
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"

  // Allow API auth routes and Auth pages (/login, /register) to always render directly
  if (isApiAuthRoute || isAuthRoute) {
    return NextResponse.next()
  }

  // Protect all dashboard routes: redirect to /login if not logged in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
