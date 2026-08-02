import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function generateFinancialInsights(dataContext: string) {
  if (!genAI) {
    return `[AI Placeholder] 
    
It looks like you haven't configured your GEMINI_API_KEY yet!

Once you add your API key to the .env file, this section will automatically generate real, AI-driven performance insights based on your organization's transaction and goal data. 

For now, here is a mock insight based on the data:
Revenue is trending upwards in the current quarter, primarily driven by strong performance in the 'Subscription' category. You are on track to meet 2 of your 3 active goals.`
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const prompt = `
You are a senior financial analyst AI for an enterprise revenue tracking platform called QBIX RevenueTrack AI.
Analyze the following organizational revenue data and provide 3-4 sentences of highly actionable, professional financial insights.
Do not use markdown formatting like asterisks or bold text. Keep it readable and concise.

Data Context:
${dataContext}
`
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error("Failed to generate AI insights:", error)
    return "The AI assistant encountered an error while analyzing your data. Please try again later."
  }
}
