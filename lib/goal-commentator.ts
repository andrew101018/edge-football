import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateGoalChant(scorerName: string, teamName: string, minute: number, opponent: string) {
  const prompt = `
أنت معلق كروي مصري حماسي جداً ومحبوب.
سجل اللاعب "${scorerName}" هدفاً لصالح "${teamName}" ضد "${opponent}" في الدقيقة ${minute}.

اكتب تعليقاً حماسياً جداً وقصيراً (جملتين فقط) باللهجة المصرية الكروية وكأنك تصرخ في المايك أثناء بث اللقاء، بدون أي مقدمات.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.9,
    },
  });

  return response.text?.trim() || `جووووول! ${scorerName} يسجل هدف التقدم لـ ${teamName}!`;
}