"use client"

import { RevenueChart, RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BanknoteIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"
import { EditTransactionDialog } from "@/components/dashboard/edit-transaction-dialog"
import { useLanguage } from "@/components/providers/language-provider"

interface TransactionItem {
  id: string
  originalAmount?: number | null
  originalCurrency?: string | null
  amount: number
  currency: string
  description?: string | null
  category?: string | null
  paymentMethod?: string | null
  customerName?: string | null
  receiptNumber?: string | null
  agentName?: string | null
  date: Date | string
}

interface RevenueContentProps {
  organizationName: string
  defaultCurrency: string
  transactions: TransactionItem[]
  chartData: RevenueDataPoint[]
}

export function RevenueContent({ organizationName, defaultCurrency, transactions, chartData }: RevenueContentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("revenue.title")}</h1>
        <p className="text-muted-foreground">
          {t("revenue.subtitle")} ({organizationName})
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-5">
          <CardHeader>
            <CardTitle>{t("revenue.vs_target")}</CardTitle>
            <CardDescription>{t("revenue.monthly_perf")} in {defaultCurrency}</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <RevenueChart data={chartData} currency={defaultCurrency} />
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("revenue.quick_actions")}</CardTitle>
            <CardDescription>{t("revenue.manage_flow")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/revenue/add">
              <div className="rounded-lg border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <BanknoteIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">{t("revenue.add_transaction")}</div>
                    <div className="text-xs text-muted-foreground">{t("revenue.record_income")}</div>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/reports">
              <div className="rounded-lg border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUpIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">{t("revenue.generate_report")}</div>
                    <div className="text-xs text-muted-foreground">{t("revenue.export_pdf")}</div>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("revenue.recorded_txs")}</CardTitle>
          <CardDescription>{t("revenue.click_edit")}</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">{t("revenue.no_txs")}</div>
          ) : (
            <div className="divide-y">
              {transactions.map(tItem => (
                <div key={tItem.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-sm">{tItem.description || "Revenue Entry"}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tItem.date).toLocaleDateString()} • {tItem.category || "Uncategorized"} {tItem.agentName ? `• Agent: ${tItem.agentName}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {tItem.originalCurrency || tItem.currency} {(tItem.originalAmount || tItem.amount).toLocaleString()}
                      </div>
                      {tItem.originalCurrency !== tItem.currency && (
                        <div className="text-[11px] text-muted-foreground">
                          ≈ {tItem.currency} {tItem.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <EditTransactionDialog transaction={tItem} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
