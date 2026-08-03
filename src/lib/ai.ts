import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateFinancialInsights(dataContext: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return `[AI Performance Insights]
    
GEMINI_API_KEY is not set in environment variables.

Mock Insight:
Revenue is trending upwards in the current period, primarily driven by strong activity across registered channels. You are on track to meet your primary revenue goals.`
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `
You are a senior financial analyst AI for an enterprise revenue tracking platform called QBIX RevenueTrack AI.
Analyze the following organizational revenue data and provide 3-4 sentences of highly actionable, professional financial insights.
Do not use markdown formatting like asterisks or bold text. Keep it readable and concise.

Data Context:
${dataContext}
`
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error: any) {
    console.warn("AI generation warning:", error?.message || error)
    return "The AI assistant is currently unable to reach Gemini services. Please verify your GEMINI_API_KEY in environment variables."
  }
}
