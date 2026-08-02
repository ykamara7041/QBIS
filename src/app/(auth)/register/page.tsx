import RegisterForm from "./register-form"
import Link from "next/link"
import { TrendingUpIcon } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Qbix Logo" className="h-32 w-auto object-contain" />
        </Link>
        <div className="space-y-6">
          <h1 className="text-4xl font-medium tracking-tight">Start tracking revenue intelligently.</h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Create an account to set up your organization, manage multi-currency transactions, and gain AI-driven insights.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          © {new Date().getFullYear()} QBIX RevenueTrack AI. All rights reserved.
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
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
