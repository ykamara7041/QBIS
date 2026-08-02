import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/dashboard/settings/user-management"
import { LanguagePreferences } from "@/components/dashboard/settings/language-preferences"
import { CurrencyViewer } from "@/components/dashboard/settings/currency-viewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  // Get current user details including language
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id }
  })

  // Get user's organization and members
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
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set organization preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Update your company details and core settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue={currentMember.organization.name} disabled={!isAdmin} />
                {!isAdmin && <p className="text-[0.8rem] text-muted-foreground">Only Admins can change this.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input id="currency" defaultValue={currentMember.organization.defaultCurrency} disabled={!isAdmin} />
              </div>
              {isAdmin && <Button>Save Changes</Button>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <UserManagement 
                organizationId={currentMember.organizationId} 
                members={membersList} 
                isAdmin={isAdmin} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-6">
          <CurrencyViewer totalGNF={totalGNF} />
          
          <Card>
            <CardContent className="pt-6">
              <LanguagePreferences 
                userId={currentUser.id} 
                currentLanguage={currentUser.language} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
