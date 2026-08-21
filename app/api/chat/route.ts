import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemInstruction = `
أنت "حريف EDGE" - المساعد والمحلل الكروي الذكي لمنصة EDGE Football.
شخصيتك: خبير كروي مصري مخضرم، كلامك ممتع، سريع البديهة، مليء بالحماس والمعلومات الدقيقة 100% بدون أي تأليف.
مهمتك: الإجابة على أسئلة الجمهور الكروية (مواعيد، مقارنات، بطولات، تاريخ أندية، إحصائيات صلاح ومرموش) بلهجة مصرية كروية لطيفة ومحترمة.
`;

    // تحويل سجل الرسائل لصيغة Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}