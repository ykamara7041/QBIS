"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useLanguage } from "@/components/providers/language-provider"

interface ReportTx {
  id: string
  date: Date | string
  description?: string | null
  category?: string | null
  originalAmount?: number | null
  originalCurrency?: string | null
  amount: number
  currency: string
  approvalStatus: string
}

interface ReportsContentProps {
  totalApproved: number
  pendingTotal: number
  defaultCurrency: string
  transactions: ReportTx[]
}

export function ReportsContent({ totalApproved, pendingTotal, defaultCurrency, transactions }: ReportsContentProps) {
  const { t } = useLanguage()

  const handleExportCSV = () => {
    const headers = "Date,Description,Category,Original Amount,Original Currency,Converted Amount,Converted Currency,Status\n"
    const rows = transactions.map(tTx => 
      `"${new Date(tTx.date).toLocaleDateString()}","${tTx.description || ''}","${tTx.category || ''}",${tTx.originalAmount || tTx.amount},"${tTx.originalCurrency || tTx.currency}",${tTx.amount},"${tTx.currency}","${tTx.approvalStatus}"`
    ).join("\n")
    
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qbix_financial_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
        <p className="text-muted-foreground">{t("reports.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("reports.total_approved")}</CardDescription>
            <CardTitle className="text-2xl font-bold">{formatCurrency(totalApproved, defaultCurrency)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("reports.pending_unapproved")}</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">{formatCurrency(pendingTotal, defaultCurrency)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("reports.master_ledger")}</CardTitle>
            <CardDescription>{t("reports.all_recorded")}</CardDescription>
          </div>
          <Button onClick={handleExportCSV} className="gap-2">
            <DownloadIcon className="h-4 w-4" /> {t("reports.export_csv")}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("reports.date")}</TableHead>
                <TableHead>{t("reports.description")}</TableHead>
                <TableHead>{t("reports.category")}</TableHead>
                <TableHead>{t("reports.original")}</TableHead>
                <TableHead>{t("reports.converted")} ({defaultCurrency})</TableHead>
                <TableHead>{t("reports.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{tx.description || "N/A"}</TableCell>
                  <TableCell>{tx.category || "Uncategorized"}</TableCell>
                  <TableCell>
                    {tx.originalCurrency || tx.currency} {(tx.originalAmount || tx.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(tx.amount, defaultCurrency)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tx.approvalStatus === "APPROVED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {tx.approvalStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
