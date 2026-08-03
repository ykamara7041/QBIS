import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  brandTagline?: string
  brandHeading: React.ReactNode
  brandDescription: string
  benefits?: { icon: React.ReactNode; text: string }[]
  previewCard?: {
    title: string
    items: string[]
  }
  cardIcon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

export function AuthLayout({
  brandTagline,
  brandHeading,
  brandDescription,
  benefits,
  previewCard,
  cardIcon,
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.02fr_1fr]">
      {/* Left Brand Panel */}
      <section className="relative hidden overflow-hidden bg-[#071a3d] px-10 py-9 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(59,130,246,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.15)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom_right,black,transparent_70%)]" />
        <div className="absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-3xl" />

        <Link href="/" className="relative z-10 w-fit" aria-label="QBIX home">
          <Image
            src="/logo.png"
            alt="QBIX"
            width={240}
            height={160}
            priority
            className="h-16 w-auto object-contain brightness-0 invert"
          />
        </Link>

        <div className="relative z-10 my-12 max-w-2xl">
          {brandTagline && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              {brandTagline}
            </p>
          )}
          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.035em] xl:text-6xl">
            {brandHeading}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            {brandDescription}
          </p>

          {benefits && benefits.length > 0 && (
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-slate-200">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {previewCard && (
            <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-sm">
              <p className="text-sm font-semibold tracking-wide text-slate-200">
                {previewCard.title}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {previewCard.items.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} QBIX RevenueTrack AI. All rights reserved.
        </p>
      </section>

      {/* Right Registration Area */}
      <section className="relative flex min-h-screen items-center justify-center px-5 py-16 sm:px-10">
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-[480px]">
          <Link href="/" className="mb-9 flex justify-center lg:hidden" aria-label="QBIX home">
            <Image
              src="/logo.png"
              alt="QBIX"
              width={240}
              height={160}
              priority
              className="h-20 w-auto object-contain"
            />
          </Link>
          <div className="qbix-card bg-card p-6 sm:p-9">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {cardIcon}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="mt-8">{children}</div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Your financial data is protected
          </div>
        </div>
      </section>
    </main>
  )
}
