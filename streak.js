/* Точка опоры — Service Worker
   Авторы: Елена Осинцева, Тимур Хайретдинов.
   Кеширует основные файлы, чтобы приложение работало офлайн.
   При обновлении версии — поменяй CACHE_NAME. */

const CACHE_NAME = 'tochka-opory-v6';
const ASSETS = [
  './',
  './index.html',
  './module-fin.html',
  './module-psy.html',
  './module-sup.html',
  './lesson.html',
  './notebook.html',
  './breathing.html',
  './budget.html',
  './onboarding.js',
  './streak.js',
  './achievements.js',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});