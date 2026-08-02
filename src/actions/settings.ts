"use server"

import { db } from "@/lib/db"
import { auth } from "@/../auth"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateLanguage(userId: string, language: string) {
  const session = await auth()
  if (!session?.user || session.user.id !== userId) {
    throw new Error("Unauthorized")
  }

  await db.user.update({
    where: { id: userId },
    data: { language }
  })

  revalidatePath("/", "layout")
  return { success: true }
}

export async function addOrganizationMember(organizationId: string, email: string, name: string, role: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Check if current user is SUPER_ADMIN of this org
  const currentMember = await db.organizationMember.findUnique({
    where: { userId_organizationId: { userId: session.user.id, organizationId } }
  })
  
  if (!currentMember || currentMember.role !== "SUPER_ADMIN") {
    throw new Error("Only an Admin can add members.")
  }

  // Check if user already exists
  let user = await db.user.findUnique({ where: { email } })
  
  if (!user) {
    // Create the user with a default password for the demo
    const passwordHash = await bcrypt.hash("password123", 10)
    user = await db.user.create({
      data: {
        email,
        name,
        passwordHash
      }
    })
  }

  // Create the organization link
  await db.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organizationId
      }
    },
    update: {
      role: role as any
    },
    create: {
      userId: user.id,
      organizationId: organizationId,
      role: role as any
    }
  })

  console.log(`
  -------------------------------------------------
  📧 ADMIN ALERT EMAIL DISPATCHED
  -------------------------------------------------
  Subject: [SECURITY] New Member Added
  
  Body:
  Admin (${session.user.name || session.user.email}) added user ${email} with role ${role}.
  -------------------------------------------------
  `)

  revalidatePath("/dashboard/settings")
  return { success: true, message: "Member added successfully. Their password is 'password123'." }
}

export async function updateMemberRole(userId: string, organizationId: string, role: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Check if current user is SUPER_ADMIN of this org
  const currentMember = await db.organizationMember.findUnique({
    where: { userId_organizationId: { userId: session.user.id, organizationId } }
  })
  
  if (!currentMember || currentMember.role !== "SUPER_ADMIN") {
    throw new Error("Only an Admin can change roles.")
  }

  // Prevent admin from removing their own admin status easily if they are the last one
  // For simplicity, we just execute the update
  await db.organizationMember.update({
    where: { userId_organizationId: { userId, organizationId } },
    data: { role: role as any }
  })

  console.log(`
  -------------------------------------------------
  📧 ADMIN ALERT EMAIL DISPATCHED
  -------------------------------------------------
  Subject: [SECURITY] Member Role Changed
  
  Body:
  Admin (${session.user.name || session.user.email}) changed role of member ${userId} to ${role}.
  -------------------------------------------------
  `)

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function removeMember(userId: string, organizationId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Check if current user is SUPER_ADMIN of this org
  const currentMember = await db.organizationMember.findUnique({
    where: { userId_organizationId: { userId: session.user.id, organizationId } }
  })
  
  if (!currentMember || currentMember.role !== "SUPER_ADMIN") {
    throw new Error("Only an Admin can remove members.")
  }

  if (userId === session.user.id) {
    throw new Error("You cannot remove yourself from the organization this way.")
  }

  await db.organizationMember.delete({
    where: { userId_organizationId: { userId, organizationId } }
  })

  console.log(`
  -------------------------------------------------
  📧 ADMIN ALERT EMAIL DISPATCHED
  -------------------------------------------------
  Subject: [SECURITY] Member Removed
  
  Body:
  Admin (${session.user.name || session.user.email}) removed member ${userId} from the organization.
  -------------------------------------------------
  `)

  revalidatePath("/dashboard/settings")
  return { success: true }
}
