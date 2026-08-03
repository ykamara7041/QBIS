import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { TargetsContent } from "@/components/dashboard/targets/targets-content"

export default async function TargetsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  })

  if (!member) {
    return <div>No organization found.</div>
  }

  const goals = await db.revenueGoal.findMany({
    where: { organizationId: member.organizationId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <TargetsContent
      organizationName={member.organization.name}
      defaultCurrency={member.organization.defaultCurrency || "GNF"}
      goals={goals}
    />
  )
}
