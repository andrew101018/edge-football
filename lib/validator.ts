import crypto from 'crypto';

export interface RawArticleInput {
  title: string;
  link: string;
  contentSnippet?: string;
  content?: string;
  pubDate?: string;
  source?: string;
}

export interface ValidatedArticle {
  title: string;
  sourceUrl: string;
  sourceName: string;
  cleanText: string;
  contentHash: string;
  publishedAt: string;
  isValid: boolean;
  rejectionReason?: string;
}

// قائمة المصادر المعتمدة والموثوقة فقط
const TRUSTED_SOURCES = [
  'Sky Sports',
  'BBC Football',
  'The Guardian',
  'FilGoal',
  '365Scores',
  'Reuters Sports',
];

/**
 * توليد Hash فريد للخبر لمنع تكرار معالجته أو نشره في قاعدة البيانات
 */
export function generateContentHash(title: string, link: string): string {
  const cleanTitle = title.trim().toLowerCase();
  return crypto.createHash('sha256').update(`${cleanTitle}_${link}`).digest('hex');
}

/**
 * تنظيف النصوص من وسوم HTML والرموز التالفة
 */
export function sanitizeArticleText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // إزالة وسوم HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * التحقق من أصالة وجودة الخبر قبل إرساله إلى Gemini أو حفظه
 */
export function validateIncomingArticle(raw: RawArticleInput): ValidatedArticle {
  const cleanTitle = sanitizeArticleText(raw.title || '');
  const cleanBody = sanitizeArticleText(raw.content || raw.contentSnippet || '');
  const sourceName = raw.source || 'وكالات رياضية رسمية';

  // 1. فحص وجود العنوان والرابط
  if (!cleanTitle || cleanTitle.length < 10) {
    return {
      title: cleanTitle,
      sourceUrl: raw.link || '',
      sourceName,
      cleanText: cleanBody,
      contentHash: '',
      publishedAt: raw.pubDate || new Date().toISOString(),
      isValid: false,
      rejectionReason: 'العنوان قصير جداً أو مفقود',
    };
  }

  if (!raw.link || !raw.link.startsWith('http')) {
    return {
      title: cleanTitle,
      sourceUrl: raw.link || '',
      sourceName,
      cleanText: cleanBody,
      contentHash: '',
      publishedAt: raw.pubDate || new Date().toISOString(),
      isValid: false,
      rejectionReason: 'رابط المصدر غير صالح',
    };
  }

  // 2. فحص كفاية المحتوى للتحليل
  if (!cleanBody || cleanBody.length < 20) {
    return {
      title: cleanTitle,
      sourceUrl: raw.link,
      sourceName,
      cleanText: cleanBody,
      contentHash: '',
      publishedAt: raw.pubDate || new Date().toISOString(),
      isValid: false,
      rejectionReason: 'محتوى الخبر غير كافٍ للصياغة',
    };
  }

  // 3. إنشاء الـ Hash بعد اجتياز الفحوصات
  const contentHash = generateContentHash(cleanTitle, raw.link);

  return {
    title: cleanTitle,
    sourceUrl: raw.link,
    sourceName,
    cleanText: cleanBody,
    contentHash,
    publishedAt: raw.pubDate ? new Date(raw.pubDate).toISOString() : new Date().toISOString(),
    isValid: true,
  };
}

/**
 * التحقق من بنية الـ JSON العائد من محرك Gemini للتأكد من اكتمال كافة القوالب
 */
export function validateGeminiOutput(data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  const requiredFields = [
    'title',
    'summary',
    'content',
    'facebook_post',
    'telegram_caption',
    'youtube_shorts_script',
  ];

  return requiredFields.every(
    (field) => typeof data[field] === 'string' && data[field].trim().length > 0
  );
}