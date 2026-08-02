"use client"

import * as React from "react"
import { useActionState } from "react"
import { createOrganization } from "@/actions/org"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2Icon, GlobeIcon, Loader2 } from "lucide-react"

export default function OnboardingForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await createOrganization(formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <div className="relative">
            <Building2Icon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="name" name="name" className="pl-9" placeholder="Acme Corp" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" name="industry" placeholder="e.g. Software, Retail, NGO" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <GlobeIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Select name="country" required defaultValue="Guinea">
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Liberia">Liberia</SelectItem>
                  <SelectItem value="Guinea">Guinea</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCurrency">Default Currency</Label>
            <Select name="defaultCurrency" required defaultValue="GNF">
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LRD">LRD (Liberian Dollar)</SelectItem>
                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
                <SelectItem value="GNF">GNF (Guinean Franc)</SelectItem>
                <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                <SelectItem value="XOF">XOF (CFA Franc)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Organization...
          </>
        ) : (
          "Create Organization"
        )}
      </Button>
    </form>
  )
}
