self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || '通知';
  const options = {
    body: data.body || '新しいメッセージが届きました。',
    icon: '/icons/icon-192x192.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
