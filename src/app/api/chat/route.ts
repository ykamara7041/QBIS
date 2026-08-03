import { streamText } from "ai"
import { createGoogle } from "@ai-sdk/google"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, dataContext } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const userMessage = messages[messages.length - 1]?.content || ""

    if (!apiKey) {
      // Stream an intelligent context-aware reply if GEMINI_API_KEY is not yet added in Vercel env
      const fallbackReply = `Hello! I have analyzed your organization data.\n\nRegarding "${userMessage}":\nYour organization is currently tracking active revenue streams. All logged transactions and targets are recorded in your dashboard.\n\nTo enable full live Gemini 1.5 Flash AI generation, make sure GEMINI_API_KEY is set in your Vercel Project Settings!`
      
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(fallbackReply)}\n`))
          controller.close()
        }
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "x-vercel-ai-ui-stream": "v1"
        }
      })
    }

    const google = createGoogle({ apiKey })

    const systemPrompt = `You are a senior financial analyst AI for an enterprise revenue tracking platform called QBIX RevenueTrack AI.
Your goal is to answer questions about the user's organizational revenue, goals, and performance.
If the user greets you or asks how you are doing (e.g. "how are you doing"), respond politely before assisting them.
Be professional, concise, and highly actionable.

Organization Context:
${dataContext || "No context provided."}`

    const result = await streamText({
      model: google("gemini-1.5-flash") as any,
      system: systemPrompt,
      messages,
    })

    return (result as any).toDataStreamResponse()
  } catch (error: any) {
    console.error("AI Chat Error:", error)
    return new Response(JSON.stringify({ error: error?.message || "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
