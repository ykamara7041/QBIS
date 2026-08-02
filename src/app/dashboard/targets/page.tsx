import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreateTargetForm } from "./create-target-form"
import { formatCurrency } from "@/lib/utils"

export default async function TargetsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  })

  if (!member) return <div>Access Denied</div>

  // Fetch active goals
  const goals = await db.revenueGoal.findMany({
    where: { 
      organizationId: member.organizationId,
      status: "ACTIVE"
    },
    orderBy: { endDate: 'asc' }
  })

  // Calculate actual revenue for these goals. 
  // For simplicity, we just grab all APPROVED revenue that falls within the goal's date range.
  const transactions = await db.revenueTransaction.findMany({
    where: {
      organizationId: member.organizationId,
      approvalStatus: "APPROVED"
    }
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue Targets</h1>
        <p className="text-muted-foreground">
          Track organizational performance against defined financial goals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Active Goals</h2>
          {goals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active targets found.</p>
          ) : (
            goals.map(goal => {
              // Calculate achieved amount for this goal
              const achieved = transactions
                .filter(tx => tx.date >= goal.startDate && tx.date <= goal.endDate)
                .reduce((sum, tx) => sum + tx.amount, 0)
              
              const progressPercent = Math.min((achieved / goal.targetAmount) * 100, 100)
              const isDanger = progressPercent < 25 && new Date() > new Date(goal.startDate.getTime() + (goal.endDate.getTime() - goal.startDate.getTime()) / 2)

              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <CardDescription>
                      {goal.startDate.toLocaleDateString()} - {goal.endDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span>{formatCurrency(achieved, goal.currency)}</span>
                      <span>Target: {formatCurrency(goal.targetAmount, goal.currency)}</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <div className="mt-2 text-xs text-muted-foreground text-right">
                      {progressPercent.toFixed(1)}% Achieved
                    </div>
                    {goal.writtenGoal && (
                      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                        <strong>Goal Details:</strong>
                        <p className="mt-1 whitespace-pre-wrap">{goal.writtenGoal}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <div>
          {member.role === "SUPER_ADMIN" || member.role === "FINANCE_MANAGER" ? (
            <CreateTargetForm />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Only Admins and Finance Managers can set new targets.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
