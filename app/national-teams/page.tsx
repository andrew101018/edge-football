import { supabaseAdmin } from '@/lib/supabase';
import { Flag, Trophy, Clock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function NationalTeamsPage() {
  // جلب الأخبار الخاصة بالمنتخبات
  const { data: nationalArticles } = await supabaseAdmin
    .from('articles')
    .select('*')
    .or('league.ilike.%منتخب%,league.ilike.%Africa Cup%,league.ilike.%World Cup%,category.ilike.%national%')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Flag className="w-7 h-7 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-black text-white">رادار المنتخبات القومية 🇪🇬</h1>
              <p className="text-slate-400 text-xs mt-0.5">تغطية خاصة لمنتخب مصر، المنتخبات العربية، والبطولات القارية والعالمية</p>
            </div>
          </div>
        </div>

        {/* شبكة أخبار المنتخبات */}
        {(!nationalArticles || nationalArticles.length === 0) ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
            لا توجد أخبار مسجلة حالياً تخص المنتخبات القومية.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nationalArticles.map((art) => (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition flex flex-col justify-between"
              >
                {art.image_url && (
                  <div className="h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {art.league || 'المنتخبات القومية'}
                    </span>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                    <span>{art.source_name || 'تغطية المنتخبات'}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(art.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}