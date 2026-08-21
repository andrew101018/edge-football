export async function logSystemAlert(moduleName: string, error: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  const errorMessage = error?.message || JSON.stringify(error);
  console.error(`[${moduleName} Error]:`, errorMessage);

  if (!token || !adminChatId) return;

  const alertText = `
⚠️ <b>EDGE Football - تنبيه عطل بالنظام</b>

📍 <b>الوحدة:</b> ${moduleName}
🕒 <b>التوقيت:</b> ${new Date().toISOString()}
❌ <b>الخطأ:</b> <code>${errorMessage.slice(0, 300)}</code>
`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: alertText,
        parse_mode: 'HTML',
      }),
    });
  } catch (e) {
    console.error('Failed to dispatch Telegram error alert:', e);
  }
}