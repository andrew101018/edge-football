import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { player1, player2 } = await req.json();

    if (!player1 || !player2) {
      return NextResponse.json({ error: 'يرجى إدخال اسم اللاعبين أو الفريقين' }, { status: 400 });
    }

    const prompt = `
أنت محلل تكتيكي مخضرم في منصة EDGE Football.
قم بإجراء مقارنة تكتيكية وفنية شاملة بين: "${player1}" و "${player2}".

المطلوب صياغة التقرير بلهجة مصرية كروية جذابة ودقيقة 100% بدون أي تأليف:
1. أسلوب اللعب ونقاط القوة والضعف لكل طرف.
2. التأثير الحاسم في المباريات الكبرى والأرقام المؤكدة.
3. الخلاصة والتقييم الفني: من يتفوق وفي أي سيناريو تكتيكي؟
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