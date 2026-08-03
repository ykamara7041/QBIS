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

  // Fetch recent revenue transactions and active goals for rich AI context
  const transactions = await db.revenueTransaction.findMany({
    where: {
      organizationId: member.organizationId,
      approvalStatus: "APPROVED"
    },
    orderBy: { date: "desc" },
    take: 20
  })

  const goals = await db.revenueGoal.findMany({
    where: {
      organizationId: member.organizationId
    }
  })

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  const aiContext = `
Organization: ${member.organization.name}
Default Currency: ${member.organization.defaultCurrency}
Total Logged Revenue (Recent Approved): ${totalRevenue} ${member.organization.defaultCurrency}
Recent Transactions Count: ${transactions.length}
Active Goals: ${goals.map(g => `${g.title}: ${g.currentAmount}/${g.targetAmount} ${g.currency} (${g.status})`).join("; ") || "None set yet"}
Recent Sample Transactions: ${transactions.slice(0, 5).map(t => `${t.amount} ${t.currency} [${t.category || "Uncategorized"}] on ${new Date(t.date).toLocaleDateString()}`).join("; ") || "No recent transactions"}
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
