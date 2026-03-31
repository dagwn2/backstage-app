const CACHE_NAME = "backstage-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// Install → cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch → serve from cache first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
