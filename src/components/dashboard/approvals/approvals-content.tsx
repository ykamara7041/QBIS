"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { approveTransaction } from "@/actions/revenue"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"

interface PendingTx {
  id: string
  description?: string | null
  originalAmount?: number | null
  originalCurrency?: string | null
  amount: number
  currency: string
  date: Date | string
}

interface ApprovalsContentProps {
  pendingTransactions: PendingTx[]
}

export function ApprovalsContent({ pendingTransactions }: ApprovalsContentProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoadingId(id)
    try {
      await approveTransaction(id)
      router.refresh()
    } catch (err: any) {
      alert(err?.message || "Failed to approve transaction")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("approvals.title")}</h1>
        <p className="text-muted-foreground">{t("approvals.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("approvals.pending_txs")}</CardTitle>
          <CardDescription>{t("approvals.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTransactions.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">{t("approvals.none")}</div>
          ) : (
            <div className="divide-y">
              {pendingTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-sm">{tx.description || "Revenue Entry"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-sm">{tx.originalCurrency || tx.currency} {(tx.originalAmount || tx.amount).toLocaleString()}</div>
                    </div>
                    <Button size="sm" onClick={() => handleApprove(tx.id)} disabled={loadingId === tx.id}>
                      {loadingId === tx.id ? "Approving..." : t("approvals.approve_btn")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
