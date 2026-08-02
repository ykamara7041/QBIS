"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createRevenueGoal } from "@/actions/targets"

export function CreateTargetForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    
    try {
      await createRevenueGoal({
        title: formData.get("title") as string,
        writtenGoal: formData.get("writtenGoal") as string,
        targetAmount: parseFloat(formData.get("targetAmount") as string),
        currency: "GNF", // Enforce default org currency for target tracking
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
      })
      setSuccess("Revenue target created successfully!")
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || "Failed to create target.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set New Target</CardTitle>
        <CardDescription>Create a new financial goal for the organization.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-destructive">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input id="title" name="title" required placeholder="Q3 General Revenue" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="writtenGoal">Written Goal (Qualitative)</Label>
            <Textarea id="writtenGoal" name="writtenGoal" placeholder="Describe the strategy or objective..." className="min-h-[80px]" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (GNF)</Label>
            <Input id="targetAmount" name="targetAmount" type="number" step="0.01" required placeholder="50000000" />
            <p className="text-xs text-muted-foreground">Numeric goals are tracked in the organization's base currency (GNF).</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-6">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Target"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
