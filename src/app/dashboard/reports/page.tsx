import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ReportsTable } from "./reports-table"
import { formatCurrency } from "@/lib/utils"

export default async function ReportsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  })

  if (!member) return <div>Access Denied</div>

  const transactions = await db.revenueTransaction.findMany({
    where: { organizationId: member.organizationId },
    orderBy: { date: 'desc' }
  })

  const totalConverted = transactions
    .filter(tx => tx.approvalStatus === "APPROVED")
    .reduce((sum, tx) => sum + tx.amount, 0)
    
  const pendingAmount = transactions
    .filter(tx => tx.approvalStatus === "PENDING")
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">
          View all transactions and export your data for external analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Approved Revenue</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalConverted, member.organization.defaultCurrency)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Revenue (Unapproved)</CardDescription>
            <CardTitle className="text-3xl text-muted-foreground">{formatCurrency(pendingAmount, member.organization.defaultCurrency)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Master Ledger</CardTitle>
          <CardDescription>All recorded revenue transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsTable transactions={transactions} defaultCurrency={member.organization.defaultCurrency} />
        </CardContent>
      </Card>
    </div>
  )
}
