"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Shield, Building2, Globe, DollarSign, LogOut, Check, Key } from "lucide-react"
import { logoutUser } from "@/actions/auth"
import { useLanguage } from "@/components/providers/language-provider"

interface ProfileContentProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    language?: string
    role?: string
    organizationName?: string
  }
}

export function ProfileContent({ user }: ProfileContentProps) {
  const { t, language } = useLanguage()
  const [loadingLogout, setLoadingLogout] = useState(false)

  const handleLogout = async () => {
    setLoadingLogout(true)
    await logoutUser()
    window.location.href = "/login"
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-md">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 ring-4 ring-white/30 shadow-lg">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name || "Admin User"}</h1>
              <p className="text-blue-100 text-sm mt-0.5">{user.email}</p>
              <div className="mt-2 inline-flex items-center rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur">
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                {user.role || "SUPER_ADMIN"}
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="h-11 rounded-xl bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold shadow-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {loadingLogout ? "Logging out..." : "Log Out of QBIX"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Details */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" /> Account Overview
            </CardTitle>
            <CardDescription>Your personal profile details and credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Full Name</Label>
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                {user.name || "N/A"}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email Address</Label>
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email || "N/A"}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Assigned Role</Label>
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm font-medium">
                <Shield className="h-4 w-4 text-blue-600" />
                {user.role || "SUPER_ADMIN"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" /> Workspace & Organization
            </CardTitle>
            <CardDescription>Information about your associated organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Organization Name</Label>
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm font-medium">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {user.organizationName || "QBIX Organization"}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Display Language</Label>
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm font-medium justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{language === "en" ? "English" : language === "fr" ? "Français" : language}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Default Currency</Label>
              <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                GNF (Guinean Franc)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Action Footer */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-600" /> Security & Account Actions
          </CardTitle>
          <CardDescription>Manage your active session and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">Sign Out of Session</p>
            <p className="text-xs text-muted-foreground">Safely log out of your admin account and return to the sign-in screen.</p>
          </div>
          <Button
            onClick={handleLogout}
            disabled={loadingLogout}
            variant="destructive"
            className="h-11 rounded-xl px-6 font-medium shadow-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {loadingLogout ? "Logging out..." : "Log Out Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
