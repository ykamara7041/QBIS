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

  const pathname = nextUrl.pathname

  // Profile / Account / Admin URL aliases -> redirect to /dashboard/settings
  const profileAliases = ["/profile", "/dashboard/profile", "/account", "/dashboard/account", "/admin", "/dashboard/admin", "/user", "/dashboard/user"]
  if (profileAliases.includes(pathname.toLowerCase())) {
    return NextResponse.redirect(new URL("/dashboard/settings", nextUrl))
  }

  const isApiAuthRoute = pathname.startsWith("/api/auth")
  const isPublicRoute = pathname === "/"
  const isAuthRoute = pathname === "/login" || pathname === "/register"

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
