import { NextResponse } from 'next/server';
import { fetchAndValidateAllFeeds } from '@/lib/rss-fetcher';
import { supabaseAdmin } from '@/lib/supabase';
import { generateFootballContent } from '@/lib/gemini';
import { publishToTelegram } from '@/lib/publisher';
import { logSystemAlert } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawItems = await fetchAndValidateAllFeeds();
    const processed: string[] = [];

    for (const item of rawItems) {
      // 1. فحص وجود الخبر في قاعدة البيانات عبر الـ Hash
      const { data: existing } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('content_hash', item.contentHash)
        .maybeSingle();

      if (existing) continue; // تم نشره مسبقاً، تخطي

      // 2. صياغة الخبر بـ Gemini باللهجة المصرية
      const aiResult = await generateFootballContent(
        `${item.title}\n\n${item.cleanContent}`
      );

      const slug = `${item.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
        .slice(0, 60)}-${Date.now().toString().slice(-4)}`;

      // 3. تخزين المقال في Supabase
      const { data: newArticle, error: dbError } = await supabaseAdmin
        .from('articles')
        .insert({
          title: aiResult.title,
          slug,
          summary: aiResult.summary,
          content: aiResult.content,
          image_url: item.imageUrl,
          source_name: item.sourceName,
          source_url: item.sourceUrl,
          content_hash: item.contentHash,
          league: item.leagueTag || aiResult.league,
          facebook_post: aiResult.facebook_post,
          telegram_caption: aiResult.telegram_caption,
          youtube_shorts_script: aiResult.youtube_shorts_script,
          is_published: true,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 4. النشر الآلي الفوري على Telegram
      const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com'}/news/${slug}`;
      await publishToTelegram(
        aiResult.telegram_caption,
        fullUrl,
        item.imageUrl
      );

      processed.push(aiResult.title);

      // معالجة خبرين كحد أقصى في الدورة الواحدة لتجنب استهلاك الـ Rate Limit
      if (processed.length >= 2) break;
    }

    return NextResponse.json({
      success: true,
      ingestedCount: processed.length,
      articles: processed,
    });
  } catch (error: any) {
    await logSystemAlert('Cron Ingest Engine', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}