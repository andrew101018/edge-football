'use client';

import { useState } from 'react';
import { Radio, Sparkles, Volume2, Calendar, Newspaper, Play } from 'lucide-react';

export default function MorningBriefPage() {
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateBrief = async () => {
    setLoading(true);
    setBrief(null);
    try {
      const res = await fetch('/api/morning-brief');
      const data = await res.json();
      setBrief(data.brief);
    } catch (e) {
      setBrief('حدث خطأ أثناء توليد الموجز الصباحي، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Card */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> EDGE Morning Podcast OS
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            الموجز الصباحي الكروي (Daily Briefing)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            ملخص إذاعي سريع لأهم نتائج مباريات الأمس، صفقات الساعات الأخيرة، ومواعيد قمم اليوم بلهجة مصرية كروية خفيفة.
          </p>
          <button
            onClick={generateBrief}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'جارِ إعداد الموجز الإذاعي عبر Gemini...' : 'توليد موجز اليوم الصباحي'}
          </button>
        </div>

        {/* عرض الموجز */}
        {brief && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Volume2 className="w-5 h-5" />
                <span>سكريبت النشرة الكروية الصباحية</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono">
                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <div className="text-slate-200 text-sm sm:text-base leading-loose whitespace-pre-wrap font-sans">
              {brief}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}