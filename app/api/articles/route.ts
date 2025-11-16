import { NextResponse } from 'next/server';
import { getAllArticles, addArticle } from '@/services/articleService';
import { GoogleGenAI } from "@google/genai";
import type { NewArticleData } from '@/types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function GET() {
  const articles = getAllArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const articleData: NewArticleData = await request.json();

    if (!process.env.API_KEY) {
        return NextResponse.json({ error: "API key is missing." }, { status: 500 });
    }

    // Generate summary using Gemini
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a concise, one-sentence summary for the following news article: ${articleData.article}`,
    });
    const summary = response.text;

    // Add article to our mock DB
    const newArticle = addArticle(articleData, summary);

    return NextResponse.json(newArticle, { status: 201 });

  } catch (error) {
    console.error("Error adding article:", error);
    return NextResponse.json({ error: 'Failed to process article' }, { status: 500 });
  }
}
