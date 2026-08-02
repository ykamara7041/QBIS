import { auth } from "@/../auth"
import { db } from "@/lib/db"
import { AiChatClient } from "@/components/dashboard/ai-chat-client"
import { redirect } from "next/navigation"

export default async function AiPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const member = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  })

  if (!member) {
    return <div>Access Denied</div>
  }

  const aiContext = `
Organization: ${member.organization.name}
Default Currency: ${member.organization.defaultCurrency}
`

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground">
          Chat with your financial assistant about your organization's performance.
        </p>
      </div>

      <AiChatClient dataContext={aiContext} />
    </div>
  )
}
