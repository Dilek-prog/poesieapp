
importScripts('/src/js/idb.js');
  
workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.NetworkFirst()     // NetworkFirst() vs CacheFirst()
)

const CURRENT_STATIC_CACHE = 'static-3';
const CURRENT_DYNAMIC_CACHE = 'dynamic-3';

self.addEventListener('activate', event => {
    console.log('service worker --> activating ...', event);
    event.waitUntil(
        caches.keys()
            .then( keyList => {
                return Promise.all(keyList.map( key => {
                    if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                        console.log('service worker --> old cache removed :', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    console.log('service worker --> fetching ...', event);
    event.respondWith(fetch(event.request));
})

const STATIC_FILES = [
    '/',
    '/index.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/material.min.js',
    '/src/js/idb.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/htw.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css'
];

self.addEventListener('install', event => {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
        caches.open(CURRENT_STATIC_CACHE)
        .then(cache => {
            console.log('Service-Worker-Cache erzeugt und offen');
            cache.addAll(STATIC_FILES);
        })
    );
})

const db = idb.openDB('posts-store', 1, {
    upgrade(db) {
        // Create a store of objects
        const store = db.createObjectStore('posts', {
            // The '_id' property of the object will be the key.
            keyPath: '_id',
            // If it isn't explicitly set, create a value by auto incrementing.
            autoIncrement: true,
        });
        // Create an index on the '_id' property of the objects.
        store.createIndex('_id', '_id');
    },
});


self.addEventListener('fetch', event => {
    if (!(event.request.url.indexOf('http') === 0)) return;
    const url = 'http://localhost:3000/posts';
    if(event.request.url.indexOf(url) >= 0) {
        event.respondWith(
            fetch(event.request)
                .then ( res => {
                    // hier Anfrage an http://localhost:3000/posts behandeln
                    return res;
                })
        )
    } else {
    event.respondWith(
        caches.match(event.request)
            .then( response => {
                if(response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then( res => {     // nicht erneut response nehmen, haben wir schon
                            return caches.open('dynamic')      // neuer, weiterer Cache namens dynamic
                                .then( cache => {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        });
                }
            })
    )}
})