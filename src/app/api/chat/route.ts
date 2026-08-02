import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

export const maxDuration = 30
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages, dataContext } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const systemPrompt = `You are a senior financial analyst AI for an enterprise revenue tracking platform called QBIX RevenueTrack AI.
Your goal is to answer questions about the user's organizational revenue, goals, and performance.
If the user greets you or asks how you are doing (e.g. "how are you doing"), respond politely before assisting them.
Be professional, concise, and highly actionable.

Organization Context:
${dataContext || "No context provided."}`

    const formattedMessages = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I will analyze the organization context and assist as the QBIX RevenueTrack AI." }] }
    ]
    
    for (const m of messages) {
      if (m.role === "system") continue;
      formattedMessages.push({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      })
    }

    const geminiStream = await model.generateContentStream({
      contents: formattedMessages,
    })

    const stream = GoogleGenerativeAIStream(geminiStream)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
