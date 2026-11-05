// Самоуничтожающийся service worker. Serwist отключён, но у пользователей остался старый SW:
// браузер сам проверяет /sw.js при навигации, получает этот файл, и он чистит кэши, снимает регистрацию и перезагружает вкладки.
// Файл не удалять, пока у пользователей могут оставаться старые SW: без него браузер не узнает, что регистрацию пора снять.
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
            await self.registration.unregister();

            const clients = await self.clients.matchAll({ type: 'window' });
            clients.forEach((client) => client.navigate(client.url));
        })(),
    );
});
