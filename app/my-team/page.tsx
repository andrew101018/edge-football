'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trophy, Clock, ArrowRight, Sparkles } from 'lucide-react';

const POPULAR_TEAMS = [
  { id: 'alahly', name: 'الأهلي', league: 'الدوري المصري', logo: '🦅' },
  { id: 'zamalek', name: 'الزمالك', league: 'الدوري المصري', logo: '🏹' },
  { id: 'liverpool', name: 'ليفربول', league: 'الدوري الإنجليزي', logo: '🔴' },
  { id: 'realmadrid', name: 'ريال مدريد', league: 'الدوري الإسباني', logo: '⚪' },
  { id: 'barcelona', name: 'برشلونة', league: 'الدوري الإسباني', logo: '🔵🔴' },
  { id: 'arsenal', name: 'أرسنال', league: 'الدوري الإنجليزي', logo: '🔴⚪' },
  { id: 'manchestercity', name: 'مانشستر سيتي', league: 'الدوري الإنجليزي', logo: '🩵' },
];

export default function MyTeamPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>('alahly');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edge_fav_team');
    if (saved) setSelectedTeam(saved);
  }, []);

  useEffect(() => {
    const fetchTeamArticles = async () => {
      setLoading(true);
      try {
        const teamObj = POPULAR_TEAMS.find((t) => t.id === selectedTeam);
        const teamName = teamObj ? teamObj.name : 'الأهلي';
        const res = await fetch(`/api/my-team/feed?query=${encodeURIComponent(teamName)}`);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTeam) {
      localStorage.setItem('edge_fav_team', selectedTeam);
      fetchTeamArticles();
    }
  }, [selectedTeam]);

  const activeTeamObj = POPULAR_TEAMS.find((t) => t.id === selectedTeam);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">ركن فريقي المفضل (My Team)</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">تغطية مخصصة وفورية لأخبار ومباريات ناديك المفضل لحظة بلحظة</p>
            </div>
          </div>
        </div>

        {/* أزرار اختيار النادي */}
        <div className="flex flex-wrap gap-2.5">
          {POPULAR_TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition border ${
                selectedTeam === team.id
                  ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{team.logo}</span>
              <span>{team.name}</span>
            </button>
          ))}
        </div>

        {/* عرض الأخبار المخصصة */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              أحدث أخبار {activeTeamObj?.name}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {articles.length} تقرير متاح
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-xs">جارِ جلب أحدث كواليس وتغطيات النادي...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-sm">
              لا توجد أخبار مسجلة حديثاً تخص نادي {activeTeamObj?.name}. تابعنا للمزيد فور صدور البيانات الرسمية!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  className="bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-300 font-semibold">{art.league || 'عام'}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(art.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-100 line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="text-xs text-rose-400 font-bold flex items-center gap-1 pt-2 border-t border-slate-800/60">
                    <span>اقرأ التقرير الكامل</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}