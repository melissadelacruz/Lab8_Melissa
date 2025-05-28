// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll([
        ...RECIPE_URLS,
        './', // Cache the root page
        './index.html',
        './assets/css/style.css',
        './assets/js/main.js',
        './assets/js/recipe-card.js',
        './assets/images/icons/1x/icon.png',
        './assets/images/icons/2x/icon.png',
        './assets/images/icons/4x/icon.png'
      ]);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
      // B8. TODO - If the request is in the cache, return with the cached version.
      //            Otherwise fetch the resource, add it to the cache, and return
      //            network response.
        if (cachedResponse) {
          return cachedResponse; // Serve from cache
        }

        // Not in cache? Fetch from network, cache it, and return it
        return fetch(event.request).then(function (networkResponse) {
          // Only cache successful responses (avoid opaque responses)
          if (networkResponse.ok && networkResponse.type !== 'opaque') {
            cache.put(event.request, networkResponse.clone()); // Cache the new response
          }
          return networkResponse; // Return the fresh network response
        }).catch(function (error) {
          // Fallback if fetch fails (e.g., offline)
          console.error('Fetch failed:', error);
          return new Response('Offline fallback'); // Could return a cached offline page
        });
      });
    })
  );
});
