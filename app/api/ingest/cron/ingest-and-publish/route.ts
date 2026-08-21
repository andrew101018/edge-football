import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { processRawFootballNews } from '@/lib/gemini';
import { fetchLatestRawNews } from '@/lib/rss-fetcher';
import { publishToTelegram, publishToFacebook } from '@/lib/publisher';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const rawNewsItems = await fetchLatestRawNews();
    const processedResults = [];

    for (const raw of rawNewsItems) {
      if (!raw.sourceUrl || !raw.contentSnippet) continue;

      // منع التكرار باستخدام Hash الرابط
      const sourceHash = crypto.createHash('sha256').update(raw.sourceUrl).digest('hex');

      const { data: exists } = await supabaseAdmin
        .from('articles')
        .select('id')
        .eq('source_url_hash', sourceHash)
        .maybeSingle();

      if (exists) continue; // تم نشره مسبقاً، تخطيه

      // 1. إعادة الصياغة بالذكاء الاصطناعي بلهجة مصرية كروية
      const processed = await processRawFootballNews(
        `عنوان المصدر: ${raw.title}\nالمحتوى: ${raw.contentSnippet}\nالمصدر: ${raw.sourceName}`
      );

      const slug = `${processed.title.toLowerCase().replace(/[^\w\u0621-\u064A]+/g, '-')}-${Date.now().toString().slice(-4)}`;

      // 2. الحفظ في جدول المقالات
      const { data: insertedArticle, error: articleErr } = await supabaseAdmin
        .from('articles')
        .insert({
          source_url_hash: sourceHash,
          title: processed.title,
          slug,
          summary: processed.summary,
          content: processed.content,
          image_url: raw.imageUrl,
          category: processed.category,
          league: processed.league || raw.league,
          source_name: raw.sourceName,
        })
        .select()
        .single();

      if (articleErr) continue;

      // 3. النشر الفوري على المنصات
      const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com'}/news/${slug}`;
      
      let telegramPublished = false;
      try {
        await publishToTelegram({
          caption: `${processed.telegram_caption}\n\n🔗 تفاصيل أكثر: ${articleUrl}`,
          imageUrl: raw.imageUrl,
        });
        telegramPublished = true;
      } catch (err) {
        console.error('Telegram error:', err);
      }

      let facebookPublished = false;
      try {
        await publishToFacebook({
          caption: processed.facebook_post,
          imageUrl: raw.imageUrl,
          linkUrl: articleUrl,
        });
        facebookPublished = true;
      } catch (err) {
        console.error('Facebook error:', err);
      }

      // 4. حفظ سجل السوشيال ميديا والسكريبتات
      await supabaseAdmin.from('social_posts').insert({
        article_id: insertedArticle.id,
        facebook_post_text: processed.facebook_post,
        telegram_caption: processed.telegram_caption,
        reels_script: processed.youtube_shorts_script || '',
        published_to_telegram: telegramPublished,
        published_to_facebook: facebookPublished,
      });

      processedResults.push({
        title: processed.title,
        source: raw.sourceName,
        telegram: telegramPublished,
        facebook: facebookPublished,
      });
    }

    return NextResponse.json({
      success: true,
      processedCount: processedResults.length,
      articles: processedResults,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}