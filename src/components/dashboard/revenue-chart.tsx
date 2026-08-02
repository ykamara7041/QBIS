"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts"

export interface RevenueDataPoint {
  month: string
  revenue: number
  target: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

import { BarChart3Icon } from "lucide-react"

export function RevenueChart({ data }: RevenueChartProps) {
  // Check if there is no real data
  const isEmpty = data.length === 0 || (data.length === 1 && data[0].month === "No Data")

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground w-full bg-muted/10 rounded-lg border border-dashed border-border/50">
        <BarChart3Icon className="h-10 w-10 mb-2 text-muted-foreground/50" />
        <p className="text-sm font-medium">No revenue data found</p>
        <p className="text-xs text-muted-foreground mt-1">There are no approved transactions in this time range.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
          contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
        />
        <Legend />
        <Bar
          dataKey="revenue"
          name="Actual Revenue"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="target"
          name="Target Revenue"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-muted-foreground/30"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
