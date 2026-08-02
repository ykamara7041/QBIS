"use server"

import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const targetSchema = z.object({
  title: z.string().min(3),
  writtenGoal: z.string().optional(),
  targetAmount: z.number().positive(),
  currency: z.string().min(3).max(3),
  startDate: z.string(),
  endDate: z.string(),
})

export async function createRevenueGoal(data: z.infer<typeof targetSchema>) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id }
  })
  
  if (!member || (member.role !== "SUPER_ADMIN" && member.role !== "FINANCE_MANAGER")) {
    throw new Error("Only an Admin or Finance Manager can set organization targets.")
  }

  await db.revenueGoal.create({
    data: {
      organizationId: member.organizationId,
      title: data.title,
      writtenGoal: data.writtenGoal,
      targetAmount: data.targetAmount,
      currency: "GNF", // Enforce GNF base
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "ACTIVE"
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/targets")
  return { success: true }
}
