import { redirect } from "next/navigation"
import { auth } from "@/../auth"
import { db } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { LanguageProvider } from "@/components/providers/language-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userRecord = await db.user.findUnique({
    where: { id: session.user.id },
    select: { language: true }
  })

  const userLanguage = userRecord?.language || "en"

  return (
    <LanguageProvider initialLanguage={userLanguage}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar user={session.user} />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  )
}
