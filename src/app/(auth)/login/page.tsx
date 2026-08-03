import Link from "next/link"
import Image from "next/image"
import { BarChart3, CheckCircle2, ShieldCheck, Sparkles, WalletCards } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import LoginForm from "./login-form"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.02fr_1fr]">
      <section className="relative hidden overflow-hidden bg-[#071a3d] px-10 py-9 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(59,130,246,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.15)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom_right,black,transparent_70%)]" />
        <div className="absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-3xl" />

        <Link href="/" className="relative z-10 w-fit" aria-label="QBIX home">
          <Image src="/logo.png" alt="QBIX" width={240} height={160} priority className="h-16 w-auto object-contain brightness-0 invert" />
        </Link>

        <div className="relative z-10 my-12 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Revenue intelligence for modern teams</p>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.035em] xl:text-6xl">
            Track revenue.<br />Reach <span className="text-blue-400">every goal.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Monitor performance, manage approvals, and turn financial data into confident decisions.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-slate-200">
            <div className="flex items-center gap-2"><WalletCards className="h-5 w-5 text-blue-300" /> Multi-currency</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-300" /> Secure approvals</div>
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-300" /> AI insights</div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-slate-300">Revenue overview</p><p className="mt-2 text-3xl font-bold">GNF 24.59M</p></div>
              <div className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">+18.7% this month</div>
            </div>
            <div className="mt-7 flex h-24 items-end gap-2" aria-hidden="true">
              {[34, 43, 39, 55, 51, 68, 64, 79, 73, 91].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-md bg-blue-400/80" style={{ height: `${height}%`, opacity: .45 + index * .05 }} />
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400">© {new Date().getFullYear()} QBIX RevenueTrack AI. All rights reserved.</p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-16 sm:px-10">
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8"><ThemeToggle /></div>
        <div className="w-full max-w-[460px]">
          <Link href="/" className="mb-9 flex justify-center lg:hidden"><Image src="/logo.png" alt="QBIX" width={240} height={160} priority className="h-20 w-auto object-contain" /></Link>
          <div className="qbix-card bg-card p-6 sm:p-9">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BarChart3 className="h-6 w-6" /></div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your QBIX workspace.</p>
            </div>
            <div className="mt-8"><LoginForm /></div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Your financial data is protected
          </div>
        </div>
      </section>
    </main>
  )
}
