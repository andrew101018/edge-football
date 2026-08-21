'use client';

import { useState } from 'react';
import { MessageCircle, Send, Flame, ThumbsUp, Smile, ShieldAlert } from 'lucide-react';

interface Comment {
  id: string;
  author_name: string;
  favorite_team: string;
  comment_text: string;
  created_at: string;
}

export default function CommentsSection({
  articleId,
  initialComments = [],
}: {
  articleId: string;
  initialComments?: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [team, setTeam] = useState('الأهلي');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          authorName: name,
          favoriteTeam: team,
          commentText: text,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          مجلس المشجعين ({comments.length})
        </h3>
        <span className="text-xs text-slate-500">شارك برأيك في المباراة أو الخبر</span>
      </div>

      {/* نموذج كتابة التعليق */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="اسمك أو لقبك الكروي..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            required
          />
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="الأهلي">مشجع أهلاوي 🦅</option>
            <option value="الزمالك">مشجع زملكاوي 🏹</option>
            <option value="ليفربول">مشجع ليفربول 🔴</option>
            <option value="ريال مدريد">مشجع مدريدي ⚪</option>
            <option value="برشلونة">مشجع برشلوني 🔵🔴</option>
            <option value="منتخب مصر">مشجع الفراعنة 🇪🇬</option>
          </select>
        </div>

        <textarea
          rows={3}
          placeholder="اكتب تحليلك أو تعليقك الكروي هنا..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <Send className="w-3.5 h-3.5 rotate-180" />
          {loading ? 'جارِ النشر...' : 'نشر التعليق'}
        </button>
      </form>

      {/* قائمة التعليقات */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-4">كن أول من يعلق على هذا الخبر!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{c.author_name}</span>
                  <span className="bg-slate-800 text-[10px] text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700 font-semibold">
                    {c.favorite_team}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(c.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{c.comment_text}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}