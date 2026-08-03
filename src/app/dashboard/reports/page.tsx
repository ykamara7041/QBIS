import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { ReportsContent } from "@/components/dashboard/reports/reports-content"

export default async function ReportsPage() {
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
    orderBy: { date: 'desc' }
  })

  const approved = transactions.filter(t => t.approvalStatus === "APPROVED")
  const pending = transactions.filter(t => t.approvalStatus === "PENDING")

  const totalApproved = approved.reduce((sum, t) => sum + t.amount, 0)
  const pendingTotal = pending.reduce((sum, t) => sum + t.amount, 0)

  return (
    <ReportsContent
      totalApproved={totalApproved}
      pendingTotal={pendingTotal}
      defaultCurrency={defaultCurrency}
      transactions={transactions}
    />
  )
}
