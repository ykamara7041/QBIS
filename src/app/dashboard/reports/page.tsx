import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { ReportsContent } from "@/components/dashboard/reports/reports-content"

export default async function ReportsPage() {
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
