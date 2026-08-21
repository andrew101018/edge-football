import { NextResponse } from 'next/server';
import { processRawFootballNews } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();
    const processed = await processRawFootballNews(rawText);
    return NextResponse.json(processed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}