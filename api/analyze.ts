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
    // Safe body parsing (Vercel sometimes sends string body)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { newsText } = body || {};

    if (!newsText) {
      return res.status(400).json({ error: "Missing newsText" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
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

    // Proper Gemini text extraction
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res.status(500).json({ error: "Empty Gemini response" });
    }

    return res.status(200).json({ result: text });

  } catch (error: any) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      error: error?.message || "Analysis failed",
    });
  }
}
