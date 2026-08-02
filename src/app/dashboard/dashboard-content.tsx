"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BanknoteIcon, TargetIcon, BotIcon } from "lucide-react"
import { RevenueChart, RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { formatCurrency } from "@/lib/utils"

interface DashboardContentProps {
  userName: string
  chartData: RevenueDataPoint[]
  aiInsightsFeed: React.ReactNode
  totalRevenue: number
  currency: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

export function DashboardContent({ userName, chartData, aiInsightsFeed, totalRevenue, currency }: DashboardContentProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Here's an overview of your organization's performance.
          </p>
        </div>
        <TimeRangeSelector />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/95 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <BanknoteIcon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue, currency)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on selected time range
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/95 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Goals
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <TargetIcon className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">
                0 targets reached this month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/95 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AI Forecast
              </CardTitle>
              <div className="p-2 bg-indigo-500/10 rounded-full">
                <BotIcon className="h-4 w-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">Positive</div>
              <p className="text-xs text-muted-foreground mt-1">
                Expected to exceed Q3 target by 5%
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="col-span-4" whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/95 border-primary/5">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue vs targets</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              <RevenueChart data={chartData} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-3" whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-background/95 border-primary/5">
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
              <CardDescription>AI-generated performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {aiInsightsFeed}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
