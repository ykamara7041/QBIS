import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { GoalsProgress, GoalData } from "@/components/dashboard/goals-progress"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function GoalsPage() {
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

  const rawGoals = await db.revenueGoal.findMany({
    where: { organizationId: member.organizationId },
    orderBy: { endDate: 'asc' }
  })

  // Calculate actual revenue sum for the organization
  const approvedTxSum = await db.revenueTransaction.aggregate({
    where: {
      organizationId: member.organizationId,
      approvalStatus: "APPROVED",
      status: { not: "EXPENSE" }
    },
    _sum: { amount: true }
  })
  const totalApprovedRevenue = approvedTxSum._sum.amount || 0

  // Map to the interface expected by our component
  const goals: GoalData[] = rawGoals.map(g => ({
    id: g.id,
    title: g.title,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount > 0 ? g.currentAmount : totalApprovedRevenue,
    currency: g.currency,
    endDate: g.endDate,
    status: g.status,
  }))

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Goals</h1>
          <p className="text-muted-foreground">
            Monitor targets and organizational milestones.
          </p>
        </div>
      </div>

      <GoalsProgress goals={goals} />
    </div>
  )
}
