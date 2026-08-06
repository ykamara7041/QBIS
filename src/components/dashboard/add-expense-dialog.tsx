"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addExpenseTransaction } from "@/actions/expense"
import { getOrganizationBranches } from "@/actions/branches"
import { Loader2, MinusCircle, Building2 } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

interface BranchItem {
  id: string
  name: string
  code?: string | null
}

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [branches, setBranches] = useState<BranchItem[]>([])
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    getOrganizationBranches().then(setBranches).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const branchVal = formData.get("branchId") as string
    const branchId = branchVal && branchVal !== "all" ? branchVal : undefined

    try {
      await addExpenseTransaction({
        originalAmount: parseFloat(formData.get("amount") as string),
        originalCurrency: formData.get("currency") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        paymentMethod: formData.get("paymentMethod") as string,
        customerName: formData.get("vendorName") as string,
        receiptNumber: formData.get("receiptNumber") as string,
        branchId,
      })
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to record expense")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex">
        <Button variant="outline" className="h-10 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50">
          <MinusCircle className="mr-1.5 h-4 w-4" /> {t('dashboard.add_expense')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.add_expense')}</DialogTitle>
          <DialogDescription>
            Record an operational expenditure and assign it to a company branch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && <div className="text-xs font-semibold text-destructive">{error}</div>}

          {/* Branch Location Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="branchId" className="text-xs flex items-center gap-1 font-semibold">
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              Company Branch
            </Label>
            <Select name="branchId" defaultValue="all">
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select target branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Head Office / All Branches (Unassigned)</SelectItem>
                {branches.map(b => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} {b.code ? `(${b.code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs">{t('revenue.add.amount')}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs">{t('revenue.add.currency')}</Label>
              <Select name="currency" defaultValue="GNF">
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GNF">GNF - Guinean Franc</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="LRD">LRD - Liberian Dollar</SelectItem>
                  <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs">{t('revenue.add.desc')}</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g. Office Rent, Cloud Server Host"
              required
              className="h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs">{t('revenue.add.category')}</Label>
              <Select name="category" defaultValue="Operational Expense">
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operational Expense">Operational Expense</SelectItem>
                  <SelectItem value="Salaries & Payroll">Salaries & Payroll</SelectItem>
                  <SelectItem value="Software & Subscriptions">Software & Subscriptions</SelectItem>
                  <SelectItem value="Marketing & Travel">Marketing & Travel</SelectItem>
                  <SelectItem value="Equipment & Supplies">Equipment & Supplies</SelectItem>
                  <SelectItem value="Other Expense">Other Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod" className="text-xs">{t('revenue.add.payment')}</Label>
              <Select name="paymentMethod" defaultValue="Bank Transfer">
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Company Card">Company Card</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Petty Cash">Petty Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vendorName" className="text-xs">{t('revenue.add.customer')}</Label>
              <Input
                id="vendorName"
                name="vendorName"
                placeholder="e.g. AWS, Property Manager"
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="receiptNumber" className="text-xs">{t('revenue.add.receipt')}</Label>
              <Input
                id="receiptNumber"
                name="receiptNumber"
                placeholder="INV-EXP-001"
                className="h-10 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="h-9 text-xs">
              {t('revenue.add.cancel')}
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t('dashboard.add_expense')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
