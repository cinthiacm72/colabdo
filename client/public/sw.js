const CACHE_NAME = "colabDo-cache-v1";
const urlsToCache = ["/", "/index.html", "/favicon.ico"];

// Instalar y guardar en caché archivos iniciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar y limpiar cachés viejas
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
    )
  );
});

// Interceptar requests y servir desde cache si es posible
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 👉 Si la request va a tu API, no la cachees, dejala pasar
  if (url.origin.includes("colabdo-server.vercel.app")) {
    return;
  }

  // Para todo lo demás, sí aplicás cache-first
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // devolver desde cache
      }
      return fetch(event.request).catch(() => {
        // Fallback opcional si falla la red
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
  /*  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  ); */
});
