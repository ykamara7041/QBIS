"use client"

import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { BarChart3Icon, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export interface RevenueDataPoint { month: string; revenue: number; target: number }

export function RevenueChart({ data, currency = "GNF" }: { data: RevenueDataPoint[]; currency?: string }) {
  const isEmpty = data.length === 0 || (data.length === 1 && data[0].month === "No Data")
  if (isEmpty) return (
    <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"><BarChart3Icon className="h-6 w-6" /></div>
      <p className="mt-4 text-sm font-semibold">No revenue data yet</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Add and approve your first transaction to begin tracking performance.</p>
      <Link href="/dashboard/revenue/add" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Plus className="h-4 w-4" /> Add revenue</Link>
    </div>
  )

  const compact = (value: number) => {
    if (value === 0) return "0"
    const formatted = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
    return `${formatted}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenueVal = payload.find((p: any) => p.dataKey === "revenue")?.value || 0
      const targetVal = payload.find((p: any) => p.dataKey === "target")?.value || 0
      const rawRate = targetVal > 0 ? Math.round((revenueVal / targetVal) * 100) : 0
      const rate = Math.min(100, rawRate)

      return (
        <div className="rounded-xl border bg-card p-3 shadow-lg text-xs space-y-1.5 min-w-[160px]">
          <p className="font-semibold text-foreground border-b pb-1 mb-1">{label}</p>
          <div className="flex justify-between items-center gap-4 text-blue-600 dark:text-blue-400">
            <span>Actual Revenue:</span>
            <span className="font-bold">{formatCurrency(revenueVal, currency)}</span>
          </div>
          <div className="flex justify-between items-center gap-4 text-purple-600 dark:text-purple-400">
            <span>Target Goal:</span>
            <span className="font-bold">{formatCurrency(targetVal, currency)}</span>
          </div>
          {targetVal > 0 && (
            <div className="flex justify-between items-center gap-4 pt-1 border-t text-muted-foreground">
              <span>Achievement:</span>
              <span className={`font-bold ${rate >= 100 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-rose-600"}`}>
                {rate}%
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }} barGap={6}>
          <CartesianGrid vertical={false} stroke="#cbd5e1" strokeOpacity={0.35} strokeDasharray="4 4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={6} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={compact} width={55} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "12px", fontSize: "12px" }} />
          <Bar dataKey="revenue" name="Actual Revenue" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={44} />
          <Bar dataKey="target" name="Target Goal" fill="#9333ea" opacity={0.45} radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
