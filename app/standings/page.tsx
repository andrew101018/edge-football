import { getLeagueStandings } from '@/lib/football-api';
import { Trophy } from 'lucide-react';

export const revalidate = 3600; // تحديث الكاش كل ساعة

// معرفات الدوريات الرئيسية في API-Football
const LEAGUES = [
  { id: 39, name: 'الدوري الإنجليزي الممتاز' },
  { id: 140, name: 'الدوري الإسباني (La Liga)' },
  { id: 233, name: 'الدوري المصري الممتاز' },
  { id: 307, name: 'دوري روشن السعودي' },
];

export default async function StandingsPage({
  searchParams,
}: {
  searchParams: { league?: string };
}) {
  const currentLeagueId = Number(searchParams.league) || 39;
  const currentSeason = 2024; // ضبط الموسم الرياضي المطلوب

  const standings = await getLeagueStandings(currentLeagueId, currentSeason);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">جدول ترتيب الفرق</h1>
          </div>
        </div>

        {/* أزرار اختيار الدوري */}
        <div className="flex flex-wrap gap-2 pb-2">
          {LEAGUES.map((l) => (
            <a
              key={l.id}
              href={`/standings?league=${l.id}`}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                currentLeagueId === l.id
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {l.name}
            </a>
          ))}
        </div>

        {/* جدول الترتيب */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-center w-12">#</th>
                <th className="py-3.5 px-4">الفريق</th>
                <th className="py-3.5 px-3 text-center">لعب</th>
                <th className="py-3.5 px-3 text-center">فاز</th>
                <th className="py-3.5 px-3 text-center">تعادل</th>
                <th className="py-3.5 px-3 text-center">خسر</th>
                <th className="py-3.5 px-3 text-center">الفارق</th>
                <th className="py-3.5 px-4 text-center font-bold text-white">النقاط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {standings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    لا توجد بيانات متاحة لهذا الدوري حالياً.
                  </td>
                </tr>
              ) : (
                standings.map((team: any) => (
                  <tr key={team.team.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-center font-bold font-mono text-slate-400">
                      {team.rank}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={team.team.logo} alt={team.team.name} className="w-6 h-6 object-contain" />
                      <span className="font-semibold">{team.team.name}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{team.all.played}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400">{team.all.win}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{team.all.draw}</td>
                    <td className="py-3 px-3 text-center font-mono text-red-400">{team.all.lose}</td>
                    <td className="py-3 px-3 text-center font-mono">{team.goalsDiff}</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-400 font-mono text-base">
                      {team.points}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}