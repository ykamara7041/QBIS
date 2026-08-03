import { streamText } from "ai"
import { createGoogle } from "@ai-sdk/google"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, dataContext } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in environment variables." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
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
