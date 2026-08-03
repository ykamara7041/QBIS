import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { RevenueChart, RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BanknoteIcon, TrendingUpIcon } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

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
    take: 5
  })

  // Aggregate approved transactions for chart
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue Management</h1>
        <p className="text-muted-foreground">
          Track and analyze transactions across {member.organization.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-5">
          <CardHeader>
            <CardTitle>Revenue vs Target</CardTitle>
            <CardDescription>Monthly aggregated performance in {defaultCurrency}</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <RevenueChart data={chartData} currency={defaultCurrency} />
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your cash flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/revenue/add">
              <div className="rounded-lg border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <BanknoteIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Add Transaction</div>
                    <div className="text-xs text-muted-foreground">Record new income</div>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/reports">
              <div className="rounded-lg border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUpIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Generate Report</div>
                    <div className="text-xs text-muted-foreground">Export monthly PDF</div>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest logged revenue events</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No transactions recorded yet.</div>
          ) : (
            <div className="divide-y">
              {transactions.map(t => (
                <div key={t.id} className="flex justify-between py-3">
                  <div>
                    <div className="font-medium text-sm">{t.description || "Revenue Entry"}</div>
                    <div className="text-xs text-muted-foreground">{t.date.toLocaleDateString()} • {t.category}</div>
                  </div>
                  <div className="font-semibold text-sm">
                    {t.currency} {t.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
