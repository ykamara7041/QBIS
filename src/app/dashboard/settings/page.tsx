import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { SettingsContent } from "@/components/dashboard/settings/settings-content"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const currentUser = await db.user.findUnique({
    where: { id: session.user.id }
  })

  const currentMember = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
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

  if (!currentMember || !currentUser) {
    return <div>No organization found or invalid user state.</div>
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
      currentLanguage={currentUser.language}
      membersList={membersList}
      organizationId={currentMember.organizationId}
      totalGNF={totalGNF}
    />
  )
}
