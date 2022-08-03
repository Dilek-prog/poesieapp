importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );
  
workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.NetworkFirst()     // NetworkFirst() vs CacheFirst()
)

self.addEventListener('activate', event => {
    console.log('service worker --> activating ...', event);
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    console.log('service worker --> fetching ...', event);
    event.respondWith(fetch(event.request));
})

self.addEventListener('install', event => {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
        caches.open('static')
            .then( cache => {
                console.log('Service-Worker-Cache erzeugt und offen');
                cache.add('/src/js/app.js');
            })
    );
})