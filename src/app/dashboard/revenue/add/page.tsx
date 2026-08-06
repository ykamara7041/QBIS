"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addRevenueTransaction } from "@/actions/revenue"
import { getOrganizationBranches } from "@/actions/branches"
import { useLanguage } from "@/components/providers/language-provider"
import { Building2 } from "lucide-react"

interface BranchItem {
  id: string
  name: string
  code?: string | null
  location?: string | null
}

export default function AddRevenuePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [branches, setBranches] = useState<BranchItem[]>([])

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
      await addRevenueTransaction({
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
      router.push("/dashboard/revenue")
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Failed to record revenue")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("revenue.add.title")}</CardTitle>
          <CardDescription>
            {t("revenue.add.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && <div className="text-sm font-semibold text-destructive">{error}</div>}

            {/* Branch Selector */}
            <div className="space-y-2 rounded-xl bg-blue-50/50 p-4 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
              <Label htmlFor="branchId" className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-200">
                <Building2 className="h-4 w-4 text-blue-600" />
                Target Company Branch *
              </Label>
              <Select name="branchId" defaultValue="all">
                <SelectTrigger className="h-11 bg-background font-medium">
                  <SelectValue placeholder="Select target branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🏢 Head Office / All Branches (Unassigned)</SelectItem>
                  {branches.map(b => (
                    <SelectItem key={b.id} value={b.id}>
                      📍 {b.name} {b.code ? `(${b.code})` : ""} {b.location ? `• ${b.location}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Specifying the branch ensures this revenue entry directly updates that branch's performance metrics.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t("revenue.add.amount")}</Label>
                <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t("revenue.add.currency")}</Label>
                <Select name="currency" defaultValue="GNF">
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="description">{t("revenue.add.desc")}</Label>
              <Input id="description" name="description" required placeholder="e.g. Q3 SaaS Subscription Renewal" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t("revenue.add.category")}</Label>
                <Select name="category" defaultValue="Voucher Sales">
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">{t("revenue.add.payment")}</Label>
                <Select name="paymentMethod" defaultValue="Agent Cash">
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">{t("revenue.add.customer")}</Label>
                <Input id="customerName" name="customerName" placeholder="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">{t("revenue.add.receipt")}</Label>
                <Input id="receiptNumber" name="receiptNumber" placeholder="INV-2024-001" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentName">{t("revenue.add.agent") || "Sales Agent Name"}</Label>
              <Input id="agentName" name="agentName" placeholder="e.g. Agent Amadou" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("revenue.add.notes")}</Label>
              <Textarea id="notes" name="notes" placeholder="Optional details..." />
            </div>

          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>{t("revenue.add.cancel")}</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-6">
              {loading ? t("revenue.add.submitting") : t("revenue.add.submit")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
