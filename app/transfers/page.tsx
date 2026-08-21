import { supabaseAdmin } from '@/lib/supabase';
import { ArrowLeftRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function TransfersPage() {
  const { data: transferArticles } = await supabaseAdmin
    .from('articles')
    .select('*')
    .or('title.ilike.%صفقة%,title.ilike.%انتقال%,title.ilike.%رسمياً%,category.ilike.%transfer%')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">رادار سوق الانتقالات (Transfer Hub)</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">الصفقات الرسمية، تجديد العقود، وكواليس الميركاتو الحقيقية بدون شائعات وهمية</p>
            </div>
          </div>
        </div>

        {/* شبكة صفقات الانتقالات */}
        {(!transferArticles || transferArticles.length === 0) ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-sm">
            لا توجد صفقات مؤكدة مسجلة في الساعات الأخيرة.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transferArticles.map((art) => (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition shadow-lg group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                      صفقة مؤكدة
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(art.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-emerald-400 transition leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                  <span>{art.source_name || 'بيان رسمي'}</span>
                  <span className="text-emerald-400 font-bold">تفاصيل الصفقة ➔</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}