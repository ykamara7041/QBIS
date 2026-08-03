import { redirect } from "next/navigation"

export default function DashboardAccountRedirectPage() {
  redirect("/dashboard/settings")
}
