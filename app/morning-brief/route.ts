import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  try {
    // جلب أحدث 8 مقالات من قاعدة البيانات كمرجع لأحداث اليوم
    const { data: latestArticles } = await supabaseAdmin
      .from('articles')
      .select('title, summary, league')
      .order('created_at', { ascending: false })
      .limit(8);

    const newsContext = (latestArticles || [])
      .map((a, i) => `${i + 1}. [${a.league || 'كورة'}] ${a.title}: ${a.summary}`)
      .join('\n');

    const prompt = `
أنت مذيع كروي مصري في برنامج صباحي شهير على منصة EDGE Football.
قم بكتابة "الموجز الكروي الصباحي" لليوم بالاعتماد على أحدث الأحداث الرياضية التالية:

${newsContext || 'متابعة استعدادات الأندية للدوريات الأوروبية والمحلية وتصفيات البطولات القارية.'}

المطلوب:
1. صياغة إذاعية ممتعة جداً بلهجة مصرية كروية (صباح الفل على كل عشاق الكورة...).
2. تقسيم الموجز إلى: (أهم ما حدث بالأمس ➔ كواليس وصفقات ➔ ماتشات اليوم اللي متتفوتش).
3. خاتمة حماسية للمشجعين.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    return NextResponse.json({ brief: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}