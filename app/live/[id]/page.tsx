import { getFixtureEvents, getFixtureLineups } from '@/lib/football-api';
import PitchLineup from '@/components/PitchLineup';
import Link from 'next/link';
import { Clock, ArrowRight, Award } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 15;

export default async function MatchDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const fixtureId = parseInt(resolvedParams.id, 10);

  const [events, lineups] = await Promise.all([
    getFixtureEvents(fixtureId),
    getFixtureLineups(fixtureId),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link href="/live" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition">
          <ArrowRight className="w-4 h-4" />
          العودة لكافة المباريات المباشرة
        </Link>

        {/* شريط الأحداث */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h2 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-emerald-400" />
            شريط أحداث اللقاء
          </h2>

          {(!events || events.length === 0) ? (
            <p className="text-xs text-slate-500 text-center py-6">لا توجد أحداث رئيسية مسجلة حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {events.map((ev: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-slate-800">
                      {ev.time?.elapsed || 0}'
                    </span>
                    <div>
                      <span className="font-bold text-white">{ev.player?.name || 'لاعب'}</span>
                      {ev.assist?.name && (
                        <span className="text-slate-400 text-[11px] block">صناعة: {ev.assist.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-slate-400">{ev.team?.name}</span>
                    {ev.type === 'Goal' && <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">⚽ هدف</span>}
                    {ev.type === 'Card' && <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">🟨 بطاقة</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* التشكيلات التكتيكية */}
        {lineups && lineups.length >= 2 && (
          <section className="space-y-6">
            <h2 className="font-bold text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-emerald-400" />
              التشكيل والخطط التكتيكية للمباراة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PitchLineup
                teamName={lineups[0].team?.name || 'الفريق الأول'}
                formation={lineups[0].formation || '4-3-3'}
                startXI={(lineups[0].startXI || []).map((p: any) => ({
                  id: p.player?.id || Math.random(),
                  name: p.player?.name || '',
                  number: p.player?.number || 0,
                  pos: p.player?.pos || 'M',
                }))}
              />
              <PitchLineup
                teamName={lineups[1].team?.name || 'الفريق الثاني'}
                formation={lineups[1].formation || '4-3-3'}
                startXI={(lineups[1].startXI || []).map((p: any) => ({
                  id: p.player?.id || Math.random(),
                  name: p.player?.name || '',
                  number: p.player?.number || 0,
                  pos: p.player?.pos || 'M',
                }))}
              />
            </div>
          </section>
        )}

      </div>
    </main>
  );
}