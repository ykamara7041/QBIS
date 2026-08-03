import { auth } from "@/../auth"
import { db } from "@/lib/db"
import { RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { DashboardContent } from "./dashboard-content"

export default async function DashboardOverviewPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const session = await auth()
  
  // Find the first organization the user belongs to
  const member = await db.organizationMember.findFirst({
    where: { userId: session?.user?.id },
    include: { organization: true }
  })

  if (!member) return <div>Access Denied</div>

  const params = await searchParams
  const range = params.range || "year"
  const now = new Date()
  let startDate = new Date()

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0)
      break
    case "week":
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate.setMonth(now.getMonth() - 1)
      break
    case "year":
      startDate.setFullYear(now.getFullYear() - 1)
      break
    case "all":
      startDate = new Date(0)
      break
    default:
      startDate.setFullYear(now.getFullYear() - 1)
  }

  // Fetch transactions based on range
  const transactions = await db.revenueTransaction.findMany({
    where: {
      organizationId: member.organizationId,
      date: {
        gte: startDate,
        lte: now
      },
      approvalStatus: "APPROVED"
    },
    orderBy: { date: "asc" }
  })

  // Calculate Total
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  // Build chart data based on range
  const aggregatedData: Record<string, number> = {}
  
  transactions.forEach(tx => {
    const key = range === 'today' || range === 'week' 
      ? new Date(tx.date).toLocaleDateString(undefined, { weekday: 'short' })
      : new Date(tx.date).toLocaleDateString(undefined, { month: 'short' })
      
    aggregatedData[key] = (aggregatedData[key] || 0) + tx.amount
  })

  const chartData: RevenueDataPoint[] = Object.entries(aggregatedData).map(([key, value]) => ({
    month: key,
    revenue: value,
    target: value * 1.1
  }))

  // Fallback chart data if no transactions
  if (chartData.length === 0) {
    chartData.push({ month: "No Data", revenue: 0, target: 0 })
  }

  return (
    <DashboardContent 
      userName={session?.user?.name || 'User'} 
      chartData={chartData} 
      totalRevenue={totalRevenue}
      currency={member.organization.defaultCurrency}
    />
  )
}
