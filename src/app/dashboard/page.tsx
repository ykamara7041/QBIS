import { auth } from "@/../auth"
import { db } from "@/lib/db"
import { RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { DashboardContent } from "./dashboard-content"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function DashboardOverviewPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const session = await auth()
  const cookieStore = await cookies()
  const fallbackUserId = cookieStore.get("qbix_session")?.value
  const activeUserId = session?.user?.id || fallbackUserId
  
  if (!activeUserId) {
    redirect("/login")
  }

  const currentUser = await db.user.findUnique({
    where: { id: activeUserId }
  })

  let member = await db.organizationMember.findFirst({
    where: { userId: activeUserId },
    include: { organization: true }
  })

  if (!member && activeUserId) {
    let org = await db.organization.findFirst()
    if (!org) {
      org = await db.organization.create({
        data: {
          name: `${currentUser?.name || 'User'}'s Organization`,
          defaultCurrency: "GNF"
        }
      })
    }

    member = await db.organizationMember.create({
      data: {
        userId: activeUserId,
        organizationId: org.id,
        role: "SUPER_ADMIN"
      },
      include: { organization: true }
    })
  }

  if (!member) {
    return (
      <div className="flex h-64 items-center justify-center text-center">
        <p className="text-muted-foreground">Setting up your organization... Please refresh the page.</p>
      </div>
    )
  }

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

  const approvedTxs = await db.revenueTransaction.findMany({
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

  const revenueTxs = approvedTxs.filter(tx => tx.status !== "EXPENSE")
  const expenseTxs = approvedTxs.filter(tx => tx.status === "EXPENSE")

  const totalRevenue = revenueTxs.reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpenses = expenseTxs.reduce((sum, tx) => sum + tx.amount, 0)
  const netProfit = totalRevenue - totalExpenses

  const aggregatedData: Record<string, number> = {}
  
  revenueTxs.forEach(tx => {
    const key = range === 'today' || range === 'week' 
      ? new Date(tx.date).toLocaleDateString(undefined, { weekday: 'short' })
      : new Date(tx.date).toLocaleDateString(undefined, { month: 'short' })
      
    aggregatedData[key] = (aggregatedData[key] || 0) + tx.amount
  })

  const chartData: RevenueDataPoint[] = Object.entries(aggregatedData).map(([key, value]) => ({
    month: key,
    revenue: value,
    target: Math.round(value * 1.1)
  }))

  if (chartData.length === 0) {
    chartData.push({ month: "No Data", revenue: 0, target: 0 })
  }

  return (
    <DashboardContent 
      userName={currentUser?.name || session?.user?.name || 'User'} 
      chartData={chartData} 
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      netProfit={netProfit}
      currency={member.organization.defaultCurrency}
    />
  )
}
