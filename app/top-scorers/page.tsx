import { getTopScorers } from '@/lib/football-api';
import { Flame } from 'lucide-react';

export const revalidate = 3600;

const LEAGUES = [
  { id: 39, name: 'الدوري الإنجليزي', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'الدوري الإسباني', flag: '🇪🇸' },
  { id: 233, name: 'الدوري المصري', flag: '🇪🇬' },
  { id: 307, name: 'دوري روشن', flag: '🇸🇦' },
];

export default async function TopScorersPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>;
}) {
  const { league } = await searchParams;
  const currentLeagueId = league ? parseInt(league, 10) : 39;
  const scorers = await getTopScorers(currentLeagueId);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">قائمة الهدافين (صراع الحذاء الذهبي)</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">ترتيب الهدافين وصناع اللعب في الدوريات الكبرى</p>
            </div>
          </div>
        </div>

        {/* فلترة الدوري */}
        <div className="flex flex-wrap gap-2">
          {LEAGUES.map((l) => (
            <a
              key={l.id}
              href={`/top-scorers?league=${l.id}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                currentLeagueId === l.id
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </a>
          ))}
        </div>

        {/* قائمة الهدافين */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-slate-800/70">
            {(!scorers || scorers.length === 0) ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                لا توجد إحصائيات هدافين مسجلة لهذا الدوري حالياً.
              </div>
            ) : (
              scorers.map((item: any, idx: number) => {
                const player = item.player;
                const stats = item.statistics[0];

                return (
                  <div key={player.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition">
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono font-black text-base text-slate-500 w-6 text-center">
                        {idx + 1}
                      </span>
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{player.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {stats.team.logo && <img src={stats.team.logo} alt={stats.team.name} className="w-3.5 h-3.5 object-contain" />}
                          <span>{stats.team.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 block">الصناعة</span>
                        <span className="font-mono font-bold text-xs text-slate-300">{stats.goals.assists || 0}</span>
                      </div>
                      <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 block">الأهداف</span>
                        <span className="font-mono font-black text-base text-orange-400">{stats.goals.total || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </main>
  );
}