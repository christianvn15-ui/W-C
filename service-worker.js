// Increase this name when shipped files change so installed copies refresh.
const CACHE_NAME = "ons-v2";

// Core app shell
const APP_SHELL = [
  "/",
  "/startup.html",
  "/W&C.html",
  "/images.html",
  "/songs.html",
  "/style.css",
  "/main.js",
  "/Ons1.png",
  "/Ons2.png",
  "/Ons3.png",
  "/Ons4.png",
  "/Ons5.png",
  "/heart.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(APP_SHELL);
        console.log("App shell cached successfully");
      } catch (err) {
        console.error("Caching failed:", err);
      }
    })
  );
  self.skipWaiting();
});

// FETCH
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // The installed app may be launched at the site root even when the
  // manifest start URL is ignored by a browser or an older installation.
  const requestUrl = new URL(event.request.url);
  if (event.request.mode === "navigate" && requestUrl.pathname === "/") {
    event.respondWith(Response.redirect(new URL("/startup.html", self.location.origin), 302));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/startup.html");
          }
        });
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});
