"use client"

import Link from "next/link"
import { ArrowUpRight, Banknote, CheckCircle2, MinusCircle, Plus, DollarSign, Target } from "lucide-react"
import { RevenueChart, RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { AddExpenseDialog } from "@/components/dashboard/add-expense-dialog"
import { formatCurrency } from "@/lib/utils"
import { useLanguage } from "@/components/providers/language-provider"

interface DashboardContentProps {
  userName: string
  chartData: RevenueDataPoint[]
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  currency: string
  targetAchievementPercentage: number
  totalTarget: number
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

export function DashboardContent({ userName, chartData, totalRevenue, totalExpenses, netProfit, currency, targetAchievementPercentage, totalTarget }: DashboardContentProps) {
  const { t } = useLanguage()
  const firstName = userName.split(" ")[0]
  const deg = Math.min(360, Math.max(0, Math.round((targetAchievementPercentage / 100) * 360)))

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">{t('dashboard.overview')}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.025em]">{t('dashboard.greeting')}, {firstName}</h1>
          <p className="mt-1.5 text-muted-foreground">{t('dashboard.subheading')}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <TimeRangeSelector />
          <AddExpenseDialog />
          <Link href="/dashboard/revenue/add" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-blue-700">
            <Plus className="h-4 w-4" /> {t('dashboard.add_revenue')}
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={t('dashboard.total_revenue')}
          value={formatCurrency(totalRevenue, currency)}
          note={t('dashboard.approved_income')}
          icon={Banknote}
          tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />
        <MetricCard
          label={t('dashboard.operating_expenses')}
          value={formatCurrency(totalExpenses, currency)}
          note={t('dashboard.total_expenditure')}
          icon={MinusCircle}
          tone="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
        />
        <MetricCard
          label={t('dashboard.net_profit')}
          value={formatCurrency(netProfit, currency)}
          note={t('dashboard.net_profit_note')}
          icon={DollarSign}
          tone={netProfit >= 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"}
        />
        <MetricCard
          label={t('dashboard.target_achievement')}
          value={`${targetAchievementPercentage}%`}
          note={totalTarget > 0 ? `Target: ${formatCurrency(totalTarget, currency)}` : t('dashboard.goals_note')}
          icon={Target}
          tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
        />
      </section>

      <section className="grid gap-5">
        <article className="qbix-card min-w-0 p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div><h2 className="font-semibold">{t('dashboard.revenue_performance')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('dashboard.actual_vs_target')}</p></div>
            <Link href="/dashboard/reports" className="flex items-center gap-1 text-sm font-semibold text-primary">{t('dashboard.view_report')} <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <RevenueChart data={chartData} currency={currency} />
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="qbix-card p-5 lg:col-span-2 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">{t('dashboard.recent_transactions')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('dashboard.latest_activity')}</p></div><Link href="/dashboard/revenue" className="text-sm font-semibold text-primary">{t('dashboard.view_all')}</Link></div>
          <div className="mt-6 flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 px-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-semibold">{t('dashboard.recent_transactions')}</p>
          </div>
        </article>
        <article className="qbix-card p-5 sm:p-6">
          <h2 className="font-semibold">{t('dashboard.goal_progress')}</h2>
          <div
            className="mx-auto mt-6 flex h-36 w-36 items-center justify-center rounded-full transition-all duration-500"
            style={{ background: `conic-gradient(#10b981 0deg ${deg}deg, #e2e8f0 ${deg}deg)` }}
          >
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-card shadow-inner">
              <strong className="text-3xl font-bold tracking-tight">{targetAchievementPercentage}%</strong>
              <span className="text-xs text-muted-foreground">{t('dashboard.of_target')}</span>
            </div>
          </div>
          <Link href="/dashboard/targets" className="mt-6 flex justify-center text-sm font-semibold text-primary hover:underline">{t('dashboard.manage_targets')}</Link>
        </article>
      </section>
    </div>
  )
}
