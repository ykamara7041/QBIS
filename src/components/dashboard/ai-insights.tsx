"use client"

import { useState, useTransition } from "react"
import { BotIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AiInsightsClientProps {
  initialInsights: string
  dataContext: string
}

export function AiInsightsClient({ initialInsights, dataContext }: AiInsightsClientProps) {
  const [insights, setInsights] = useState(initialInsights)
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const { generateFinancialInsights } = await import("@/lib/ai")
        const newInsights = await generateFinancialInsights(dataContext)
        setInsights(newInsights)
      } catch {
        setInsights("Unable to refresh AI insights right now. Please try again shortly.")
      }
    })
  }

  return (
    <div>
      <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4 dark:border-violet-500/15 dark:bg-violet-500/10">
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold leading-none"><BotIcon className="h-4 w-4 text-violet-600" /> Performance Summary</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isPending}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
              {isPending ? "Analyzing..." : "Refresh AI"}
            </Button>
          </div>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {insights}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function AiInsightsFeed({ dataContext }: { dataContext: string }) {
  const { generateFinancialInsights } = await import("@/lib/ai")
  const insights = await generateFinancialInsights(dataContext)
  return <AiInsightsClient initialInsights={insights} dataContext={dataContext} />
}
