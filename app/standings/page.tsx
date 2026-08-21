import { getStandings } from '@/lib/football-api';
import { Trophy } from 'lucide-react';

export const revalidate = 3600;

const LEAGUES = [
  { id: 39, name: 'الدوري الإنجليزي الممتاز', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'الدوري الإسباني (La Liga)', flag: '🇪🇸' },
  { id: 233, name: 'الدوري المصري الممتاز', flag: '🇪🇬' },
  { id: 307, name: 'دوري روشن السعودي', flag: '🇸🇦' },
  { id: 78, name: 'الدوري الألماني (Bundesliga)', flag: '🇩🇪' },
  { id: 135, name: 'الدوري الإيطالي (Serie A)', flag: '🇮🇹' },
];

export default async function StandingsPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentLeagueId = resolvedSearchParams?.league ? parseInt(resolvedSearchParams.league, 10) : 39;
  const standingsData = await getStandings(currentLeagueId);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">جداول ترتيب الدوريات الكبرى</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">الترتيب والنقاط وفارق الأهداف محدث رسمياً ومباشرة</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {LEAGUES.map((l) => (
            <a
              key={l.id}
              href={`/standings?league=${l.id}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                currentLeagueId === l.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </a>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-4 text-center w-12">#</th>
                  <th className="p-4">الفريق</th>
                  <th className="p-4 text-center">لعب</th>
                  <th className="p-4 text-center">فاز</th>
                  <th className="p-4 text-center">تعادل</th>
                  <th className="p-4 text-center">خسر</th>
                  <th className="p-4 text-center">له/عليه</th>
                  <th className="p-4 text-center">الفرق</th>
                  <th className="p-4 text-center font-bold text-white">النقاط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {(!standingsData || standingsData.length === 0) ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-500">
                      لا توجد بيانات متاحة لهذا الدوري حالياً.
                    </td>
                  </tr>
                ) : (
                  standingsData.map((row: any) => (
                    <tr key={row.team?.id || Math.random()} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 text-center font-mono font-bold text-slate-400">
                        {row.rank}
                      </td>
                      <td className="p-4 font-bold text-white flex items-center gap-2.5">
                        {row.team?.logo && (
                          <img src={row.team.logo} alt={row.team.name} className="w-6 h-6 object-contain" />
                        )}
                        <span className="truncate max-w-[160px] sm:max-w-none">{row.team?.name}</span>
                      </td>
                      <td className="p-4 text-center font-mono text-slate-300">{row.all?.played || 0}</td>
                      <td className="p-4 text-center font-mono text-emerald-400">{row.all?.win || 0}</td>
                      <td className="p-4 text-center font-mono text-amber-400">{row.all?.draw || 0}</td>
                      <td className="p-4 text-center font-mono text-red-400">{row.all?.lose || 0}</td>
                      <td className="p-4 text-center font-mono text-slate-400 text-xs">
                        {row.all?.goals?.for || 0}:{row.all?.goals?.against || 0}
                      </td>
                      <td className="p-4 text-center font-mono text-slate-300">
                        {(row.goalsDiff || 0) > 0 ? `+${row.goalsDiff}` : row.goalsDiff || 0}
                      </td>
                      <td className="p-4 text-center font-mono font-black text-emerald-400 text-base">
                        {row.points || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}