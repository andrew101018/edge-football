export async function publishToTelegram(
  caption: string | undefined,
  articleUrl: string,
  imageUrl?: string
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ Telegram Bot Token or Chat ID is missing. Skipping telegram publish.');
    return;
  }

  // ضمان وجود نص في الرسالة حتى لو رجع الـ AI كابشن فارغ
  const messageText = caption && caption.trim().length > 0
    ? `${caption}\n\n🔗 التفاصيل الكاملة: ${articleUrl}`
    : `🚨 خبر جديد من EDGE Football\n\n🔗 التفاصيل الكاملة: ${articleUrl}`;

  try {
    if (imageUrl) {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: imageUrl,
          caption: messageText.slice(0, 1024), // حد تليجرام الأقصى للكابشن
        }),
      });

      const resData = await response.json();
      if (!resData.ok) {
        // Fallback إلى رسالة نصية عادية إذا فشل رابط الصورة
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
          }),
        });
      }
    } else {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
        }),
      });
    }
  } catch (error) {
    console.error('Telegram publication error:', error);
  }
}