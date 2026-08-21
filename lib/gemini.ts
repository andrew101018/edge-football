import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export interface FootballAiOutput {
  title: string;
  summary: string;
  content: string;
  league: string;
  facebook_post: string;
  telegram_caption: string;
  youtube_shorts_script: string;
}

export async function generateFootballContent(rawNews: string): Promise<FootballAiOutput> {
  const prompt = `
أنت رئيس تحرير ومحلل رياضي مخضرم في منصة EDGE Football.
المهمة: أعد صياغة الخبر التالي بدقة 100% وبلهجة كروية مصرية ممتعة وجذابة وبدون أي معلومات وهمية.

الخبر الأصلي:
${rawNews}

المطلوب إخراج النتيجة بتنسيق JSON حصراً وبنفس المفاتيح التالية:
{
  "title": "عنوان المقال الحماسي والمثير بدون مبالغة",
  "summary": "ملخص الخبر في سطرين سريعين",
  "content": "مقال صحفي متكامل وشيق ومقسم لفقرات",
  "league": "اسم البطولة أو الدوري المرتبط بالخبر",
  "facebook_post": "بوست فيسبوك تفاعلي يفتح نقاشاً مع الجمهور مع إيموجيز وهاشتاجات",
  "telegram_caption": "رسالة تليجرام عاجلة وشاملة مع أهم النقاط",
  "youtube_shorts_script": "سكريبت فيديو عمودي قصير من 30 إلى 60 ثانية يبدأ بهوك خاطف وإلقاء مصري حماسي"
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text) as FootballAiOutput;
}