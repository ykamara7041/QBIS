"use client"

import { useState } from "react"
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
import { useLanguage } from "@/components/providers/language-provider"

export default function AddRevenuePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Hardcoded for demo purposes since we don't have context wrapping yet
  // In a real app, we'd fetch the user's active org ID
  // We'll let the server handle it by fetching the first org on submit, or we pass it properly later.
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
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
      })
      router.push("/dashboard/revenue")
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("revenue.add.title")}</CardTitle>
          <CardDescription>
            {t("revenue.add.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && <div className="text-sm text-destructive">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t("revenue.add.amount")}</Label>
                <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t("revenue.add.currency")}</Label>
                <Select name="currency" defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="LRD">LRD - Liberian Dollar</SelectItem>
                    <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                    <SelectItem value="GNF">GNF - Guinean Franc</SelectItem>
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
            <Button type="submit" disabled={loading}>
              {loading ? t("revenue.add.submitting") : t("revenue.add.submit")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
