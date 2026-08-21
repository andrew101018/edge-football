import { supabaseAdmin } from '@/lib/supabase';
import { Send, CheckCircle2, XCircle, RefreshCw, Layers, ShieldCheck, Film } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // جلب المقالات وسجلات السوشيال ميديا المرتبطة بها
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('*, social_posts(*)')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* شريط الإدارة العلوي */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              لوحة عمليات غرفة الأخبار (Newsroom OS)
            </h1>
            <p className="text-slate-400 text-sm mt-1">مراقبة الأتمتة المباشرة، خطوط النشر، وسجلات السوشيال ميديا</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/api/cron/ingest-and-publish"
              target="_blank"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" />
              تشغيل السحب اليدوي الآن
            </Link>
          </div>
        </div>

        {/* كروت الإحصائيات السريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-500 font-bold">إجمالي الأخبار المعالجة</span>
            <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">{articles?.length || 0}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-500 font-bold">حالة محرك Gemini</span>
            <div className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              2.5 Flash Online
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-500 font-bold">حالة شبكة التوزيع</span>
            <div className="text-lg font-bold text-white mt-2 flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-400" /> 5 قنوات نشر نشطة
            </div>
          </div>
        </div>

        {/* جدول سجلات الأخبار وقنوات النشر */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 font-bold text-sm text-slate-300">
            أحدث المقالات المجدولة والمنشورة
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">عنوان الخبر</th>
                  <th className="py-3.5 px-3">المصدر</th>
                  <th className="py-3.5 px-3">البطولة</th>
                  <th className="py-3.5 px-3 text-center">Telegram</th>
                  <th className="py-3.5 px-3 text-center">Facebook</th>
                  <th className="py-3.5 px-3 text-center">YouTube</th>
                  <th className="py-3.5 px-4 text-center">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {(!articles || articles.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      لا توجد سجلات حالياً في قاعدة البيانات.
                    </td>
                  </tr>
                ) : (
                  articles.map((art: any) => {
                    const social = art.social_posts?.[0] || {};
                    return (
                      <tr key={art.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-semibold max-w-xs truncate">
                          <Link href={`/news/${art.slug}`} className="hover:text-emerald-400 transition" target="_blank">
                            {art.title}
                          </Link>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-400">{art.source_name}</td>
                        <td className="py-3.5 px-3 text-xs">
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            {art.league || 'عام'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {social.published_to_telegram ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {social.published_to_facebook ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {social.published_to_youtube ? (
                            <CheckCircle2 className="w-4 h-4 text-red-400 mx-auto" />
                          ) : (
                            <Film className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-slate-500 font-mono">
                          {new Date(art.created_at).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}