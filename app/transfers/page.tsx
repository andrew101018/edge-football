import { supabaseAdmin } from '@/lib/supabase';
import { ArrowLeftRight, CheckCircle2, HelpCircle } from 'lucide-react';

export const revalidate = 60;

export default async function TransfersPage() {
  const { data: transfers } = await supabaseAdmin
    .from('transfers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">رادار سوق الانتقالات والصفقات</h1>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            تحديث فوري 24/7
          </span>
        </div>

        {/* Transfer Cards */}
        <div className="grid grid-cols-1 gap-4">
          {(!transfers || transfers.length === 0) ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
              لا توجد صفقات مسجلة حديثاً في الرادار.
            </div>
          ) : (
            transfers.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                {/* بيانات اللاعب والصفقة */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {item.player_photo ? (
                    <img src={item.player_photo} alt={item.player_name} className="w-12 h-12 rounded-full object-cover border border-slate-700 bg-slate-950" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                      {item.player_name[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-white">{item.player_name}</span>
                      {item.status === 'confirmed' ? (
                        <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle2 className="w-3 h-3" /> صفقة رسمية
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                          <HelpCircle className="w-3 h-3" /> مفاوضات متقدمة
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">قيمة الصفقة: <strong className="text-slate-200">{item.fee || 'غير معلنة'}</strong></span>
                  </div>
                </div>

                {/* مسار الانتقال (من ➔ إلى) */}
                <div className="flex items-center gap-6 bg-slate-950 px-5 py-2.5 rounded-lg border border-slate-800/80 w-full md:w-auto justify-center">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">النادي السابق</span>
                    <span className="font-semibold text-xs text-slate-300">{item.from_team}</span>
                  </div>
                  
                  <ArrowLeftRight className="w-4 h-4 text-emerald-400" />

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">النادي الجديد</span>
                    <span className="font-bold text-xs text-emerald-400">{item.to_team}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}