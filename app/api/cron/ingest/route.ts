import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateFootballContent } from '@/lib/gemini';
import { publishToTelegram } from '@/lib/publisher';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
    ],
  },
});

const RSS_FEEDS = [
  { name: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', league: 'كرة عالمية' },
  { name: 'BBC Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', league: 'كرة عالمية' },
];

export async function GET() {
  try {
    const rawItems: any[] = [];

    // سحب الخلاصات
    for (const feed of RSS_FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url);
        for (const item of feedData.items.slice(0, 3)) {
          if (!item.title || !item.link) continue;
          
          let imageUrl = item.enclosure?.url || item.mediaContent?.$.url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800';
          
          rawItems.push({
            title: item.title,
            cleanContent: item.contentSnippet || item.content || item.title,
            sourceUrl: item.link,
            sourceName: feed.name,
            imageUrl,
            leagueTag: feed.league,
            contentHash: Buffer.from(item.link).toString('base64').slice(0, 32),
          });
        }
      } catch (err) {
        console.warn(`Feed fetch failed for ${feed.name}:`, err);
      }
    }

    if (rawItems.length === 0) {
      return NextResponse.json({ message: 'No items fetched from RSS sources' }, { status: 200 });
    }

    const processedArticles: string[] = [];

    for (const item of rawItems) {
      // فحص التكرار
      const { data: existing } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('content_hash', item.contentHash)
        .maybeSingle();

      if (existing) continue;

      // الصياغة عبر Gemini
      const aiResult = await generateFootballContent(`${item.title}\n\n${item.cleanContent}`);

      const slug = `${item.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
        .slice(0, 45)}-${Date.now().toString().slice(-4)}`;

      // الإدخال في Supabase
      const { error: dbError } = await supabaseAdmin
        .from('articles')
        .insert({
          title: aiResult.title || item.title,
          slug,
          summary: aiResult.summary || item.cleanContent.slice(0, 150),
          content: aiResult.content || item.cleanContent,
          image_url: item.imageUrl,
          source_name: item.sourceName,
          source_url: item.sourceUrl,
          content_hash: item.contentHash,
          league: aiResult.league || item.leagueTag,
          facebook_post: aiResult.facebook_post,
          telegram_caption: aiResult.telegram_caption,
          youtube_shorts_script: aiResult.youtube_shorts_script,
          is_published: true,
        });

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        continue;
      }

      // النشر على تيليجرام
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edge-football.vercel.app';
        const articleUrl = `${siteUrl}/news/${slug}`;
        await publishToTelegram(aiResult.telegram_caption || aiResult.title, articleUrl, item.imageUrl);
      } catch (e) {
        console.warn('Telegram send failed:', e);
      }

      processedArticles.push(aiResult.title);
      if (processedArticles.length >= 2) break;
    }

    return NextResponse.json({
      success: true,
      ingestedCount: processedArticles.length,
      articles: processedArticles,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}