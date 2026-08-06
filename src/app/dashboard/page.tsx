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

  const rawGoals = await db.revenueGoal.findMany({
    where: { organizationId: member.organizationId }
  })

  let totalTarget = rawGoals.reduce((sum, g) => sum + g.targetAmount, 0)
  if (totalTarget === 0) {
    const branches = await db.branch.findMany({
      where: { organizationId: member.organizationId }
    })
    totalTarget = branches.reduce((sum, b) => sum + (b.targetBudget || 0), 0)
  }

  const targetAchievementPercentage = totalTarget > 0 
    ? Math.round((totalRevenue / totalTarget) * 100)
    : (totalRevenue > 0 ? 100 : 0)

  let chartData: RevenueDataPoint[] = []

  if (range === "year" || range === "all") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyTarget = totalTarget > 0 ? Math.round(totalTarget / 12) : 0

    const monthMap: Record<string, number> = {}
    revenueTxs.forEach(tx => {
      const monthName = new Date(tx.date).toLocaleDateString("en-US", { month: "short" })
      monthMap[monthName] = (monthMap[monthName] || 0) + tx.amount
    })

    chartData = months.map(m => ({
      month: m,
      revenue: monthMap[m] || 0,
      target: monthlyTarget || Math.round((monthMap[m] || 0) * 1.15)
    }))
  } else if (range === "week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const dailyTarget = totalTarget > 0 ? Math.round(totalTarget / 365) : 0

    const dayMap: Record<string, number> = {}
    revenueTxs.forEach(tx => {
      const dayName = new Date(tx.date).toLocaleDateString("en-US", { weekday: "short" })
      dayMap[dayName] = (dayMap[dayName] || 0) + tx.amount
    })

    chartData = days.map(d => ({
      month: d,
      revenue: dayMap[d] || 0,
      target: dailyTarget || Math.round((dayMap[d] || 0) * 1.15)
    }))
  } else if (range === "today") {
    const timeBlocks = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]
    const blockTarget = totalTarget > 0 ? Math.round(totalTarget / 365 / 6) : 0

    const timeMap: Record<string, number> = {}
    revenueTxs.forEach(tx => {
      const hour = new Date(tx.date).getHours()
      const blockIdx = Math.min(5, Math.floor(hour / 4))
      const blockKey = timeBlocks[blockIdx]
      timeMap[blockKey] = (timeMap[blockKey] || 0) + tx.amount
    })

    chartData = timeBlocks.map(t => ({
      month: t,
      revenue: timeMap[t] || 0,
      target: blockTarget || Math.round((timeMap[t] || 0) * 1.15)
    }))
  } else {
    // Month or fallback
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]
    const weeklyTarget = totalTarget > 0 ? Math.round(totalTarget / 52) : 0

    const weekMap: Record<string, number> = {}
    revenueTxs.forEach(tx => {
      const dateNum = new Date(tx.date).getDate()
      const weekIdx = Math.min(3, Math.floor((dateNum - 1) / 7))
      const weekKey = weeks[weekIdx]
      weekMap[weekKey] = (weekMap[weekKey] || 0) + tx.amount
    })

    chartData = weeks.map(w => ({
      month: w,
      revenue: weekMap[w] || 0,
      target: weeklyTarget || Math.round((weekMap[w] || 0) * 1.15)
    }))
  }

  return (
    <DashboardContent 
      userName={currentUser?.name || session?.user?.name || 'User'} 
      chartData={chartData} 
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      netProfit={netProfit}
      currency={member.organization.defaultCurrency}
      targetAchievementPercentage={targetAchievementPercentage}
      totalTarget={totalTarget}
    />
  )
}
