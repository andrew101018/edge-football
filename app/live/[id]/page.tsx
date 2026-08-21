import { getFixtureDetails } from '@/lib/football-api';
import { notFound } from 'next/navigation';
import { Clock, ShieldAlert, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 15;

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = await getFixtureDetails(Number(params.id));

  if (!match) notFound();

  const events = match.events || [];
  const statistics = match.statistics || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* شاشة النتيجة والتوقيت */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
          <div className="text-xs font-semibold text-emerald-400 mb-4">{match.league.name} - {match.league.round}</div>
          <div className="flex items-center justify-around">
            {/* Team Home */}
            <div className="flex flex-col items-center gap-2 w-1/3">
              <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-16 h-16 object-contain" />
              <span className="font-bold text-sm sm:text-base">{match.teams.home.name}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-white">
                {match.goals.home ?? 0} - {match.goals.away ?? 0}
              </span>
              <span className="mt-2 text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-red-500/20">
                <Clock className="w-3 h-3" /> {match.fixture.status.elapsed}' ({match.fixture.status.short})
              </span>
            </div>

            {/* Team Away */}
            <div className="flex flex-col items-center gap-2 w-1/3">
              <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-16 h-16 object-contain" />
              <span className="font-bold text-sm sm:text-base">{match.teams.away.name}</span>
            </div>
          </div>
        </div>

        {/* خط الأحداث المباشرة */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">أحداث اللقاء</h2>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">لم تبدأ أحداث اللقاء بعد.</p>
            ) : (
              events.map((ev: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm py-1.5 border-b border-slate-800/40">
                  <span className="font-mono text-xs font-bold bg-slate-950 px-2 py-0.5 rounded text-emerald-400 border border-slate-800">
                    {ev.time.elapsed}'
                  </span>
                  
                  {ev.type === 'Goal' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {ev.type === 'Card' && <ShieldAlert className={`w-4 h-4 ${ev.detail.includes('Yellow') ? 'text-yellow-400' : 'text-red-500'}`} />}
                  {ev.type === 'subst' && <ArrowLeftRight className="w-4 h-4 text-blue-400" />}
                  
                  <div className="flex-1 flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-semibold text-slate-200">{ev.player.name} ({ev.team.name})</span>
                    <span className="text-slate-400">{ev.detail}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}