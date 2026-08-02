import { BotIcon } from "lucide-react"
import { generateFinancialInsights } from "@/lib/ai"

export async function AiInsightsFeed({ dataContext }: { dataContext: string }) {
  const insights = await generateFinancialInsights(dataContext)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-md bg-muted/50 p-4 shadow-sm border border-border/50">
        <BotIcon className="h-6 w-6 text-primary mt-0.5 shrink-0" />
        <div className="space-y-2 w-full">
          <p className="text-sm font-semibold leading-none">Gemini Performance Summary</p>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {insights}
          </div>
        </div>
      </div>
    </div>
  )
}
