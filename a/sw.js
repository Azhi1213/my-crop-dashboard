// ─── CamPrice Service Worker ────────────────────────────────────────────────
const CACHE_NAME = "camprice-v1";
const STATIC_CACHE = "camprice-static-v1";

// Files to cache immediately on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/src/App.jsx",
  "/src/main.jsx",
  "/src/index.css",
];

// ── Install: pre-cache all static assets ──────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Some files may not exist yet, that's okay
      });
    })
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: serve from cache first, then network ───────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and external API calls (Supabase)
  if (request.method !== "GET") return;
  if (url.hostname.includes("supabase.co")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Serve from cache instantly, update in background
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);
        return cached;
      }

      // Not in cache — fetch from network and cache it
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Offline fallback — return cached index.html
          if (request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});