const cacheName = 'v1';



self.addEventListener('install', (e) => {
  console.log('Service Worker Installed');
});


self.addEventListener('activate', (e) => {
  console.log('Service Worker Activated');

  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      // Loop through all the promises and check the cache names
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            console.log('Service Worker: Removing old cache');
            return caches.delete(cache);
          }
        })
      )
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('Service Worker Fetching');
  

  e.respondWith(
    fetch(e.request) // Fetch our request
      .then(response => {
        // Clone the respone
        const resClone = response.clone();

        // Open cache
        caches.open(cacheName).then(cache => {
          // Add the response to our cache
          cache.put(e.request, resClone);
        });
        return response;
      })
      .catch(err => caches.match(e.request).then(res => res)) // If error/offline, respond with cache
  );
});