"use server"

import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const revenueSchema = z.object({
  originalAmount: z.number().positive(),
  originalCurrency: z.string().min(3).max(3),
  description: z.string().min(3),
  category: z.string().optional(),
  paymentMethod: z.string().optional(),
  customerName: z.string().optional(),
  receiptNumber: z.string().optional(),
  agentName: z.string().optional(),
})

export async function addRevenueTransaction(data: z.infer<typeof revenueSchema>) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Validate member access and get org ID automatically
  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  })
  
  if (!member) throw new Error("Unauthorized access to organization")
  
  const organizationId = member.organizationId
  const defaultCurrency = member.organization?.defaultCurrency || "GNF"
  
  let convertedAmount = data.originalAmount
  
  if (data.originalCurrency !== defaultCurrency) {
    // Standard conversion rates relative to GNF
    const ratesToGNF: Record<string, number> = {
      "USD": 8600,
      "EUR": 9300,
      "GBP": 11000,
      "LRD": 44,
      "GHS": 580,
      "NGN": 5.7,
      "XOF": 14.1,
      "GNF": 1
    }

    const sourceRateToGNF = ratesToGNF[data.originalCurrency] || 1
    const targetRateToGNF = ratesToGNF[defaultCurrency] || 1

    // Convert from original currency to GNF, then to defaultCurrency
    const amountInGNF = data.originalAmount * sourceRateToGNF
    convertedAmount = amountInGNF / targetRateToGNF
  }

  // Insert the transaction (APPROVED directly if added by user)
  await db.revenueTransaction.create({
    data: {
      organizationId: organizationId,
      originalAmount: data.originalAmount,
      originalCurrency: data.originalCurrency,
      amount: convertedAmount,
      currency: defaultCurrency,
      description: data.description,
      category: data.category,
      paymentMethod: data.paymentMethod,
      customerName: data.customerName,
      receiptNumber: data.receiptNumber,
      agentName: data.agentName,
      approvalStatus: "APPROVED",
      status: "COMPLETED"
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/revenue")
  return { success: true }
}

export async function approveTransaction(transactionId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  
  const tx = await db.revenueTransaction.update({
    where: { id: transactionId },
    data: { approvalStatus: "APPROVED" },
    include: { organization: true }
  })
  
  console.log(`
  -------------------------------------------------
  📧 ADMIN ALERT EMAIL DISPATCHED
  -------------------------------------------------
  To: org-admins@${tx.organization.name.toLowerCase().replace(/\s/g, "")}.com
  Subject: [SECURITY] Revenue Transaction Approved
  
  Body:
  Admin (${session.user.name || session.user.email}) just approved a transaction of ${tx.amount.toLocaleString()} ${tx.currency}.
  Description: ${tx.description}
  -------------------------------------------------
  `)
  
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/revenue")
  revalidatePath("/dashboard/approvals")
  return { success: true }
}
