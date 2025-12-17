const CACHE_NAME = "attihc-v5";
const ASSETS = [
  "/",
  "/today",
  "/history",
  "/settings",
  "/offline.html",
  "/icons/maskable-192.svg",
  "/icons/maskable-512.svg"
];

/**
 * Determines if a URL should be cached.
 * This function is extracted to be easily tested.
 * @param {URL} url 
 * @returns {boolean}
 */
function shouldCache(url) {
  // Don't cache Next.js internal requests, API routes, or RSC payloads
  if (
    url.pathname.startsWith("/_next") || 
    url.pathname.startsWith("/api") || 
    url.searchParams.has("_rsc")
  ) {
    return false;
  }
  return true;
}

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => 
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
    ])
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  
  // Don't cache Next.js internal requests, API routes, or RSC payloads
  if (!shouldCache(url)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((res) => {
        // Only cache valid responses
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => {
        // Fallback for navigation requests only
        if (e.request.mode === 'navigate') {
          return caches.match("/offline.html");
        }
      });
    })
  );
});
