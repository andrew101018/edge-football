'use client';

import { useState } from 'react';

export default function GeneratorPlayground() {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'youtube' | 'social' | 'article'>('youtube');

  const handleGenerate = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/test-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-300">
          أدخل الخبر الرياضي الخام (أو بيان الصفقة) لإعادة صياغته بلهجة كروية:
        </label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 transition text-slate-200"
          placeholder="مثال: رسمياً.. ريال مدريد يعلن تجديد عقد نجمه حتى 2028 براتب سنوي قياسي وشرط جزائي مليار يورو..."
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition text-sm"
        >
          {loading ? 'جارِ التحليل والصياغة عبر Gemini...' : 'توليد المقال والسكريبتات فوراً'}
        </button>
      </div>

      {/* Output Tabs & Content */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800 bg-slate-950/60">
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${activeTab === 'youtube' ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              🔴 سكريبتات يوتيوب (Shorts & Long)
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${activeTab === 'social' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              📱 فيسبوك وتليجرام
            </button>
            <button
              onClick={() => setActiveTab('article')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${activeTab === 'article' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              📰 مقال الموقع
            </button>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'youtube' && (
              <div className="space-y-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h3 className="text-red-400 font-bold text-xs sm:text-sm mb-2">⚡ سكريبت YouTube Shorts (سريع)</h3>
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">
                    {result.youtube_shorts_script}
                  </pre>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-red-400 font-bold text-xs sm:text-sm">🎬 سكريبت الفيديو الطويل والـ SEO</h3>
                  <div>
                    <span className="text-xs text-slate-500 block">عنوان الفيديو المقترح:</span>
                    <p className="font-semibold text-slate-200">{result.youtube_long_script?.video_title}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">الوصف والتاجات:</span>
                    <pre className="whitespace-pre-wrap text-xs text-slate-400 font-sans bg-slate-900 p-2.5 rounded border border-slate-800/80 mt-1">
                      {result.youtube_long_script?.description_and_tags}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">تقسيم سكريبت الحلقة:</span>
                    <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans mt-1 leading-relaxed">
                      {result.youtube_long_script?.script_breakdown}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h3 className="text-blue-400 font-bold text-sm mb-2">فيسبوك (Post)</h3>
                  <p className="text-sm whitespace-pre-wrap text-slate-300 leading-relaxed">{result.facebook_post}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h3 className="text-sky-400 font-bold text-sm mb-2">تليجرام (Telegram Caption)</h3>
                  <p className="text-sm whitespace-pre-wrap text-slate-300 leading-relaxed">{result.telegram_caption}</p>
                </div>
              </div>
            )}

            {activeTab === 'article' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">{result.title}</h2>
                <p className="text-sm font-semibold text-slate-300 bg-slate-950 p-3 rounded-lg border-r-4 border-emerald-500">
                  {result.summary}
                </p>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.content}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}