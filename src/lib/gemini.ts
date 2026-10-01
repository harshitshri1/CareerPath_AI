import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI content. Please check your API key.");
  }
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const text = await generateContent(
    prompt + "\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation."
  );
  // Strip any markdown code fences if present
  const cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
