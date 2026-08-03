"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateLanguage } from "@/actions/settings"

interface LanguagePreferencesProps {
  userId: string
  currentLanguage: string
}

export function LanguagePreferences({ userId, currentLanguage }: LanguagePreferencesProps) {
  const [language, setLanguage] = useState(currentLanguage)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)
    try {
      await updateLanguage(userId, language)
      setSuccess(true)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      alert("Failed to update language preference")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-lg font-medium">Display Language Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Select your preferred display language for the entire QBIX application.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>System Language</Label>
          <Select value={language} onValueChange={(val) => setLanguage(val || "en")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="fr">Français (French)</SelectItem>
              <SelectItem value="es">Español (Spanish)</SelectItem>
              <SelectItem value="de">Deutsch (German)</SelectItem>
              <SelectItem value="zh">中文 (Chinese)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground">
            This updates all user interface components, metrics, headers, and actions.
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading || language === currentLanguage}>
          {loading ? "Applying Language..." : "Save Preferences"}
        </Button>
        {success && <span className="ml-4 text-sm font-semibold text-green-600">Language updated! Refreshing page...</span>}
      </div>
    </div>
  )
}
