import RegisterForm from "./register-form"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Brand Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white">
        <Link href="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
          <img
            src="/logo.png"
            alt="Qbix Logo"
            className="h-56 lg:h-64 xl:h-72 w-auto object-contain max-w-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
          />
        </Link>
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight">Start tracking revenue intelligently.</h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Create an account to set up your organization, manage multi-currency transactions, and gain AI-driven insights.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          © {new Date().getFullYear()} QBIX RevenueTrack AI. All rights reserved.
        </div>
      </div>

      {/* Main Form & Mobile View */}
      <div className="relative flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm space-y-8">
          {/* Mobile Logo View (Hidden on Desktop) */}
          <div className="flex lg:hidden justify-center pb-2">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Qbix Logo"
                className="h-32 sm:h-40 w-auto object-contain max-w-full drop-shadow-md"
              />
            </Link>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground">
              Enter your details below to get started
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
