// Service worker do Livro de Caixa — só cuida de receber e mostrar as
// notificações push. Não faz cache de nada (o app em si continua sendo
// carregado normal, direto do GitHub Pages).

self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }
  const title = data.title || 'Livro de Caixa';
  const body = data.body || '';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: 'livro-caixa',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
