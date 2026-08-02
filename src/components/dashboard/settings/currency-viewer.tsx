"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

interface CurrencyViewerProps {
  totalGNF: number
}

// Fixed conversion rates from GNF to others for demo purposes
// In real app, this would fetch live API rates.
const GNF_RATES: Record<string, number> = {
  "GNF": 1,
  "USD": 1 / 8600,
  "EUR": 1 / 9300,
  "GBP": 1 / 11000,
  "LRD": 1 / 44,
  "GHS": 1 / 580,
  "NGN": 1 / 5.7,
  "XOF": 1 / 14.1
}

export function CurrencyViewer({ totalGNF }: CurrencyViewerProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  const convertedAmount = totalGNF * (GNF_RATES[selectedCurrency] || 1)

  return (
    <div className="space-y-4 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Global Currency Viewer</CardTitle>
          <CardDescription>
            Instantly view the organization's total aggregate revenue in any currency. Base ledger is GNF.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select target currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GNF">GNF - Guinean Franc (Base)</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="LRD">LRD - Liberian Dollar</SelectItem>
                <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                <SelectItem value="XOF">XOF - CFA Franc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Total Revenue Equivalent</span>
            <span className="text-3xl font-bold tracking-tight">
              {formatCurrency(convertedAmount, selectedCurrency)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
