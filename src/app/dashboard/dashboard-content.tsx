"use client"

import Link from "next/link"
import { ArrowUpRight, Banknote, CheckCircle2, Clock3, Plus, Target } from "lucide-react"
import { RevenueChart, RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { formatCurrency } from "@/lib/utils"

interface DashboardContentProps {
  userName: string
  chartData: RevenueDataPoint[]
  totalRevenue: number
  currency: string
}

function MetricCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: React.ElementType; tone: string }) {
  return (
    <article className="qbix-card p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 truncate text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </div>
      </div>
    </article>
  )
}

export function DashboardContent({ userName, chartData, totalRevenue, currency }: DashboardContentProps) {
  const firstName = userName.split(" ")[0]
  const hasRevenue = totalRevenue > 0

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">OVERVIEW</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.025em]">Good morning, {firstName}</h1>
          <p className="mt-1.5 text-muted-foreground">Here&apos;s how your organization&apos;s revenue is performing.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <TimeRangeSelector />
          <Link href="/dashboard/revenue/add" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Add revenue
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total Revenue" value={formatCurrency(totalRevenue, currency)} note={hasRevenue ? "Approved revenue in this period" : "Add your first approved transaction"} icon={Banknote} tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" />
        <MetricCard label="Target Achievement" value={hasRevenue ? "72%" : "0%"} note="Performance against active goals" icon={Target} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
        <MetricCard label="Pending Approvals" value="0" note="Transactions awaiting review" icon={Clock3} tone="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" />
      </section>

      <section className="grid gap-5">
        <article className="qbix-card min-w-0 p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div><h2 className="font-semibold">Revenue Performance</h2><p className="mt-1 text-sm text-muted-foreground">Actual revenue compared with target</p></div>
            <Link href="/dashboard/reports" className="flex items-center gap-1 text-sm font-semibold text-primary">View report <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <RevenueChart data={chartData} currency={currency} />
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="qbix-card p-5 lg:col-span-2 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">Recent Transactions</h2><p className="mt-1 text-sm text-muted-foreground">Latest recorded revenue activity</p></div><Link href="/dashboard/revenue" className="text-sm font-semibold text-primary">View all</Link></div>
          <div className="mt-6 flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 px-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-semibold">Your latest transactions will appear here</p>
            <p className="mt-1 text-xs text-muted-foreground">Open Revenue to add or review transaction records.</p>
          </div>
        </article>
        <article className="qbix-card p-5 sm:p-6"><h2 className="font-semibold">Goal Progress</h2><div className="mx-auto mt-6 flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0deg_259deg,#e2e8f0_259deg)]"><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-card"><strong className="text-3xl">{hasRevenue ? "72%" : "0%"}</strong><span className="text-xs text-muted-foreground">of target</span></div></div><Link href="/dashboard/targets" className="mt-6 flex justify-center text-sm font-semibold text-primary">Manage revenue targets</Link></article>
      </section>
    </div>
  )
}
