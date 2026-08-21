import Parser from 'rss-parser';
import { RawRssItem, ValidatedNewsPayload } from '@/types/validator';
import { validateIncomingArticle, sanitizeArticleText } from './validator';

// تهيئة RSS Parser مع قراءة وسوم الصور
const parser: Parser<any, RawRssItem> = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

// قائمة خلاصات الـ RSS الرسمية والموثوقة
export const RSS_FEEDS = [
  {
    name: 'Sky Sports Football',
    url: 'https://www.skysports.com/rss/12040',
    league: 'كورة عالمية',
  },
  {
    name: 'BBC Football',
    url: 'http://feeds.bbci.co.uk/sport/football/rss.xml',
    league: 'الدوري الإنجليزي',
  },
  {
    name: 'The Guardian Football',
    url: 'https://www.theguardian.com/football/rss',
    league: 'كورة أوروبية',
  },
  {
    name: 'FilGoal',
    url: 'https://www.filgoal.com/rss',
    league: 'الدوري المصري',
  },
];

/**
 * استخراج رابط الصورة الحقيقية من مختلف وسوم الـ RSS
 */
function extractImageUrl(item: any): string | undefined {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;

  // محاولة استخراج أول صورة من داخل محتوى الـ HTML إن وجدت
  const content = item.contentEncoded || item.content || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

/**
 * سحب وتدقيق الأخبار من جميع الخلاصات المعتمدة
 */
export async function fetchAndValidateAllFeeds(): Promise<ValidatedNewsPayload[]> {
  const validatedArticles: ValidatedNewsPayload[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);

      for (const item of feedData.items || []) {
        // التحقق من صحة الخبر وجودة النص
        const validation = validateIncomingArticle({
          title: item.title || '',
          link: item.link || '',
          contentSnippet: item.contentSnippet,
          content: item.contentEncoded || item.content,
          pubDate: item.pubDate || item.isoDate,
          source: feed.name,
        });

        // استبعاد الأخبار غير الصالحة أو المكررة
        if (validation.isValid) {
          const imageUrl = extractImageUrl(item);

          validatedArticles.push({
            title: validation.title,
            sourceUrl: validation.sourceUrl,
            sourceName: validation.sourceName,
            cleanSummary: sanitizeArticleText(item.contentSnippet || '').slice(0, 200),
            cleanContent: validation.cleanText,
            imageUrl,
            contentHash: validation.contentHash,
            publishedAt: validation.publishedAt,
            leagueTag: feed.league,
            isValid: true,
          });
        }
      }
    } catch (error: any) {
      console.error(`❌ فشل سحب الخلاصة من ${feed.name}:`, error.message);
    }
  }

  return validatedArticles;
}