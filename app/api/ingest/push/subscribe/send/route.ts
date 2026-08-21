import { NextResponse } from 'next/server';
import { broadcastPushNotification } from '@/lib/web-push';

export async function POST(req: Request) {
  try {
    const { title, message, url } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    await broadcastPushNotification(
      title,
      message,
      url || process.env.NEXT_PUBLIC_SITE_URL || 'https://edgefootball.com'
    );

    return NextResponse.json({ success: true, message: 'Broadcast sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}