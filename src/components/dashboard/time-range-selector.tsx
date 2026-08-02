"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/components/providers/language-provider"

export function TimeRangeSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const currentRange = searchParams.get("range") || "year"

  const handleRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("range", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {t("dashboard.time_range") || "Time Range:"}
      </span>
      <Select value={currentRange} onValueChange={(val) => handleRangeChange(val || "year")}>
        <SelectTrigger className="w-[150px] bg-background">
          <SelectValue placeholder="Select Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">{t("dashboard.range.today") || "Today"}</SelectItem>
          <SelectItem value="week">{t("dashboard.range.week") || "This Week"}</SelectItem>
          <SelectItem value="month">{t("dashboard.range.month") || "This Month"}</SelectItem>
          <SelectItem value="year">{t("dashboard.range.year") || "This Year"}</SelectItem>
          <SelectItem value="all">{t("dashboard.range.all") || "All Time"}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
