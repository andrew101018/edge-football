import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { publishToTelegram, publishToFacebook } from '@/lib/publisher';

export async function POST(req: Request) {
  try {
    // جلب أحدث المنشورات الجاهزة التي لم تنشر على تليجرام أو فيسبوك
    const { data: queue, error } = await supabaseAdmin
      .from('social_posts')
      .select('id, facebook_post_text, telegram_caption, published_to_telegram, published_to_facebook, articles(title, image_url, slug)')
      .or('published_to_telegram.eq.false,published_to_facebook.eq.false')
      .limit(5);

    if (error) throw error;
    if (!queue || queue.length === 0) {
      return NextResponse.json({ message: 'No pending posts in queue' });
    }

    const results = [];

    for (const item of queue) {
      const article = item.articles as any;
      const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com'}/news/${article.slug}`;

      // نشر تليجرام
      let telegramSuccess = item.published_to_telegram;
      if (!telegramSuccess && item.telegram_caption) {
        try {
          await publishToTelegram({
            caption: `${item.telegram_caption}\n\n🔗 اقرأ التفاصيل: ${articleUrl}`,
            imageUrl: article.image_url,
          });
          telegramSuccess = true;
        } catch (e: any) {
          console.error(`Telegram Error for post ${item.id}:`, e.message);
        }
      }

      // نشر فيسبوك
      let facebookSuccess = item.published_to_facebook;
      if (!facebookSuccess && item.facebook_post_text) {
        try {
          await publishToFacebook({
            caption: item.facebook_post_text,
            imageUrl: article.image_url,
            linkUrl: articleUrl,
          });
          facebookSuccess = true;
        } catch (e: any) {
          console.error(`Facebook Error for post ${item.id}:`, e.message);
        }
      }

      // تحديث حالة السجل في Supabase لمنع إعادة النشر
      await supabaseAdmin
        .from('social_posts')
        .update({
          published_to_telegram: telegramSuccess,
          published_to_facebook: facebookSuccess,
        })
        .eq('id', item.id);

      results.push({ id: item.id, telegram: telegramSuccess, facebook: facebookSuccess });
    }

    return NextResponse.json({ success: true, processed: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}