import webpush from 'web-push';
import { supabaseAdmin } from './supabase';

const rawSubject = process.env.VAPID_SUBJECT || 'mailto:admin@edgefootball.com';
const vapidSubject = rawSubject.startsWith('http') || rawSubject.startsWith('mailto:')
  ? rawSubject
  : `mailto:${rawSubject}`;

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';

if (publicKey && privateKey) {
  webpush.setVapidDetails(vapidSubject, publicKey, privateKey);
}

export { webpush };

export async function sendWebPushNotification(title: string, body: string, url: string = '/') {
  try {
    const { data: subscriptions } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*');

    if (!subscriptions || subscriptions.length === 0) return;

    const payload = JSON.stringify({
      title,
      body,
      url,
      icon: '/icon-192.png',
    });

    const notifications = subscriptions.map((sub: any) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      ).catch((err: any) => {
        // حذف الاشتراكات التالفة أو منتهية الصلاحية تلقائياً
        if (err.statusCode === 410 || err.statusCode === 404) {
          supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
      })
    );

    await Promise.allSettled(notifications);
  } catch (error) {
    console.error('Push notification trigger error:', error);
  }
}