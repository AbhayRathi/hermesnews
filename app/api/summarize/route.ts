import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

// Initialize the Google AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is missing." }, { status: 500 });
  }

  try {
    const { article } = await request.json();

    if (!article || typeof article !== 'string') {
      return NextResponse.json({ error: "Article content is required." }, { status: 400 });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a concise, one-sentence summary for the following news article: ${article}`,
    });
    
    const summary = response.text;
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Could not generate summary for this article." }, { status: 500 });
  }
}
