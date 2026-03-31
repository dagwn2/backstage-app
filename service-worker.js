const CACHE_NAME = "backstage-auto"; // stable name, no need to bump manually
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/icon.png",
  "/manifest.json"
];

// Install: cache all app files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // activate new SW immediately
});

// Activate: claim clients immediately
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch: serve cached files, but also update cache in background
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // update cache with new response
        if(event.request.method === "GET" && networkResponse.ok){
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(()=>{}); // ignore network errors

      // Return cached response immediately if available, otherwise network
      return cachedResponse || fetchPromise;
    })
  );
});
