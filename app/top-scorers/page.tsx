import { getTopScorers } from '@/lib/football-api';
import { Target, Flame } from 'lucide-react';

export const revalidate = 3600;

const LEAGUES = [
  { id: 39, name: 'الدوري الإنجليزي الممتاز' },
  { id: 140, name: 'الدوري الإسباني (La Liga)' },
  { id: 78, name: 'الدوري الألماني (Bundesliga)' },
  { id: 233, name: 'الدوري المصري الممتاز' },
  { id: 307, name: 'دوري روشن السعودي' },
];

export default async function TopScorersPage({
  searchParams,
}: {
  searchParams: { league?: string };
}) {
  const currentLeagueId = Number(searchParams.league) || 39;
  const currentSeason = 2024;

  const scorers = await getTopScorers(currentLeagueId, currentSeason);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl font-black text-white">قائمة الهدافين</h1>
          </div>
          <span className="text-xs bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20 font-bold">
            سباق الحذاء الذهبي
          </span>
        </div>

        {/* أزرار اختيار الدوري */}
        <div className="flex flex-wrap gap-2 pb-2">
          {LEAGUES.map((l) => (
            <a
              key={l.id}
              href={`/top-scorers?league=${l.id}`}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                currentLeagueId === l.id
                  ? 'bg-orange-500 text-slate-950 font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {l.name}
            </a>
          ))}
        </div>

        {/* جدول الهدافين */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800">
            {scorers.length === 0 ? (
              <div className="p-8 text-center text-slate-500">لا توجد بيانات متاحة حالياً.</div>
            ) : (
              scorers.slice(0, 15).map((item: any, index: number) => {
                const player = item.player;
                const stats = item.statistics[0];
                return (
                  <div 
                    key={player.id} 
                    className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition"
                  >
                    {/* الترتيب واللاعب */}
                    <div className="flex items-center gap-4">
                      <span className={`w-6 text-center font-mono font-bold ${index === 0 ? 'text-amber-400 text-lg' : 'text-slate-500 text-sm'}`}>
                        {index + 1}
                      </span>
                      <img 
                        src={player.photo} 
                        alt={player.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-950" 
                      />
                      <div>
                        <p className="font-bold text-slate-100 flex items-center gap-2">
                          {player.name}
                          {/* تمييز المحترفين البارزين */}
                          {(player.name.includes('Salah') || player.name.includes('Marmoush')) && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                              محترفنا 🇪🇬
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <img src={stats.team.logo} alt={stats.team.name} className="w-3.5 h-3.5 object-contain" />
                          <span>{stats.team.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* الأهداف والمباريات */}
                    <div className="flex items-center gap-6">
                      <div className="text-center hidden sm:block">
                        <span className="text-[10px] text-slate-500 block">مباريات</span>
                        <span className="text-xs font-mono font-semibold text-slate-300">{stats.games.appearences || 0}</span>
                      </div>
                      <div className="text-center hidden sm:block">
                        <span className="text-[10px] text-slate-500 block">صناعة</span>
                        <span className="text-xs font-mono font-semibold text-slate-300">{stats.goals.assists || 0}</span>
                      </div>
                      <div className="text-left bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 min-w-[55px] text-center">
                        <span className="text-lg font-black text-orange-400 font-mono">
                          {stats.goals.total || 0}
                        </span>
                        <span className="text-[9px] text-slate-500 block -mt-1 font-bold">هدف</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}