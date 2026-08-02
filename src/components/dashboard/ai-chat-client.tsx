"use client"

import { useChat } from "ai/react"
import { BotIcon, SparklesIcon, UserIcon, Loader2 } from "lucide-react"

export function AiChatClient({ dataContext }: { dataContext: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { dataContext },
    initialMessages: [
      {
        id: "greeting",
        role: "assistant",
        content: `Hello! I'm your QBIX AI Assistant. I have analyzed your organization's recent transaction history and active goals.\n\nHow can I help you analyze your revenue today? You can ask me things like:\n- "What was our highest earning category this quarter?"\n- "Are we on track to hit our Q3 software subscription target?"\n- "Generate a summary report for last month's income."`
      }
    ]
  })

  return (
    <div className="flex-1 border rounded-xl flex flex-col bg-muted/10 overflow-hidden shadow-sm relative">
      <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-4 max-w-[80%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/20"}`}>
              {m.role === "user" ? <UserIcon className="w-5 h-5" /> : <BotIcon className="w-5 h-5 text-primary" />}
            </div>
            <div className={`border p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card rounded-tl-sm whitespace-pre-wrap"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-4 max-w-[80%] self-start">
            <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
              <BotIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-card border p-4 rounded-2xl rounded-tl-sm text-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-muted-foreground">Analyzing data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Ask a question about your finances..." 
            value={input || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-12 py-3 rounded-full border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1.5 p-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:opacity-90 disabled:opacity-50"
            disabled={isLoading || !(input || "").trim()}
          >
            <SparklesIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
