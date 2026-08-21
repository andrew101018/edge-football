// استقبال الإشعار من السيرفر وعرضه في المتصفح
self.addEventListener('push', function (event) {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icon.png',
    badge: '/badge.png',
    data: {
      url: data.url || '/',
    },
    vibrate: [100, 50, 100],
    dir: 'rtl',
    lang: 'ar',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// توجيه المستخدم لصفحة الخبر أو المباراة فور الضغط على الإشعار
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});