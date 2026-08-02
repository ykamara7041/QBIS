import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ApprovalTable } from "./approval-table"

export default async function ApprovalsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id }
  })

  if (!member || (member.role !== "SUPER_ADMIN" && member.role !== "FINANCE_MANAGER")) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">You do not have permission to access the approval workflow.</p>
      </div>
    )
  }

  const pendingTransactions = await db.revenueTransaction.findMany({
    where: { 
      organizationId: member.organizationId,
      approvalStatus: "PENDING"
    },
    orderBy: { date: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve pending revenue transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
          <CardDescription>Transactions requiring Finance Manager approval before appearing on the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalTable transactions={pendingTransactions} />
        </CardContent>
      </Card>
    </div>
  )
}
