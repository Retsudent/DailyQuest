const CACHE_NAME = "dailyquest-static-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL, "/manifest.webmanifest"]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  if (request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      if (request.mode === "navigate") {
        const offline = await caches.match(OFFLINE_URL);
        if (offline) return offline;
      }

      return Response.error();
    })
  );
});
