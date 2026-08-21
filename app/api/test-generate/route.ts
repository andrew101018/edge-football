import { NextResponse } from 'next/server';
import { generateFootballContent } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const result = await generateFootballContent(text || 'خبر رياضي تجريبي');
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}