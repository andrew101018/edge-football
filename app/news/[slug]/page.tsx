import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Clock, Share2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// توليد الميتا داتا الديناميكية لتحسين محركات البحث ومشاركات السوشيال ميديا
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('title, summary, image_url')
    .eq('slug', slug)
    .single();

  if (!article) return { title: 'الخبر غير موجود | EDGE Football' };

  return {
    title: `${article.title} | EDGE Football`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.image_url ? [{ url: article.image_url }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  // جلب بيانات المقال والتعليقات المرتبطة به بالتوازي
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!article) notFound();

  const [{ data: comments }, { data: relatedArticles }] = await Promise.all([
    supabaseAdmin
      .from('comments')
      .select('*')
      .eq('article_id', article.id)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('articles')
      .select('id, title, slug, created_at, image_url')
      .neq('id', article.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  // تجهيز JSON-LD للـ Google News والأرشفة الفورية
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: article.image_url ? [article.image_url] : [],
    datePublished: article.created_at,
    dateModified: article.created_at,
    author: {
      '@type': 'Organization',
      name: 'EDGE Football Media OS',
    },
  };

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com'}/news/${article.slug}`;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition">الرئيسية</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">{article.league || 'كورة عالمية'}</span>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/20 flex items-center gap-1">
              <Tag className="w-3 h-3" /> {article.league || 'تغطية خاصة'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {new Date(article.created_at).toLocaleDateString('ar-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              المصدر: {article.source_name || 'وكالات رياضية رسمية'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {article.title}
          </h1>

          {/* الملخص السريع */}
          <p className="text-sm sm:text-base text-slate-300 font-semibold bg-slate-900 border-r-4 border-emerald-500 p-4 rounded-xl leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="w-full h-64 sm:h-[420px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="text-slate-200 text-sm sm:text-base leading-loose whitespace-pre-wrap font-sans">
            {article.content}
          </div>

          {/* أزرار المشاركة السريعة */}
          <div className="border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
              <Share2 className="w-4 h-4 text-emerald-400" /> مشاركة الخبر مع أصحابك:
            </span>
            <div className="flex gap-2 text-xs font-bold">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-lg transition"
              >
                Facebook
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-white px-3.5 py-1.5 rounded-lg transition"
              >
                Telegram
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}\n${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3.5 py-1.5 rounded-lg transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* أخبار ذات صلة */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">تغطيات قد تهمك أيضاً</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.slug}`}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition space-y-2 group shadow-lg"
                >
                  {rel.image_url && (
                    <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-950">
                      <img src={rel.image_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                  )}
                  <h4 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-emerald-400 transition line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* نظام التعليقات والتفاعل الجماهيري */}
        <CommentsSection articleId={article.id} initialComments={comments || []} />

      </article>
    </main>
  );
}