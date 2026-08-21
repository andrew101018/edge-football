import { NextResponse } from 'next/server';
import { fetchAndValidateAllFeeds } from '@/lib/rss-fetcher';
import { supabaseAdmin } from '@/lib/supabase';
import { generateFootballContent } from '@/lib/gemini';
import { publishToTelegram } from '@/lib/publisher';
import { logSystemAlert } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // إعطاء مهلة دقيقة كاملة لمعالجة الذكاء الاصطناعي في Vercel

export async function GET() {
  try {
    // 1. سحب وتدقيق الأخبار من الخلاصات الرسمية
    const rawItems = await fetchAndValidateAllFeeds();
    const processedArticles: string[] = [];

    for (const item of rawItems) {
      // 2. التحقق من عدم وجود الخبر مسبقاً عبر الـ Hash
      const { data: existing } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('content_hash', item.contentHash)
        .maybeSingle();

      if (existing) {
        continue; // تم معالجة الخبر مسبقاً، تخطي لمنع التكرار
      }

      // 3. إعادة صياغة المحتوى بمحرك Gemini باللهجة الكروية المصرية
      const aiResult = await generateFootballContent(
        `${item.title}\n\n${item.cleanContent}`
      );

      // توليد Slug فريد للمقال
      const slug = `${item.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
        .slice(0, 60)}-${Date.now().toString().slice(-4)}`;

      // 4. حفظ المقال وتفاصيل السوشيال ميديا في Supabase
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

      // 5. النشر الآلي الفوري للخبر عبر Telegram Bot
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com';
      const articleUrl = `${siteUrl}/news/${slug}`;

      await publishToTelegram(
        aiResult.telegram_caption,
        articleUrl,
        item.imageUrl
      );

      processedArticles.push(aiResult.title);

      // معالجة خبرين كحد أقصى في كل تشغيلة لتفادي استهلاك موارد الـ Rate Limits
      if (processedArticles.length >= 2) {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ingestedCount: processedArticles.length,
      articles: processedArticles,
    });
  } catch (error: any) {
    console.error('❌ خطأ في تشغيل مسار الجدولة (Cron Ingest):', error);
    await logSystemAlert('Cron Ingest Engine Failure', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}