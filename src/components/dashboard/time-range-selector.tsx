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

  const rangeLabels: Record<string, string> = {
    today: t("dashboard.range.today"),
    week: t("dashboard.range.week"),
    month: t("dashboard.range.month"),
    year: t("dashboard.range.year"),
    all: t("dashboard.range.all")
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {t("dashboard.time_range") || "Période :"}
      </span>
      <Select value={currentRange} onValueChange={(val) => handleRangeChange(val || "year")}>
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue>{rangeLabels[currentRange] || currentRange}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">{t("dashboard.range.today")}</SelectItem>
          <SelectItem value="week">{t("dashboard.range.week")}</SelectItem>
          <SelectItem value="month">{t("dashboard.range.month")}</SelectItem>
          <SelectItem value="year">{t("dashboard.range.year")}</SelectItem>
          <SelectItem value="all">{t("dashboard.range.all")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
