"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createRevenueGoal } from "@/actions/targets"
import { useLanguage } from "@/components/providers/language-provider"

interface GoalItem {
  id: string
  title: string
  targetAmount: number
  currency: string
  writtenGoal?: string | null
  startDate: Date | string
  endDate: Date | string
}

interface TargetsContentProps {
  organizationName: string
  defaultCurrency: string
  goals: GoalItem[]
}

export function TargetsContent({ organizationName, defaultCurrency, goals }: TargetsContentProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    try {
      await createRevenueGoal({
        title: formData.get("title") as string,
        targetAmount: parseFloat(formData.get("targetAmount") as string),
        currency: defaultCurrency,
        writtenGoal: formData.get("writtenGoal") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
      })
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to create target")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("targets.title")}</h1>
        <p className="text-muted-foreground">{t("targets.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("targets.active_goals")}</h2>
          {goals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                {t("targets.no_targets")}
              </CardContent>
            </Card>
          ) : (
            goals.map(g => (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{g.title}</CardTitle>
                  <CardDescription>{g.currency} {g.targetAmount.toLocaleString()}</CardDescription>
                </CardHeader>
                {g.writtenGoal && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{g.writtenGoal}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("targets.set_new")}</CardTitle>
            <CardDescription>{t("targets.create_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && <div className="text-xs font-semibold text-destructive">{error}</div>}

              <div className="space-y-1.5">
                <Label htmlFor="title">{t("targets.goal_title")}</Label>
                <Input id="title" name="title" required placeholder="Q3 General Revenue" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="writtenGoal">{t("targets.written_goal")}</Label>
                <Textarea id="writtenGoal" name="writtenGoal" placeholder={t("targets.strategy_placeholder")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="targetAmount">{t("targets.target_amount")} ({defaultCurrency})</Label>
                <Input id="targetAmount" name="targetAmount" type="number" required placeholder="50000000" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="startDate">{t("targets.start_date")}</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endDate">{t("targets.end_date")}</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t("targets.creating") : t("targets.create_btn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
