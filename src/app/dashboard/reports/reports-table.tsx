"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { DownloadIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/components/providers/language-provider"

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

const CSV_HEADERS = {
  en: ["Date", "Description", "Category", "Payment Method", "Original Amount", "Original Currency", "Converted Amount", "Converted Currency", "Status"],
  es: ["Fecha", "Descripción", "Categoría", "Método de Pago", "Monto Original", "Moneda Original", "Monto Convertido", "Moneda Convertida", "Estado"],
  fr: ["Date", "Description", "Catégorie", "Mode de Paiement", "Montant Original", "Devise d'origine", "Montant Converti", "Devise Convertie", "Statut"],
  de: ["Datum", "Beschreibung", "Kategorie", "Zahlungsmethode", "Ursprünglicher Betrag", "Ursprungswährung", "Umgerechneter Betrag", "Umgerechnete Währung", "Status"],
  zh: ["日期", "描述", "类别", "付款方式", "原始金额", "原始货币", "转换金额", "转换货币", "状态"]
}

export function ReportsTable({ transactions, defaultCurrency }: { transactions: any[], defaultCurrency: string }) {
  const { language } = useLanguage()
  const [reportLang, setReportLang] = useState<string>(language)
  const [reportCurrency, setReportCurrency] = useState<string>("GNF")

  const handleExportCSV = () => {
    if (transactions.length === 0) return

    const headers = CSV_HEADERS[reportLang as keyof typeof CSV_HEADERS] || CSV_HEADERS["en"]
    const rate = GNF_RATES[reportCurrency] || 1

    const csvContent = [
      headers.join(","),
      ...transactions.map(tx => {
        // Base ledger is GNF. So tx.amount is always GNF.
        const targetAmount = tx.amount * rate

        return [
          new Date(tx.date).toLocaleDateString(),
          `"${tx.description?.replace(/"/g, '""') || ""}"`,
          tx.category || "",
          tx.paymentMethod || "",
          tx.originalAmount || "",
          tx.originalCurrency || "",
          targetAmount.toFixed(2),
          reportCurrency,
          tx.approvalStatus
        ].join(",")
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `revenue_report_${reportLang}_${reportCurrency}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4">
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Report Lang:</span>
          <Select value={reportLang} onValueChange={setReportLang}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Report Currency:</span>
          <Select value={reportCurrency} onValueChange={setReportCurrency}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GNF">GNF</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExportCSV}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Converted ({defaultCurrency})</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No transactions found.</TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>
                    {tx.originalAmount && tx.originalCurrency 
                      ? `${tx.originalAmount.toLocaleString()} ${tx.originalCurrency}`
                      : "-"}
                  </TableCell>
                  <TableCell>{formatCurrency(tx.amount, tx.currency)}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      tx.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {tx.approvalStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
