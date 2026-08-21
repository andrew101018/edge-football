import { Tv, Mic, Clock, Calendar } from 'lucide-react';

export const revalidate = 1800;

// نموذج بيانات المباريات والقنوات الناقلة المعتمدة
const TV_SCHEDULE = [
  {
    id: 1,
    match: 'ليفربول ضد مانشستر سيتي',
    tournament: 'الدوري الإنجليزي الممتاز',
    time: '06:30 م',
    channel: 'beIN Sports 1 HD Premium',
    commentator: 'حفيظ دراجي',
  },
  {
    id: 2,
    match: 'ريال مدريد ضد برشلونة (الكلاسيكو)',
    tournament: 'الدوري الإسباني (La Liga)',
    time: '09:00 م',
    channel: 'beIN Sports 1 HD',
    commentator: 'عصام الشوالي',
  },
  {
    id: 3,
    match: 'الأهلي ضد الزمالك',
    tournament: 'الدوري المصري الممتاز',
    time: '07:00 م',
    channel: 'ON Time Sports 1 HD',
    commentator: 'مدحت شلبي / أيمن الكاشف',
  },
];

export default function TvGuidePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Tv className="w-7 h-7 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-black text-white">دليل القنوات الناقلة والمعلقين</h1>
              <p className="text-slate-400 text-xs mt-0.5">مواعيد مباريات اليوم، القنوات الفضائية، وأسماء المعلقين</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> جدول اليوم
          </span>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {TV_SCHEDULE.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {item.tournament}
                </span>
                <h3 className="font-bold text-base text-white pt-1">{item.match}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {item.time} (بتوقيت القاهرة)
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 bg-slate-950 p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Tv className="w-3.5 h-3.5 text-sky-400" />
                  <span>{item.channel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>المعلق: {item.commentator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}