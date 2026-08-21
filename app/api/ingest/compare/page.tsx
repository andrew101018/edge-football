'use client';

import { useState } from 'react';
import { Swords, Sparkles, UserCheck } from 'lucide-react';

export default function ComparePage() {
  const [player1, setPlayer1] = useState('محمد صلاح');
  const [player2, setPlayer2] = useState('عمر مرموش');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!player1 || !player2) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1, player2 }),
      });
      const data = await res.json();
      setResult(data.comparison);
    } catch (e) {
      setResult('حدث خطأ أثناء إجراء المقارنة، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> مدعوم بـ Gemini 2.5 Flash
          </div>
          <h1 className="text-3xl font-black text-white">المقارنة التكتيكية الذكية (Head-to-Head)</h1>
          <p className="text-slate-400 text-xs sm:text-sm">قارن بين أي نجمين أو فريقين للحصول على تحليل فني بلهجة مصرية كروية</p>
        </div>

        {/* Input Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">اللاعب الأول:</label>
              <input
                type="text"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                placeholder="مثال: محمد صلاح"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 focus:outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">اللاعب الثاني:</label>
              <input
                type="text"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                placeholder="مثال: عمر مرموش"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 focus:outline-none text-white"
              />
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg"
          >
            <Swords className="w-4 h-4" />
            {loading ? 'جارِ التحليل الفني والمقارنة...' : 'ابدأ المقارنة التكتيكية'}
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3">
              <UserCheck className="w-5 h-5" />
              التقرير الفني والمقارنة التكتيكية
            </div>
            <div className="text-slate-200 text-sm sm:text-base leading-loose whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}