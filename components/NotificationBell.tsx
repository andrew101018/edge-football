'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      setSubscribed(true);
      alert('تم تفعيل إشعارات الأهداف والأخبار العاجلة بنجاح!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
        subscribed
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
      }`}
    >
      <Bell className={`w-4 h-4 ${subscribed ? 'fill-emerald-400' : ''}`} />
      <span>{subscribed ? 'الإشعارات مفعلة' : 'تفعيل الإشعارات العاجلة'}</span>
    </button>
  );
}