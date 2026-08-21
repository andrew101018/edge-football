import { getLiveFixtures } from '@/lib/football-api';
import Link from 'next/link';
import { Activity, Clock, Shield, Flame, Trophy, MapPin } from 'lucide-react';

export const revalidate = 15; // تحديث فوري كل 15 ثانية للنتائج الحية

export default async function LiveMatchesPage() {
  const liveMatches = await getLiveFixtures();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">مركز المباريات المباشرة (Live Center)</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">متابعة دقيقة للأهداف، الإحصائيات، وشريط الأحداث الحية لحظة بلحظة</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            تحديث تلقائي مستمر
          </div>
        </div>

        {/* Live Matches List */}
        {(!liveMatches || liveMatches.length === 0) ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">لا توجد مباريات جارية في هذه اللحظة</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              تابع جدول القنوات الناقلة أو عُد لاحقاً مع انطلاق صافرة مباريات الدوريات الكبرى والبطولات الإفريقية.
            </p>
            <Link
              href="/tv-guide"
              className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-500/20 transition"
            >
              استعراض مواعيد مباريات اليوم
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((m: any) => {
              const elapsed = m.fixture?.status?.elapsed || 0;
              const isHalftime = m.fixture?.status?.short === 'HT';

              return (
                <div
                  key={m.fixture.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl transition flex flex-col justify-between"
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      {m.league.logo && (
                        <img src={m.league.logo} alt={m.league.name} className="w-4 h-4 object-contain" />
                      )}
                      <span className="font-bold text-emerald-400 truncate max-w-[180px]">{m.league.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded-lg border border-red-500/20">
                        {isHalftime ? 'استراحة (HT)' : `${elapsed}'`}
                      </span>
                    </div>
                  </div>

                  {/* Scoreboard */}
                  <div className="grid grid-cols-7 items-center gap-2 text-center py-2">
                    {/* Home Team */}
                    <div className="col-span-3 flex flex-col items-center space-y-2">
                      <img
                        src={m.teams.home.logo}
                        alt={m.teams.home.name}
                        className="w-12 h-12 object-contain drop-shadow-md"
                      />
                      <span className="font-black text-sm text-slate-100 line-clamp-1">{m.teams.home.name}</span>
                    </div>

                    {/* Result */}
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-xl font-black shadow-inner">
                        {m.goals.home ?? 0} - {m.goals.away ?? 0}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-mono">LIVE</span>
                    </div>

                    {/* Away Team */}
                    <div className="col-span-3 flex flex-col items-center space-y-2">
                      <img
                        src={m.teams.away.logo}
                        alt={m.teams.away.name}
                        className="w-12 h-12 object-contain drop-shadow-md"
                      />
                      <span className="font-black text-sm text-slate-100 line-clamp-1">{m.teams.away.name}</span>
                    </div>
                  </div>

                  {/* Stadium & Referee */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate max-w-[160px]">{m.fixture.venue?.name || 'الملعب الرئيسي'}</span>
                    </div>
                    <span className="font-mono text-slate-500">{m.fixture.referee || 'طاقم تحكيم معتمد'}</span>
                  </div>

                  {/* Match Details Link */}
                  <Link
                    href={`/live/${m.fixture.id}`}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>عرض شريط الأحداث والتشكيلة التكتيكية</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}