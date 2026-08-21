import { supabaseAdmin } from '@/lib/supabase';
import { ShieldCheck, Activity, Database, Sparkles, Send, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
  // فحص حالة قاعدة البيانات
  let dbStatus = false;
  let articlesCount = 0;
  try {
    const { count, error } = await supabaseAdmin.from('articles').select('*', { count: 'exact', head: true });
    if (!error) {
      dbStatus = true;
      articlesCount = count || 0;
    }
  } catch (e) {
    dbStatus = false;
  }

  // فحص مفاتيح البيئة الأساسية
  const envChecklist = [
    { name: 'Supabase PostgreSQL DB', status: dbStatus, icon: Database },
    { name: 'Gemini 2.5 Flash Engine', status: !!process.env.GEMINI_API_KEY, icon: Sparkles },
    { name: 'API-Football Live Data', status: !!process.env.FOOTBALL_API_KEY, icon: Activity },
    { name: 'Telegram Bot Publisher', status: !!process.env.TELEGRAM_BOT_TOKEN, icon: Send },
    { name: 'Meta Graph API (Facebook/IG)', status: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN, icon: Send },
  ];

  const allOperational = envChecklist.every((item) => item.status);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* الحالة العامة */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-xl ${
          allOperational 
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
            : 'bg-amber-950/30 border-amber-500/30 text-amber-400'
        }`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">
                {allOperational ? 'جميع خدمات المنظومة تعمل بكفاءة 100%' : 'تنبيه: بعض المفاتيح غير مكتملة'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">EDGE Football Media OS & Data Pipelines</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {articlesCount} مقال مخزن
          </span>
        </div>

        {/* فحص الخدمات الفردية */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-3">
            فحص خطوط الربط ومحركات الأتمتة
          </h2>

          <div className="divide-y divide-slate-800/60">
            {envChecklist.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-200">{srv.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {srv.status ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> جاهز للعمل
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> غير متصل
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}