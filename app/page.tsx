import { supabaseAdmin } from '@/lib/supabase';
import { getLiveFixtures } from '@/lib/football-api';
import Link from 'next/link';
import { Activity, Clock, Flame, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import GeneratorPlayground from './GeneratorPlayground';

export const revalidate = 30; // تحديث تلقائي للبيانات كل 30 ثانية

export default async function HomePage() {
  // جلب أحدث المقالات من Supabase والمباريات الحية من API-Football بالتوازي
  const [{ data: latestArticles }, liveMatches] = await Promise.all([
    supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6),
    getLiveFixtures(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Hero Section */}
        <section className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> EDGE Football Media OS & Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            نبض الكورة العالمية والمحلية بلهجة مصرية
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            تغطية فورية للمباريات، تحليلات كروية دقيقة، محرك Gemini لصناعة السكريبتات، وسوق الانتقالات بدون أي بيانات وهمية.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/live"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2"
            >
              <Activity className="w-4 h-4" /> مركز المباريات المباشرة
            </Link>
            <Link
              href="/standings"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 border border-slate-700"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> ترتيب الدوريات
            </Link>
          </div>
        </section>

        {/* Live Matches Widget */}
        {liveMatches && liveMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                مباريات جارية الآن
              </h2>
              <Link href="/live" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                عرض كل المباريات <ArrowRight className="w-3 h-3 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {liveMatches.slice(0, 3).map((m: any) => (
                <div key={m.fixture.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-slate-700 transition">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[140px] font-semibold text-emerald-400">{m.league.name}</span>
                    <span className="bg-red-500/10 text-red-400 font-bold font-mono px-2 py-0.5 rounded">
                      {m.fixture.status.elapsed}'
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-sm">
                    <div className="flex items-center gap-2 truncate w-2/5">
                      <img src={m.teams.home.logo} alt={m.teams.home.name} className="w-6 h-6 object-contain" />
                      <span className="truncate">{m.teams.home.name}</span>
                    </div>
                    <span className="bg-slate-950 px-3 py-1 rounded text-emerald-400 font-mono text-base font-black border border-slate-800">
                      {m.goals.home ?? 0} - {m.goals.away ?? 0}
                    </span>
                    <div className="flex items-center gap-2 justify-end truncate w-2/5 text-left">
                      <span className="truncate text-right">{m.teams.away.name}</span>
                      <img src={m.teams.away.logo} alt={m.teams.away.name} className="w-6 h-6 object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gemini AI Live Content Studio */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              استوديو الصياغة وتوليد المحتوى التفاعلي (Gemini Engine)
            </h2>
          </div>
          <GeneratorPlayground />
        </section>

        {/* Latest Articles Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              أحدث التغطيات والأخبار المنشورة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(!latestArticles || latestArticles.length === 0) ? (
              <div className="col-span-3 text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
                لا توجد مقالات منشورة حالياً في قاعدة البيانات. استخدم استوديو الصياغة بالأعلى لتوليد أول خبر!
              </div>
            ) : (
              latestArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition flex flex-col justify-between shadow-lg"
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
                        {art.league || 'كورة عالمية'}
                      </span>
                      <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                      <span>{art.source_name || 'تغطية خاصة'}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(art.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}