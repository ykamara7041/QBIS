"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement, UserMember } from "@/components/dashboard/settings/user-management"
import { LanguagePreferences } from "@/components/dashboard/settings/language-preferences"
import { CurrencyViewer } from "@/components/dashboard/settings/currency-viewer"
import { AccountSettings } from "@/components/dashboard/settings/account-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"
import { useSearchParams } from "next/navigation"

interface SettingsContentProps {
  organizationName: string
  defaultCurrency: string
  isAdmin: boolean
  userId: string
  userEmail: string
  currentLanguage: string
  membersList: UserMember[]
  organizationId: string
  totalGNF: number
}

export function SettingsContent({
  organizationName,
  defaultCurrency,
  isAdmin,
  userId,
  userEmail,
  currentLanguage,
  membersList,
  organizationId,
  totalGNF,
}: SettingsContentProps) {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "preferences" ? "preferences" : searchParams.get("tab") === "security" ? "security" : "general"

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
          <TabsTrigger value="general">{t("settings.tab_general")}</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="team">{t("settings.tab_team")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("settings.tab_preferences")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.org_info")}</CardTitle>
              <CardDescription>{t("settings.org_info_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="orgName">{t("settings.org_name")}</Label>
                <Input id="orgName" defaultValue={organizationName} disabled={!isAdmin} />
                {!isAdmin && <p className="text-[0.8rem] text-muted-foreground">{t("settings.only_admin")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t("settings.default_currency")}</Label>
                <Input id="currency" defaultValue={defaultCurrency} disabled={!isAdmin} />
              </div>
              {isAdmin && <Button>{t("settings.save_changes")}</Button>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account & Admin Password Settings</CardTitle>
              <CardDescription>Update your email address or change your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettings user={{ email: userEmail }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <UserManagement organizationId={organizationId} members={membersList} isAdmin={isAdmin} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-6">
          <CurrencyViewer totalGNF={totalGNF} />
          <Card>
            <CardContent className="pt-6">
              <LanguagePreferences userId={userId} currentLanguage={currentLanguage} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
