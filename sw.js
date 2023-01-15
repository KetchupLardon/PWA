self.addEventListener("install", e => {
    console.log("Install!");
    caches.open('Chat-PWA-Installed').then(
        cache => {
            cache.addAll([
                "index.html",
                "sw.js"
            ])
        }
    )
});
self.addEventListener("activate", e => {
    console.log("Activated!");
});


self.addEventListener("fetch", e => {
    console.log("Fetched!");
    if (!(e.request.url.indexOf('http') === 0)) return;
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(e.request).then(
                newResponse => {
                    caches.open( 'Chat-PWA-Installed' ).then(
                        cache => cache.put(e.request, newResponse)
                    );
                    return newResponse.clone();
                }
            );
        })
    );
});