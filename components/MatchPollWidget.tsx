'use client';

import { useState } from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';

interface MatchPollProps {
  pollId: string;
  matchTitle: string;
  homeTeam: string;
  awayTeam: string;
  homeVotes: number;
  drawVotes: number;
  awayVotes: number;
}

export default function MatchPollWidget({
  pollId,
  matchTitle,
  homeTeam,
  awayTeam,
  homeVotes: initialHome,
  drawVotes: initialDraw,
  awayVotes: initialAway,
}: MatchPollProps) {
  const [votes, setVotes] = useState({ home: initialHome, draw: initialDraw, away: initialAway });
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = votes.home + votes.draw + votes.away || 1;
  const homePct = Math.round((votes.home / total) * 100);
  const drawPct = Math.round((votes.draw / total) * 100);
  const awayPct = Math.round((votes.away / total) * 100);

  const handleVote = async (option: 'home' | 'draw' | 'away') => {
    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId,
          option,
          userIp: 'client-session-ip', // يتم استبدالها بـ IP العميل الحقيقي من الـ Request Header
        }),
      });

      if (res.ok) {
        setVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }));
        setVoted(true);
      } else {
        const data = await res.json();
        alert(data.message || 'حدث خطأ أثناء التصويت');
        setVoted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-right">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          توقعات الجمهور لنتيجة اللقاء
        </h3>
        <span className="text-xs text-slate-500">{total} صوت</span>
      </div>

      <p className="text-xs text-slate-400 font-semibold">{matchTitle}</p>

      {/* خيارات التصويت */}
      <div className="grid grid-cols-3 gap-3">
        {/* فوز صاحب الأرض */}
        <button
          disabled={voted || loading}
          onClick={() => handleVote('home')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition relative overflow-hidden ${
            voted ? 'bg-slate-950 border-slate-800' : 'bg-slate-800/60 border-slate-700 hover:border-emerald-500'
          }`}
        >
          <span className="text-xs font-bold text-slate-200">{homeTeam}</span>
          {voted && <span className="text-emerald-400 font-mono text-xs font-bold">{homePct}%</span>}
        </button>

        {/* تعادل */}
        <button
          disabled={voted || loading}
          onClick={() => handleVote('draw')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition relative overflow-hidden ${
            voted ? 'bg-slate-950 border-slate-800' : 'bg-slate-800/60 border-slate-700 hover:border-amber-500'
          }`}
        >
          <span className="text-xs font-bold text-slate-200">تعادل</span>
          {voted && <span className="text-amber-400 font-mono text-xs font-bold">{drawPct}%</span>}
        </button>

        {/* فوز الضيف */}
        <button
          disabled={voted || loading}
          onClick={() => handleVote('away')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition relative overflow-hidden ${
            voted ? 'bg-slate-950 border-slate-800' : 'bg-slate-800/60 border-slate-700 hover:border-emerald-500'
          }`}
        >
          <span className="text-xs font-bold text-slate-200">{awayTeam}</span>
          {voted && <span className="text-emerald-400 font-mono text-xs font-bold">{awayPct}%</span>}
        </button>
      </div>

      {voted && (
        <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> تم تسجيل توقعك بنجاح!
        </div>
      )}
    </div>
  );
}