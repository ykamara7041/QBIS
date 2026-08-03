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
      <div className="min-h-screen w-full bg-background md:grid md:grid-cols-[248px_minmax(0,1fr)]">
        <div className="hidden min-h-screen md:block">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar user={session.user} />
          <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 p-4 md:p-6 xl:p-8">
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  )
}
