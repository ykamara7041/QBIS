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
import { approveTransaction } from "@/actions/revenue"
import { formatCurrency } from "@/lib/utils"

export function ApprovalTable({ transactions }: { transactions: any[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoading(id)
    try {
      await approveTransaction(id)
    } catch (err) {
      alert("Failed to approve transaction")
    } finally {
      setLoading(null)
    }
  }

  if (transactions.length === 0) {
    return <div className="text-sm text-muted-foreground py-6 text-center">No pending transactions.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Original</TableHead>
            <TableHead>Converted (USD)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium">{tx.description}</TableCell>
              <TableCell>{tx.category}</TableCell>
              <TableCell>
                {tx.originalAmount && tx.originalCurrency 
                  ? `${tx.originalAmount.toLocaleString()} ${tx.originalCurrency}`
                  : "-"}
              </TableCell>
              <TableCell>{formatCurrency(tx.amount)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleApprove(tx.id)}
                  disabled={loading === tx.id}
                >
                  {loading === tx.id ? "..." : "Approve"}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
