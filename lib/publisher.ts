interface PublishPayload {
  caption: string;
  imageUrl?: string;
  linkUrl?: string;
}

// 1. النشر الفوري على قناة/جروب تليجرام
export async function publishToTelegram({ caption, imageUrl }: PublishPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error('Telegram credentials missing');
  }

  const endpoint = imageUrl
    ? `https://api.telegram.org/bot${token}/sendPhoto`
    : `https://api.telegram.org/bot${token}/sendMessage`;

  const body = imageUrl
    ? { chat_id: chatId, photo: imageUrl, caption, parse_mode: 'HTML' }
    : { chat_id: chatId, text: caption, parse_mode: 'HTML' };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'Failed to post to Telegram');
  return data;
}

// 2. النشر على صفحة فيسبوك عبر Meta Graph API
export async function publishToFacebook({ caption, imageUrl, linkUrl }: PublishPayload) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error('Facebook credentials missing');
  }

  const endpoint = imageUrl
    ? `https://graph.facebook.com/v19.0/${pageId}/photos`
    : `https://graph.facebook.com/v19.0/${pageId}/feed`;

  const params = new URLSearchParams({
    access_token: accessToken,
    ...(imageUrl ? { url: imageUrl, caption } : { message: caption, link: linkUrl || '' }),
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'POST',
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}