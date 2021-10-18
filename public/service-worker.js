const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "styles.css",
    "/index.js",
    "/manifest.json",
    "/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
self.addEventListener("install", function (e){
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>{
            console.log('installing cache:' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    )
});

self.addEventListener('activate', function (e){
    e.waitUntil(
        caches.keys().then(function (keyList){
            let cachekeepList = keyList.filter(function (key){
                return key.indexOf(APP_PREFIX);
            });
            cachekeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key,i){
                if (cachekeepList.indexOf(key) === -1) {
                    console.log('deleting cache:'+ keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    )
});
self.addEventListener('fetch', function (e) {
    console.log('fetch request :' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request){
            if (request) {
                console.log('responding with cache :' + e.request.url);
                return request
            } else {
                console.log('file is not cached, fetching :' + e.request.url);
                return fetch(e.request)
            }
        })
    )
});