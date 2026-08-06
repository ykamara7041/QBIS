import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { SettingsContent } from "@/components/dashboard/settings/settings-content"

export default async function SettingsPage() {
  const session = await auth()
  const cookieStore = await cookies()
  const fallbackUserId = cookieStore.get("qbix_session")?.value
  const activeUserId = session?.user?.id || fallbackUserId

  if (!activeUserId) {
    redirect("/login")
  }

  const currentUser = await db.user.findUnique({
    where: { id: activeUserId }
  })

  let currentMember = await db.organizationMember.findFirst({
    where: { userId: activeUserId },
    include: { 
      organization: {
        include: {
          members: {
            include: { user: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      } 
    }
  })

  // Auto-provision organization & member if missing
  if (!currentMember && activeUserId) {
    let org = await db.organization.findFirst()
    if (!org) {
      org = await db.organization.create({
        data: {
          name: `${currentUser?.name || 'User'}'s Organization`,
          defaultCurrency: "GNF"
        }
      })
    }

    currentMember = await db.organizationMember.create({
      data: {
        userId: activeUserId,
        organizationId: org.id,
        role: "SUPER_ADMIN"
      },
      include: { 
        organization: {
          include: {
            members: {
              include: { user: true },
              orderBy: { createdAt: 'asc' }
            }
          }
        } 
      }
    })
  }

  if (!currentMember || !currentUser) {
    redirect("/login")
  }

  const isAdmin = currentMember.role === "SUPER_ADMIN"
  const membersList = currentMember.organization.members.map(m => ({
    id: m.userId,
    name: m.user.name,
    email: m.user.email,
    role: m.role
  }))

  const transactions = await db.revenueTransaction.findMany({
    where: { 
      organizationId: currentMember.organizationId,
      approvalStatus: "APPROVED"
    }
  })
  const totalGNF = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <SettingsContent
      organizationName={currentMember.organization.name}
      defaultCurrency={currentMember.organization.defaultCurrency}
      isAdmin={isAdmin}
      userId={currentUser.id}
      userEmail={currentUser.email}
      currentLanguage={currentUser.language}
      membersList={membersList}
      organizationId={currentMember.organizationId}
      totalGNF={totalGNF}
    />
  )
}
