import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, LayoutDashboard } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="QBIX Logo"
            width={180}
            height={120}
            priority
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="text-2xl font-bold">404</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you are looking for doesn't exist or may have been moved.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-blue-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Return to Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Account Settings
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} QBIX RevenueTrack. All rights reserved.
        </p>
      </div>
    </main>
  )
}
