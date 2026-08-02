import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TargetIcon } from "lucide-react"

export interface GoalData {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  currency: string
  endDate: Date
  status: string
}

interface GoalsProgressProps {
  goals: GoalData[]
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
        <TargetIcon className="h-8 w-8 text-muted-foreground mb-4" />
        <h3 className="font-medium">No active goals</h3>
        <p className="text-sm text-muted-foreground">Set your first revenue goal to track progress here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) || 0
        const isCompleted = goal.currentAmount >= goal.targetAmount

        return (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold">{goal.title}</CardTitle>
                <span className="text-sm font-medium">
                  {percentage}%
                </span>
              </div>
              <CardDescription>
                Deadline: {goal.endDate.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={percentage} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.currency} {goal.currentAmount.toLocaleString()}</span>
                <span>Target: {goal.currency} {goal.targetAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
