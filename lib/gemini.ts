import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// تعريف شكل المخرجات الصارمة (JSON Schema)
const footballOutputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING, 
      description: 'عنوان صحفي جذاب للموقع باللغة العربية' 
    },
    summary: { 
      type: Type.STRING, 
      description: 'ملخص سريع جداً في سطرين' 
    },
    content: { 
      type: Type.STRING, 
      description: 'مقال الموقع بأسلوب مصري كروي تحليلي وممتع' 
    },
    facebook_post: { 
      type: Type.STRING, 
      description: 'بوست فيسبوك تفاعلي يفتح نقاشاً مع الجمهور مع إيموجيز مناسبة' 
    },
    telegram_caption: { 
      type: Type.STRING, 
      description: 'رسالة تليجرام عاجلة وشاملة مع الهاشتاجات' 
    },
    reels_script: { 
      type: Type.STRING, 
      description: 'سكريبت فيديو عمودي مدته 30-60 ثانية جاهز للإلقاء السريع (Hook, Details, CTA)' 
    },
    category: { 
      type: Type.STRING, 
      description: 'تصنيف الخبر: transfers, matches, players, local, international' 
    },
    league: { 
      type: Type.STRING, 
      description: 'الدوري المعني أو البطاقة الرياضية (مثل: Premier League, La Liga, الدوري المصري)' 
    },
  },
  required: ['title', 'summary', 'content', 'facebook_post', 'telegram_caption', 'reels_script', 'category', 'league'],
};

export interface ProcessedFootballNews {
  title: string;
  summary: string;
  content: string;
  facebook_post: string;
  telegram_caption: string;
  reels_script: string;
  category: string;
  league: string;
}

export async function processRawFootballNews(rawText: string): Promise<ProcessedFootballNews> {
  const prompt = `
أنت محرر وصانع محتوى رياضي مخضرم في منصة "EDGE Football".
مهمتك إعادة صياغة الخبر الرياضي التالي بلهجة مصرية كروية تجمع بين الحماس، خفة الظل، والمصداقية الصحفية التامة بدون اختلاق أي وقائع.

بيانات الخبر الخام:
"""
${rawText}
"""

القواعد:
1. حافظ على صحة الأرقام والأسماء وتفاصيل الخبر الأصلية 100%.
2. في بوست الفيسبوك: اطرح سؤالاً تفاعلياً في النهاية يثير الجدل الكروي الإيجابي.
3. في سكريبت الريلز/تيك توك: اكتب الهوك (Hook) في أول 3 ثوانٍ بطريقة خاطفة، ثم تفاصيل الخبر، ثم ختام سريع.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: footballOutputSchema,
      temperature: 0.7,
    },
  });

  return JSON.parse(response.text || '{}') as ProcessedFootballNews;
}
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const footballOutputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'عنوان المقال للموقع' },
    summary: { type: Type.STRING, description: 'ملخص سريع' },
    content: { type: Type.STRING, description: 'مقال تفصيلي بأسلوب مصري ممتع' },
    facebook_post: { type: Type.STRING, description: 'بوست فيسبوك تفاعلي' },
    telegram_caption: { type: Type.STRING, description: 'رسالة تليجرام عاجلة' },
    youtube_shorts_script: { 
      type: Type.STRING, 
      description: 'سكريبت شورتس (30-60 ثانية) مقسم إلى Hook سريع، Body، وCTA للاشتراك' 
    },
    youtube_long_script: {
      type: Type.OBJECT,
      properties: {
        video_title: { type: Type.STRING, description: 'عنوان جذاب ومُحسّن للـ SEO لفيديو يوتيوب' },
        description_and_tags: { type: Type.STRING, description: 'وصف الفيديو والتاجات والهاشتاجات' },
        script_breakdown: { type: Type.STRING, description: 'سكريبت الحلقة بالنقاط للمذيع (مقدمة، تحليل، خاتمة)' },
      },
      required: ['video_title', 'description_and_tags', 'script_breakdown']
    },
    category: { type: Type.STRING },
    league: { type: Type.STRING },
  },
  required: ['title', 'summary', 'content', 'facebook_post', 'telegram_caption', 'youtube_shorts_script', 'youtube_long_script', 'category', 'league'],
};

export async function processRawFootballNews(rawText: string) {
  const prompt = `
أنت رئيس تحرير وصانع محتوى في منصة "EDGE Football".
قم بصياغة الخبر التالي بلهجة مصرية كروية جذابة بدون اختلاق أي وقائع:

${rawText}

المطلوب:
1. صياغة المقال والسوشيال ميديا.
2. سكريبت YouTube Shorts سريع وجذاب مع إرشادات بصرية [Visual Cues].
3. خطة وسكريبت YouTube طويل (تحليلي) مع عنوان قوي ووصف غني بالكلمات المفتاحية.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: footballOutputSchema,
      temperature: 0.7,
    },
  });

  return JSON.parse(response.text || '{}');
}