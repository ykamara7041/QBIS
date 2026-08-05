import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getOrganizationBranches } from "@/actions/branches"
import { BranchesContent } from "@/components/dashboard/branches/branches-content"

export default async function BranchesPage() {
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

  const rawBranches = await getOrganizationBranches()
  const defaultCurrency = member.organization.defaultCurrency || "GNF"
  const isAdmin = member.role === "SUPER_ADMIN" || member.role === "ORG_ADMIN"

  const transactions = await db.revenueTransaction.findMany({
    where: {
      organizationId: member.organizationId,
      approvalStatus: "APPROVED"
    }
  })

  const revenueTxs = transactions.filter(t => t.status !== "EXPENSE")
  const expenseTxs = transactions.filter(t => t.status === "EXPENSE")

  const totalCompanyRevenue = revenueTxs.reduce((sum, t) => sum + t.amount, 0)
  const totalCompanyExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0)

  const branches = rawBranches.map((b) => {
    const branchTxs = transactions.filter(t => t.branchId === b.id)
    const branchRevenues = branchTxs.filter(t => t.status !== "EXPENSE")
    const branchExpenses = branchTxs.filter(t => t.status === "EXPENSE")

    const totalRevenue = branchRevenues.reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = branchExpenses.reduce((sum, t) => sum + t.amount, 0)
    const netProfit = totalRevenue - totalExpenses

    return {
      id: b.id,
      name: b.name,
      code: b.code,
      location: b.location,
      managerName: b.managerName,
      targetBudget: b.targetBudget,
      totalRevenue,
      totalExpenses,
      netProfit,
      transactionCount: branchTxs.length,
    }
  })

  return (
    <BranchesContent
      organizationName={member.organization.name}
      defaultCurrency={defaultCurrency}
      branches={branches}
      totalCompanyRevenue={totalCompanyRevenue}
      totalCompanyExpenses={totalCompanyExpenses}
      isAdmin={isAdmin}
    />
  )
}
