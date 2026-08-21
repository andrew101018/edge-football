import { getLiveFixtures } from '@/lib/football-api';
import { Activity, Clock } from 'lucide-react';

export const revalidate = 30; // تحديث تلقائي كل 30 ثانية

export default async function LiveMatchCenter() {
  const matches = await getLiveFixtures();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h1 className="text-2xl font-black text-white">مركز المباريات المباشرة</h1>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
            تحديث تلقائي
          </span>
        </div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-pulse" />
            <p className="text-slate-400 font-medium">لا توجد مباريات جارية حالياً</p>
            <span className="text-xs text-slate-500 mt-1 block">تابعنا لمشاهدة التغطية الحية للمباريات القادمة</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((item: any) => (
              <div 
                key={item.fixture.id} 
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition rounded-xl p-4 flex flex-col justify-between space-y-4"
              >
                {/* البطولة والتوقيت */}
                <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="font-semibold text-emerald-400">{item.league.name}</span>
                  <span className="flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono font-bold">
                    <Clock className="w-3 h-3" /> {item.fixture.status.elapsed}'
                  </span>
                </div>

                {/* الفرق والنتيجة */}
                <div className="flex items-center justify-between px-2">
                  {/* الفريق الأول */}
                  <div className="flex items-center gap-3 w-2/5">
                    <img src={item.teams.home.logo} alt={item.teams.home.name} className="w-8 h-8 object-contain" />
                    <span className="text-sm font-bold text-slate-200 truncate">{item.teams.home.name}</span>
                  </div>

                  {/* النتيجة */}
                  <div className="text-xl font-black bg-slate-950 px-3 py-1 rounded border border-slate-800 text-slate-100 tracking-wider">
                    {item.goals.home ?? 0} - {item.goals.away ?? 0}
                  </div>

                  {/* الفريق الثاني */}
                  <div className="flex items-center gap-3 justify-end w-2/5 text-left">
                    <span className="text-sm font-bold text-slate-200 truncate text-right">{item.teams.away.name}</span>
                    <img src={item.teams.away.logo} alt={item.teams.away.name} className="w-8 h-8 object-contain" />
                  </div>
                </div>

                {/* الملعب */}
                <div className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-800/40">
                  {item.fixture.venue?.name || 'الملعب غير محدد'}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}