import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { newsText } = req.body;

    if (!newsText) {
      return res.status(400).json({ error: "Missing newsText" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Audit this news claim for veracity:

INPUT: "${newsText}"

Return ONLY valid JSON.`,
    });

    return res.status(200).json({
      result: response.text,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Analysis failed",
    });
  }
}