import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const pathname = nextUrl.pathname
  const lowerPath = pathname.toLowerCase()

  const cookieHeader = req.headers.get("cookie") || ""
  const hasSessionInHeader = 
    cookieHeader.includes("qbix_session") ||
    cookieHeader.includes("session-token") || 
    cookieHeader.includes("authjs") || 
    cookieHeader.includes("next-auth")

  const sessionCookie =
    cookies.get("qbix_session") ||
    cookies.get("__Secure-authjs.session-token") ||
    cookies.get("authjs.session-token") ||
    cookies.get("__Secure-next-auth.session-token") ||
    cookies.get("next-auth.session-token") ||
    cookies.get("__Host-authjs.session-token")

  const isLoggedIn = !!sessionCookie?.value || hasSessionInHeader

  // Intercept profile/account/admin alias URLs and redirect straight to /dashboard/profile
  const isProfileAlias = 
    lowerPath === "/profile" || lowerPath.startsWith("/profile/") ||
    lowerPath === "/account" || lowerPath.startsWith("/account/") ||
    lowerPath === "/dashboard/account" || lowerPath.startsWith("/dashboard/account/") ||
    lowerPath === "/admin" || lowerPath.startsWith("/admin/") ||
    lowerPath === "/dashboard/admin" || lowerPath.startsWith("/dashboard/admin/") ||
    lowerPath === "/super-admin" || lowerPath.startsWith("/super-admin/") ||
    lowerPath === "/dashboard/super-admin" || lowerPath.startsWith("/dashboard/super-admin/") ||
    lowerPath === "/user" || lowerPath.startsWith("/user/") ||
    lowerPath === "/dashboard/user" || lowerPath.startsWith("/dashboard/user/")

  if (isProfileAlias) {
    return NextResponse.redirect(new URL("/dashboard/profile", nextUrl))
  }

  const isApiAuthRoute = pathname.startsWith("/api/auth")
  const isPublicRoute = pathname === "/"
  const isAuthRoute = pathname === "/login" || pathname === "/register"

  if (isApiAuthRoute || isAuthRoute) {
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
