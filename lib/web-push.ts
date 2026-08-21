import webpush from 'web-push';
import { supabaseAdmin } from './supabase';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function broadcastPushNotification(title: string, message: string, url: string) {
  const { data: subs } = await supabaseAdmin.from('push_subscriptions').select('*');

  if (!subs || subs.length === 0) return;

  const payload = JSON.stringify({
    title,
    body: message,
    url,
    icon: '/icon.png',
  });

  const sendPromises = subs.map((sub) =>
    webpush
      .sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      )
      .catch((err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // حذف الاشتراكات منتهية الصلاحية
          supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
      })
  );

  await Promise.all(sendPromises);
}