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
import { updateRevenueTransaction, deleteRevenueTransaction } from "@/actions/revenue"
import { getOrganizationBranches } from "@/actions/branches"
import { Edit2, Loader2, Trash2, Building2 } from "lucide-react"

interface BranchItem {
  id: string
  name: string
  code?: string | null
}

interface TransactionItem {
  id: string
  originalAmount?: number | null
  originalCurrency?: string | null
  amount: number
  currency: string
  description?: string | null
  category?: string | null
  paymentMethod?: string | null
  customerName?: string | null
  receiptNumber?: string | null
  agentName?: string | null
  branchId?: string | null
  date: Date | string
}

export function EditTransactionDialog({ transaction }: { transaction: TransactionItem }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [branches, setBranches] = useState<BranchItem[]>([])
  const router = useRouter()

  useEffect(() => {
    getOrganizationBranches().then(setBranches).catch(() => {})
  }, [])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const branchVal = formData.get("branchId") as string
    const branchId = branchVal && branchVal !== "all" ? branchVal : undefined

    try {
      await updateRevenueTransaction({
        id: transaction.id,
        originalAmount: parseFloat(formData.get("amount") as string),
        originalCurrency: formData.get("currency") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        paymentMethod: formData.get("paymentMethod") as string,
        customerName: formData.get("customerName") as string,
        receiptNumber: formData.get("receiptNumber") as string,
        agentName: formData.get("agentName") as string,
        branchId,
      })
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to update transaction")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this revenue entry?")) return
    setDeleting(true)
    try {
      await deleteRevenueTransaction(transaction.id)
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to delete transaction")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex">
        <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-primary">
          <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Revenue Entry</DialogTitle>
          <DialogDescription>
            Update the transaction details or correct the received amount.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 py-2">
          {error && <div className="text-xs font-semibold text-destructive">{error}</div>}

          {/* Branch Location Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="branchId" className="text-xs flex items-center gap-1 font-semibold">
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              Target Company Branch
            </Label>
            <Select name="branchId" defaultValue={transaction.branchId || "all"}>
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
              <Label htmlFor="amount" className="text-xs">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={transaction.originalAmount || transaction.amount}
                required
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs">Currency</Label>
              <Select name="currency" defaultValue={transaction.originalCurrency || transaction.currency || "GNF"}>
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
            <Label htmlFor="description" className="text-xs">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={transaction.description || "Revenue Entry"}
              required
              className="h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs">Category</Label>
              <Select name="category" defaultValue={transaction.category || "Voucher Sales"}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Voucher Sales">Voucher Sales</SelectItem>
                  <SelectItem value="Monthly Subscription">Monthly Subscription</SelectItem>
                  <SelectItem value="Hardware Sales">Hardware Sales</SelectItem>
                  <SelectItem value="Installation Fee">Installation Fee</SelectItem>
                  <SelectItem value="Other">Other Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod" className="text-xs">Payment Method</Label>
              <Select name="paymentMethod" defaultValue={transaction.paymentMethod || "Agent Cash"}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agent Cash">Agent Cash</SelectItem>
                  <SelectItem value="Mobile Money API">Mobile Money API</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customerName" className="text-xs">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={transaction.customerName || ""}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="receiptNumber" className="text-xs">Receipt #</Label>
              <Input
                id="receiptNumber"
                name="receiptNumber"
                defaultValue={transaction.receiptNumber || ""}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting || loading}
              className="h-9 px-3 text-xs"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1 h-3.5 w-3.5" />}
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="h-9 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading} className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
