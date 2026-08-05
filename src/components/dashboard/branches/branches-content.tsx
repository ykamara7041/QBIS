"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Building2, Plus, MapPin, User, TrendingUp, DollarSign, Edit3, Trash2, ArrowUpRight } from "lucide-react"
import { createBranch, updateBranch, deleteBranch } from "@/actions/branches"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/providers/language-provider"

interface BranchItem {
  id: string
  name: string
  code?: string | null
  location?: string | null
  managerName?: string | null
  targetBudget?: number | null
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  transactionCount: number
}

interface BranchesContentProps {
  organizationName: string
  defaultCurrency: string
  branches: BranchItem[]
  totalCompanyRevenue: number
  totalCompanyExpenses: number
  isAdmin: boolean
}

export function BranchesContent({
  organizationName,
  defaultCurrency,
  branches,
  totalCompanyRevenue,
  totalCompanyExpenses,
  isAdmin,
}: BranchesContentProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const totalCompanyNet = totalCompanyRevenue - totalCompanyExpenses

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const code = formData.get("code") as string
    const location = formData.get("location") as string
    const managerName = formData.get("managerName") as string
    const targetBudget = parseFloat(formData.get("targetBudget") as string) || 0

    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, {
          name,
          code,
          location,
          managerName,
          targetBudget,
        })
      } else {
        await createBranch({
          name,
          code,
          location,
          managerName,
          targetBudget,
        })
      }
      setOpen(false)
      setEditingBranch(null)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to save branch")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return
    try {
      await deleteBranch(id)
      router.refresh()
    } catch (err: any) {
      alert(err?.message || "Failed to delete branch")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header & Main Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            {t("nav.branches") || "Company Branches"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track revenue and expenditure across your company branches separately and as a combined total.
          </p>
        </div>

        {isAdmin && (
          <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) setEditingBranch(null)
          }}>
            <DialogTrigger render={
              <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            } />
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>{editingBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
                <DialogDescription>
                  Create or update a company branch location to track its independent revenue and expenses.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 pt-2">
                {error && <div className="text-xs font-semibold text-destructive">{error}</div>}

                <div className="space-y-1.5">
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input id="name" name="name" defaultValue={editingBranch?.name || ""} placeholder="e.g. Conakry Main Branch" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="code">Branch Code</Label>
                    <Input id="code" name="code" defaultValue={editingBranch?.code || ""} placeholder="CKR-01" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="targetBudget">Revenue Target ({defaultCurrency})</Label>
                    <Input id="targetBudget" name="targetBudget" type="number" defaultValue={editingBranch?.targetBudget || ""} placeholder="500000000" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Location / Address</Label>
                  <Input id="location" name="location" defaultValue={editingBranch?.location || ""} placeholder="Kaloum, Conakry, Guinea" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="managerName">Branch Manager Name</Label>
                  <Input id="managerName" name="managerName" defaultValue={editingBranch?.managerName || ""} placeholder="Mamadou Diallo" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
                    {loading ? "Saving..." : editingBranch ? "Save Changes" : "Create Branch"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Combined Executive Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active locations in organization</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Combined Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {defaultCurrency} {totalCompanyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sum across all branches</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Combined Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {defaultCurrency} {totalCompanyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total operating expenditure</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Combined Net Profit</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalCompanyNet >= 0 ? "text-blue-600" : "text-destructive"}`}>
              {defaultCurrency} {totalCompanyNet.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Net organizational earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance Comparison */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Branch Performance Breakdown</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {branches.map((branch) => {
            const shareOfRevenue = totalCompanyRevenue > 0
              ? Math.round((branch.totalRevenue / totalCompanyRevenue) * 100)
              : 0
            const targetProgress = branch.targetBudget && branch.targetBudget > 0
              ? Math.min(100, Math.round((branch.totalRevenue / branch.targetBudget) * 100))
              : 0

            return (
              <Card key={branch.id} className="rounded-2xl border shadow-sm transition hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">{branch.name}</CardTitle>
                        {branch.code && (
                          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-medium">
                            {branch.code}
                          </span>
                        )}
                      </div>
                      {branch.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {branch.location}
                        </p>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setEditingBranch(branch)
                            setOpen(true)
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(branch.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {branch.managerName && (
                    <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2.5 text-xs">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Manager:</span>
                      <span className="font-semibold text-foreground">{branch.managerName}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground">Branch Revenue</span>
                      <p className="text-base font-bold text-emerald-600">
                        {defaultCurrency} {branch.totalRevenue.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground">Expenses</span>
                      <p className="text-base font-bold text-amber-600">
                        {defaultCurrency} {branch.totalExpenses.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-3 space-y-2 bg-card">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Net Profit</span>
                      <span className={`font-bold ${branch.netProfit >= 0 ? "text-blue-600" : "text-destructive"}`}>
                        {defaultCurrency} {branch.netProfit.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Share of Company Revenue</span>
                      <span className="font-bold text-foreground">{shareOfRevenue}%</span>
                    </div>

                    {branch.targetBudget && branch.targetBudget > 0 ? (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>Target ({defaultCurrency} {branch.targetBudget.toLocaleString()})</span>
                          <span>{targetProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${targetProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
