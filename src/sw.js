// fibub's service worker: lets people install fibub as an app and keeps the pages they open working
// with no internet. scripts/make-sw.mjs copies this file to dist/sw.js after each build, filling in
// VERSION (changes when the site changes) and PRECACHE (the offline page and the home page with their files).
//
// What it keeps, all in this browser only (Cache Storage), never sent anywhere:
//   - pages the visitor has opened (newest copy from the network first, so a new deploy shows at once;
//     the kept copy only when offline or the network is very slow), up to MAX_PAGES;
//   - the site's own files (/_astro/ scripts and styles, icons, OCR files) after first use.
// It never touches /api/ (the counters), other sites, or anything that is not a plain GET.
const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const CORE = `fibub-core-${VERSION}`; // the offline page and home page, replaced on every new version
const PAGES = 'fibub-pages-v1'; // pages the visitor opened
const FILES = 'fibub-files-v1'; // scripts, styles, images and other files
const MAX_PAGES = 400;
const MAX_FILES = 1500;
const SLOW_MS = 4000;
const ANY = { ignoreVary: true }; // the precache was fetched without the headers a script tag sends (Vary: Origin) // after this long without an answer, show the kept copy of a page if there is one

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CORE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('fibub-core-') && key !== CORE) await caches.delete(key);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return;
  if (req.mode === 'navigate') return event.respondWith(page(event));
  // A page fetched ahead of a click (prefetch on hover) is kept only once it is really opened.
  if (url.pathname.endsWith('/') && url.pathname !== '/nav/') return;
  if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/ocr/')) return event.respondWith(cacheFirst(req));
  event.respondWith(fresh(req));
});

// Pages: the network first (so updates show at once), the kept copy when offline or very slow,
// then the offline page.
async function page(event) {
  const req = event.request;
  const key = pageKey(req.url);
  const network = (async () => {
    const res = (await event.preloadResponse) || (await fetch(req));
    if (res.ok && res.type === 'basic' && !res.redirected) {
      const copy = res.clone();
      event.waitUntil(caches.open(PAGES).then(async (c) => { await c.put(key, copy); await trim(c, MAX_PAGES); }));
    }
    return res;
  })();
  event.waitUntil(network.catch(() => {}));
  const kept = await matchPage(key);
  if (!kept) {
    try { return await network; } catch { return (await caches.match('/offline/', ANY)) || Response.error(); }
  }
  let timer;
  const slow = new Promise((resolve) => { timer = setTimeout(() => resolve(kept), SLOW_MS); });
  try { return await Promise.race([network, slow]); } catch { return kept; } finally { clearTimeout(timer); }
}

// One copy per page, whatever is after the ? or # (a tool may put its settings there).
function pageKey(href) {
  const u = new URL(href);
  return u.origin + u.pathname;
}
async function matchPage(key) {
  return (await (await caches.open(PAGES)).match(key, ANY)) || (await caches.match(key, { ...ANY, cacheName: CORE }));
}

// Files whose names change whenever they change (/_astro/) or that are pinned to a version (/ocr/).
async function cacheFirst(req) {
  const hit = await caches.match(req, ANY);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok && res.type === 'basic') {
    const copy = res.clone();
    caches.open(FILES).then(async (c) => { await c.put(req, copy); await trim(c, MAX_FILES); });
  }
  return res;
}

// Everything else (icons, /nav/, /tools.json, images): the network first, the kept copy offline.
async function fresh(req) {
  try {
    const res = await fetch(req);
    if (res.ok && res.type === 'basic') {
      const copy = res.clone();
      caches.open(FILES).then(async (c) => { await c.put(req, copy); await trim(c, MAX_FILES); });
    }
    return res;
  } catch (e) {
    const hit = await caches.match(req, ANY);
    if (hit) return hit;
    throw e;
  }
}

// Keep a cache to its size by dropping the oldest entries first.
async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
