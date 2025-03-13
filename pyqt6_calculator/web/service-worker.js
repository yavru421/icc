const CACHE_NAME = 'icc-calculator-v1.0.0';
const BASE_PATH = '/icc';  // GitHub Pages repo name
const FILES_TO_CACHE = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/styles.css`, 
    `${BASE_PATH}/app.js`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/assets/logo.png`,
    `${BASE_PATH}/assets/logo-192.png`,
    `${BASE_PATH}/assets/logo-512.png`,
    'https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Don't cache source maps
    if (event.request.url.endsWith('.map')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => {
                // Return offline fallback
                return caches.match(`${BASE_PATH}/index.html`);
            })
    );
});
