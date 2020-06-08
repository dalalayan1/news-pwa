const cachedAssets = [
    './',
    './app.js',
    './styles.css'
];

self.addEventListener('install', async evt => {
    console.log('SW installed');

    const staticCache = await caches.open('static-cache');
    staticCache.addAll(cachedAssets);
});

self.addEventListener('fetch', evt => {
    console.log('SW fetched');

    const req = evt.request;
    const url = new URL(req.url);


    if (url.origin === location.origin) { //return cached data in case of same origin requests
        evt.respondWith(cacheFirst(req));
    }
    else { //return network fetched data and store in cache
        evt.respondWith(networkFtrst(req));
    }
});


async function cacheFirst(req) {
    //check for data in cache or fetch from network
    const cachedRes = caches.match(req);
    return cachedRes || fetch(req);
}

async function networkFtrst(req) {
    const newsCache = await caches.open('news-cache');

    try {
        //store network fetched data in cache and return it
        const res = await fetch(req);
        newsCache.put(req, res.clone());
        return res;
    } catch (error) {
        //return cached data in case of error
        return await newsCache.match(req);
    }
}

