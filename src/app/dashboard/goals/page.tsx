import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { GoalsProgress, GoalData } from "@/components/dashboard/goals-progress"
import { redirect } from "next/navigation"

export default async function GoalsPage() {
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

  const rawGoals = await db.revenueGoal.findMany({
    where: { organizationId: member.organizationId },
    orderBy: { endDate: 'asc' }
  })

  // Map to the interface expected by our component
  const goals: GoalData[] = rawGoals.map(g => ({
    id: g.id,
    title: g.title,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount,
    currency: g.currency,
    endDate: g.endDate,
    status: g.status,
  }))

  // If no real goals exist yet, let's inject a demo goal
  if (goals.length === 0) {
    goals.push({
      id: "demo-goal",
      title: "Q3 Software Subscriptions",
      targetAmount: 50000,
      currentAmount: 32500,
      currency: "GNF",
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      status: "ACTIVE"
    })
  }

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
