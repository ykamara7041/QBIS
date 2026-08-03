"use client"

import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BarChart3Icon, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export interface RevenueDataPoint { month: string; revenue: number; target: number }

export function RevenueChart({ data, currency = "GNF" }: { data: RevenueDataPoint[]; currency?: string }) {
  const isEmpty = data.length === 0 || (data.length === 1 && data[0].month === "No Data")
  if (isEmpty) return (
    <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"><BarChart3Icon className="h-6 w-6" /></div>
      <p className="mt-4 text-sm font-semibold">No revenue data yet</p><p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Add and approve your first transaction to begin tracking performance.</p>
      <Link href="/dashboard/revenue/add" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Plus className="h-4 w-4" /> Add revenue</Link>
    </div>
  )

  const compact = (value: number) => {
    if (value === 0) return "0"
    const formatted = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
    return `${currency} ${formatted}`
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={8}>
          <CartesianGrid vertical={false} stroke="#cbd5e1" strokeOpacity={0.45} strokeDasharray="4 5" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={8} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={compact} width={65} />
          <Tooltip formatter={(value) => formatCurrency(Number(value || 0), currency)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(15,23,42,.10)" }} />
          <Bar dataKey="revenue" name="Actual Revenue" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={48} />
          <Bar dataKey="target" name="Target" fill="#7c3aed" opacity={0.35} radius={[8, 8, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
