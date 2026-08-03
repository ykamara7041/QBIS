import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { ApprovalsContent } from "@/components/dashboard/approvals/approvals-content"

export default async function ApprovalsPage() {
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

  const pendingTransactions = await db.revenueTransaction.findMany({
    where: {
      organizationId: member.organizationId,
      approvalStatus: "PENDING"
    },
    orderBy: { date: 'desc' }
  })

  return (
    <ApprovalsContent pendingTransactions={pendingTransactions} />
  )
}
