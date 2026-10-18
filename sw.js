/* Точка опоры — Service Worker
   Авторы: Елена Осинцева, Тимур Хайретдинов.
   Кеширует основные файлы, чтобы приложение работало офлайн. */

const CACHE_NAME = 'tochka-opory-v36';
const ASSETS = [
  './',
  './index.html',
  './module-fin.html',
  './module-psy.html',
  './module-sup.html',
  './lesson.html',
  './lessons-data.js',
  './notebook.html',
  './breathing.html',
  './budget.html',
  './balance-wheel.html',
  './scam-game.html',
   './onboarding.js',
  './streak.js',
  './achievements.js',
  './daily-widgets.js',
  './growth-tree.js',
   './manifest.json',
  './ui-upgrade.js',
  './bottom-menu.js',
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

  // ⚠️ Игнорируем chrome-extension, moz-extension, file и любые другие схемы, кроме http/https
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
