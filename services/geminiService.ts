import { AnalysisResult } from "../types";

export class AnalysisError extends Error {
  constructor(
    public message: string,
    public type: "AUTH" | "SAFETY" | "UNKNOWN"
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

export const analyzeNews = async (
  newsText: string
): Promise<AnalysisResult> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newsText }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AnalysisError(
        data?.error || "Analysis failed",
        "UNKNOWN"
      );
    }

    // Parse Gemini JSON string safely
    let parsed;
    try {
      parsed =
        typeof data.result === "string"
          ? JSON.parse(data.result)
          : data.result;
    } catch {
      throw new AnalysisError("Invalid AI response format", "UNKNOWN");
    }

    return parsed as AnalysisResult;

  } catch (error: any) {
    throw new AnalysisError(
      error.message || "System error",
      "UNKNOWN"
    );
  }
};
