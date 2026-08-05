import { redirect } from "next/navigation"

export default function DashboardUserRedirectPage() {
  redirect("/dashboard/settings")
}
