import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { ApprovalsContent } from "@/components/dashboard/approvals/approvals-content"

export default async function ApprovalsPage() {
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
