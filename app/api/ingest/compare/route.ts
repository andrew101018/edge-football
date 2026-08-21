import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { player1, player2 } = await req.json();

    if (!player1 || !player2) {
      return NextResponse.json({ error: 'Player names are required' }, { status: 400 });
    }

    const prompt = `
أنت محلل تكتيكي مخضرم في منصة EDGE Football.
قم بإجراء مقارنة تكتيكية وفنية شاملة بين اللاعبين: "${player1}" و "${player2}".

المطلوب إخراجه بلهجة مصرية كروية ممتعة ودقيقة بدون أي معلومات مغلوطة:
1. أسلوب اللعب ونقاط القوة لكل لاعب (السرعة، الحسم، الصناعة، التمركز).
2. التأثير مع النادي والمنتخب.
3. التقييم التكتيكي النهائي: من يتفوق وفي أي سيناريو؟
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return NextResponse.json({ comparison: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}