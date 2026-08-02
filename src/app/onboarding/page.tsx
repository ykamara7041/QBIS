import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import OnboardingForm from "./onboarding-form"

export default async function OnboardingPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    // If not logged in, redirect to login (placeholder for now)
    redirect("/api/auth/signin")
  }

  // Check if they are already in an organization
  const existingMember = await db.organizationMember.findFirst({
    where: { userId: session.user.id }
  })

  if (existingMember) {
    // Already onboarded, send to dashboard
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="mx-auto w-full max-w-[550px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to QBIX</h1>
          <p className="text-muted-foreground">
            Let's get your organization set up so you can start tracking revenue.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
           <OnboardingForm />
        </div>
      </div>
    </div>
  )
}
