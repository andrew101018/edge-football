import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { processRawFootballNews } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { rawText, sourceUrl, imageUrl, sourceName } = await req.json();

    if (!rawText || !sourceUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // إنشاء Hash للرابط لمنع تكرار معالجة الخبر نفسه
    const sourceHash = crypto.createHash('sha256').update(sourceUrl).digest('hex');

    // فحص وجود الخبر مسبقاً في قاعدة البيانات
    const { data: existingArticle } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('source_url_hash', sourceHash)
      .maybeSingle();

    if (existingArticle) {
      return NextResponse.json({ message: 'Article already processed' }, { status: 200 });
    }

    // صياغة الخبر باستخدام Gemini
    const processed = await processRawFootballNews(rawText);
    const slug = `${processed.title.toLowerCase().replace(/[^\w\u0621-\u064A]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    // حفظ المقال الأساسي في Supabase
    const { data: insertedArticle, error: articleError } = await supabaseAdmin
      .from('articles')
      .insert({
        source_url_hash: sourceHash,
        title: processed.title,
        slug,
        summary: processed.summary,
        content: processed.content,
        image_url: imageUrl || null,
        category: processed.category,
        league: processed.league,
        source_name: sourceName || 'Live Feed',
      })
      .select()
      .single();

    if (articleError) throw articleError;

    // حفظ قوالب السوشيال ميديا وسكريبت الفيديو
    const { error: postError } = await supabaseAdmin
      .from('social_posts')
      .insert({
        article_id: insertedArticle.id,
        facebook_post_text: processed.facebook_post,
        telegram_caption: processed.telegram_caption,
        reels_script: processed.reels_script,
        published_to_telegram: false,
        published_to_facebook: false,
      });

    if (postError) throw postError;

    return NextResponse.json({ success: true, articleId: insertedArticle.id });
  } catch (error: any) {
    console.error('Ingest error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}