import { redirect } from "next/navigation"

export default function DashboardSuperAdminRedirectPage() {
  redirect("/dashboard/settings")
}
