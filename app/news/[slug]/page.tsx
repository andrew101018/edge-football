import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Share2, Clock, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface NewsPageProps {
  params: { slug: string };
}

// توليد البيانات الوصفية للمشاركة في السوشيال ميديا (SEO / OpenGraph)
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('title, summary, image_url')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!article) return { title: 'خبر غير موجود | EDGE Football' };

  return {
    title: `${article.title} | EDGE Football`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
  };
}

export const revalidate = 60;

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* زر العودة */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        {/* الكارت الرئيسي */}
        <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* الصورة الأساسية للخبر */}
          {article.image_url && (
            <div className="w-full h-64 sm:h-96 relative bg-slate-950">
              <img 
                src={article.image_url} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* التاجات والتاريخ */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <Trophy className="w-3 h-3" />
                {article.league || 'بطولات كروية'}
              </span>
              <span className="bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(article.created_at).toLocaleDateString('ar-EG', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {article.source_name && (
                <span className="text-slate-500">المصدر: {article.source_name}</span>
              )}
            </div>

            {/* العنوان */}
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {article.title}
            </h1>

            {/* الملخص السريع */}
            <div className="bg-slate-950/80 border-r-4 border-emerald-500 p-4 rounded-lg text-slate-300 font-medium text-sm sm:text-base leading-relaxed">
              {article.summary}
            </div>

            {/* المحتوى الكامل */}
            <div className="text-slate-200 text-base sm:text-lg leading-loose space-y-4 whitespace-pre-wrap">
              {article.content}
            </div>

          </div>
        </article>

      </div>
    </div>
  );
}