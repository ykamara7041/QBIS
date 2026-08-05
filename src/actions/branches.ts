"use server"

import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  code: z.string().optional(),
  location: z.string().optional(),
  managerName: z.string().optional(),
  targetBudget: z.number().nonnegative().optional(),
})

async function getActiveMember() {
  const session = await auth()
  const cookieStore = await cookies()
  const fallbackUserId = cookieStore.get("qbix_session")?.value
  const activeUserId = session?.user?.id || fallbackUserId

  if (!activeUserId) throw new Error("Unauthorized")

  let member = await db.organizationMember.findFirst({
    where: { userId: activeUserId },
    include: { organization: true }
  })

  if (!member) {
    let org = await db.organization.findFirst()
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "QBIX Organization",
          defaultCurrency: "GNF"
        }
      })
    }
    member = await db.organizationMember.create({
      data: {
        userId: activeUserId,
        organizationId: org.id,
        role: "SUPER_ADMIN"
      },
      include: { organization: true }
    })
  }

  return member
}

export async function createBranch(data: {
  name: string
  code?: string
  location?: string
  managerName?: string
  targetBudget?: number
}) {
  const member = await getActiveMember()
  if (member.role !== "SUPER_ADMIN" && member.role !== "ORG_ADMIN") {
    throw new Error("Only Administrators can manage company branches")
  }

  const validated = branchSchema.parse(data)

  const newBranch = await db.branch.create({
    data: {
      organizationId: member.organizationId,
      name: validated.name,
      code: validated.code || null,
      location: validated.location || null,
      managerName: validated.managerName || null,
      targetBudget: validated.targetBudget || 0,
    }
  })

  revalidatePath("/dashboard/branches")
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/revenue")
  return newBranch
}

export async function updateBranch(id: string, data: {
  name: string
  code?: string
  location?: string
  managerName?: string
  targetBudget?: number
}) {
  const member = await getActiveMember()
  if (member.role !== "SUPER_ADMIN" && member.role !== "ORG_ADMIN") {
    throw new Error("Only Administrators can manage company branches")
  }

  const validated = branchSchema.parse(data)

  const updated = await db.branch.update({
    where: { id },
    data: {
      name: validated.name,
      code: validated.code || null,
      location: validated.location || null,
      managerName: validated.managerName || null,
      targetBudget: validated.targetBudget || 0,
    }
  })

  revalidatePath("/dashboard/branches")
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/revenue")
  return updated
}

export async function deleteBranch(id: string) {
  const member = await getActiveMember()
  if (member.role !== "SUPER_ADMIN" && member.role !== "ORG_ADMIN") {
    throw new Error("Only Administrators can manage company branches")
  }

  await db.branch.delete({
    where: { id }
  })

  revalidatePath("/dashboard/branches")
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/revenue")
  return { success: true }
}

export async function getOrganizationBranches() {
  const member = await getActiveMember()
  let branches = await db.branch.findMany({
    where: { organizationId: member.organizationId },
    orderBy: { name: "asc" }
  })

  // Auto-seed default branches if zero exist
  if (branches.length === 0) {
    const defaultBranches = [
      { name: "Conakry Main Branch", code: "CKR-01", location: "Kaloum, Conakry", managerName: "Mamadou Diallo", targetBudget: 500000000 },
      { name: "Kankan Branch", code: "KKN-02", location: "Kankan Central", managerName: "Fanta Camara", targetBudget: 250000000 },
      { name: "Labé Regional Branch", code: "LBE-03", location: "Labé Ville", managerName: "Ibrahima Bah", targetBudget: 150000000 },
    ]

    for (const b of defaultBranches) {
      await db.branch.create({
        data: {
          organizationId: member.organizationId,
          ...b
        }
      })
    }

    branches = await db.branch.findMany({
      where: { organizationId: member.organizationId },
      orderBy: { name: "asc" }
    })
  }

  return branches
}
