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
      } catch (e) {
        setInsights("Unable to refresh AI insights right now. Please try again shortly.")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-md bg-muted/50 p-4 shadow-sm border border-border/50">
        <BotIcon className="h-6 w-6 text-primary mt-0.5 shrink-0" />
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold leading-none">Gemini Performance Summary</p>
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
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
