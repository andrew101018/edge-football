import { NextResponse } from 'next/server';
import { sendWebPushNotification } from '@/lib/web-push';

export async function POST(req: Request) {
  try {
    const { title, body, url } = await req.json();
    await sendWebPushNotification(title || 'إشعار جديد', body || 'متابعة كروية فورية', url || '/');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}