import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { RevenueContent } from "@/components/dashboard/revenue/revenue-content"

export default async function RevenuePage() {
  const session = await auth()
  const cookieStore = await cookies()
  const fallbackUserId = cookieStore.get("qbix_session")?.value
  const activeUserId = session?.user?.id || fallbackUserId

  if (!activeUserId) {
    redirect("/login")
  }

  let member = await db.organizationMember.findFirst({
    where: { userId: activeUserId },
    include: { organization: true }
  })

  if (!member && activeUserId) {
    let org = await db.organization.findFirst()
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "QBIX Organization",
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
    redirect("/login")
  }

  const defaultCurrency = member.organization.defaultCurrency || "GNF"

  const transactions = await db.revenueTransaction.findMany({
    where: { organizationId: member.organizationId },
    orderBy: { date: 'desc' },
    take: 20
  })

  const approvedTxs = await db.revenueTransaction.findMany({
    where: {
      organizationId: member.organizationId,
      approvalStatus: "APPROVED"
    },
    orderBy: { date: 'asc' }
  })

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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyTarget = totalTarget > 0 ? Math.round(totalTarget / 12) : 0

  const aggregatedData: Record<string, number> = {}
  approvedTxs.forEach(tx => {
    const key = new Date(tx.date).toLocaleDateString("en-US", { month: 'short' })
    aggregatedData[key] = (aggregatedData[key] || 0) + tx.amount
  })

  const chartData: RevenueDataPoint[] = months.map(m => ({
    month: m,
    revenue: aggregatedData[m] || 0,
    target: monthlyTarget || Math.round((aggregatedData[m] || 0) * 1.15)
  }))

  return (
    <RevenueContent
      organizationName={member.organization.name}
      defaultCurrency={defaultCurrency}
      transactions={transactions}
      chartData={chartData}
    />
  )
}
