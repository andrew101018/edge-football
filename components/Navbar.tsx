import Link from 'next/link';
import { Activity, Trophy, Sparkles, Flame, Flag } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  return (
    <nav className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-6 py-3.5" dir="rtl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-emerald-400 tracking-wider">EDGE</span>
          <span className="text-xl font-bold text-white">FOOTBALL</span>
        </Link>

        {/* الروابط */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/live" className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 transition">
            <Activity className="w-4 h-4 text-red-500" />
            المباريات المباشرة
          </Link>
          <Link href="/standings" className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition">
            <Trophy className="w-4 h-4 text-amber-400" />
            ترتيب الدوريات
          </Link>
          <Link href="/top-scorers" className="flex items-center gap-1.5 text-slate-300 hover:text-orange-400 transition">
            <Flame className="w-4 h-4 text-orange-400" />
            الهدافين
          </Link>
          <Link href="/national-teams" className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition">
            <Flag className="w-4 h-4 text-emerald-400" />
            المنتخبات 🇪🇬
          </Link>
        </div>

        {/* زر تفعيل الإشعارات */}
        <div className="flex items-center gap-3">
          <NotificationBell />
        </div>

      </div>
    </nav>
  );
}