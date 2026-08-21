import { NextResponse } from 'next/server';
import { fetchAndValidateAllFeeds } from '@/lib/rss-fetcher';
import { supabaseAdmin } from '@/lib/supabase';
import { generateFootballContent } from '@/lib/gemini';
import { publishToTelegram } from '@/lib/publisher';
import { logSystemAlert } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    const rawItems = await fetchAndValidateAllFeeds();
    const processedArticles: string[] = [];

    for (const item of rawItems) {
      // 1. التحقق من مانع التكرار
      const { data: existing } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('content_hash', item.contentHash)
        .maybeSingle();

      if (existing) continue;

      // 2. معالجة المحتوى بالذكاء الاصطناعي
      let aiResult;
      try {
        aiResult = await generateFootballContent(`${item.title}\n\n${item.cleanContent}`);
      } catch (aiErr) {
        console.warn('AI processing error for item, skipping:', item.title);
        continue;
      }

      const slug = `${item.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
        .slice(0, 50)}-${Date.now().toString().slice(-4)}`;

      // 3. تخزين الخبر في قاعدة البيانات
      const { error: dbError } = await supabaseAdmin
        .from('articles')
        .insert({
          title: aiResult.title || item.title,
          slug,
          summary: aiResult.summary || item.cleanContent?.slice(0, 150),
          content: aiResult.content || item.cleanContent,
          image_url: item.imageUrl,
          source_name: item.sourceName,
          source_url: item.sourceUrl,
          content_hash: item.contentHash,
          league: item.leagueTag || aiResult.league || 'كرة عالمية',
          facebook_post: aiResult.facebook_post,
          telegram_caption: aiResult.telegram_caption,
          youtube_shorts_script: aiResult.youtube_shorts_script,
          is_published: true,
        });

      if (dbError) {
        console.error('Database insertion error:', dbError);
        continue;
      }

      // 4. النشر على تيليجرام بأمان وبدون تعطيل المسار
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edge-football.vercel.app';
        const articleUrl = `${siteUrl}/news/${slug}`;
        const captionToSend = aiResult.telegram_caption || aiResult.title || item.title;

        await publishToTelegram(captionToSend, articleUrl, item.imageUrl);
      } catch (tgErr) {
        console.warn('Telegram publish failed non-blocking:', tgErr);
      }

      processedArticles.push(aiResult.title || item.title);

      if (processedArticles.length >= 2) break;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ingestedCount: processedArticles.length,
      articles: processedArticles,
    });
  } catch (error: any) {
    console.error('❌ Ingest pipeline error:', error);
    await logSystemAlert('Cron Ingest Engine Failure', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}