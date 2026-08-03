"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BarChart3Icon, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export interface RevenueDataPoint { month: string; revenue: number; target: number }

export function RevenueChart({ data, currency = "USD" }: { data: RevenueDataPoint[]; currency?: string }) {
  const isEmpty = data.length === 0 || (data.length === 1 && data[0].month === "No Data")
  if (isEmpty) return (
    <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"><BarChart3Icon className="h-6 w-6" /></div>
      <p className="mt-4 text-sm font-semibold">No revenue data yet</p><p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Add and approve your first transaction to begin tracking performance.</p>
      <Link href="/dashboard/revenue/add" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Plus className="h-4 w-4" /> Add revenue</Link>
    </div>
  )
  const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs><linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.24}/><stop offset="100%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#cbd5e1" strokeOpacity={0.45} strokeDasharray="4 5" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={8} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={compact} />
          <Tooltip formatter={(value) => formatCurrency(Number(value || 0), currency)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(15,23,42,.10)" }} />
          <Area type="monotone" dataKey="target" name="Target" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 5" fill="transparent" dot={false} />
          <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#2563eb" strokeWidth={3} fill="url(#revenue-fill)" activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
