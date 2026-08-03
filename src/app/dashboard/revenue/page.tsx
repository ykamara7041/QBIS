import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { redirect } from "next/navigation"
import { RevenueContent } from "@/components/dashboard/revenue/revenue-content"

export default async function RevenuePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  })

  if (!member) {
    return <div>No organization found.</div>
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

  const aggregatedData: Record<string, number> = {}
  
  approvedTxs.forEach(tx => {
    const key = new Date(tx.date).toLocaleDateString("en-US", { month: 'short' })
    aggregatedData[key] = (aggregatedData[key] || 0) + tx.amount
  })

  const chartData: RevenueDataPoint[] = Object.entries(aggregatedData).map(([key, value]) => ({
    month: key,
    revenue: value,
    target: Math.round(value * 1.1)
  }))

  if (chartData.length === 0) {
    chartData.push({ month: 'No Data', revenue: 0, target: 0 })
  }

  return (
    <RevenueContent
      organizationName={member.organization.name}
      defaultCurrency={defaultCurrency}
      transactions={transactions}
      chartData={chartData}
    />
  )
}
