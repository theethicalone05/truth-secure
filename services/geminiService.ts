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

    if (!response.ok) {
      throw new AnalysisError("Analysis failed", "UNKNOWN");
    }

    return await response.json();
  } catch (error: any) {
    throw new AnalysisError(
      error.message || "System error",
      "UNKNOWN"
    );
  }
};