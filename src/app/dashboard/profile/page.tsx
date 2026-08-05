import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { ProfileContent } from "@/components/dashboard/profile-content"

export default async function DashboardProfilePage() {
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
    include: { organization: true }
  })

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
      include: { organization: true }
    })
  }

  if (!currentUser) {
    redirect("/login")
  }

  return (
    <ProfileContent
      user={{
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
        language: currentUser.language,
        role: currentMember?.role || "SUPER_ADMIN",
        organizationName: currentMember?.organization?.name || "QBIX Organization"
      }}
    />
  )
}
