const CACHE_NAME = 'food-delivery-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/categories.html',
  '/foods.html',
  '/order.html',
  '/contact.html',
  '/offline.html',
  '/css/style.css',
  '/css/font-awesome/css/font-awesome.css',
  '/css/hover-min.css',
  '/js/custom.js',
  '/js/cart.js',
  '/js/order.js',
  '/js/auth.js',
  '/img/logo.webp',
  '/img/category/pizza.webp',
  '/img/category/sandwich.webp',
  '/img/category/burger.webp',
  '/img/food/p1.webp',
  '/img/food/s1.webp',
  '/img/food/b1.webp',
  '/img/food/pasta.webp',
  '/img/food/rasgulla.webp',
  '/img/food/paneer.webp',
  '/img/food/men-9405485_1280.webp',
  '/img/food/girl-7543957_1280.webp',
  '/img/food/men1.webp',
  
];

// Pages that should always show the offline page when network is unavailable
// const RESTRICTED_OFFLINE_PAGES = [
//   '/login.html',
//   '/register.html',
//   '/checkout.html',
//   '/payment.html',
//   '/account.html',
//   '/profile.html',
//   '/order-history.html',
//   '/food-search.html'
// ];

// Install service worker and cache the assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Helper function to determine if a request is for a page
function isHtmlRequest(request) {
  // Check the request's accept header or destination
  return (
    request.headers.get('accept')?.includes('text/html') ||
    request.mode === 'navigate'
  );
}

// Helper function to check if a URL is a restricted page when offline
function isRestrictedWhenOffline(url) {
  const path = new URL(url).pathname;
  return RESTRICTED_OFFLINE_PAGES.some(restrictedPath => 
    path === restrictedPath || path.endsWith(restrictedPath)
  );
}

// Fetch event - serve from cache, fall back to network, then offline page
self.addEventListener('fetch', event => {
  // Skip non-GET requests and requests to other domains
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response if available
          return cachedResponse;
        }

        // Not in cache, make network request
        return fetch(event.request)
          .then(networkResponse => {
            // Return the network response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response to store in cache
            const responseToCache = networkResponse.clone();
            
            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(error => {
            // Network failed, check if it's a page request
            if (isHtmlRequest(event.request)) {
              console.log('Network request failed, checking if restricted page');
              
              // If it's a restricted page when offline, always show the offline page
              if (isRestrictedWhenOffline(event.request.url)) {
                console.log('Restricted page requested while offline, showing offline page');
                return caches.match('/offline.html');
              }
              
              // For other pages, try to return the cached home page if available
              return caches.match('/index.html')
                .then(homePageResponse => {
                  if (homePageResponse) {
                    console.log('Serving cached home page as fallback');
                    return homePageResponse;
                  }
                  // If home page not in cache, show offline page
                  console.log('Home page not cached, showing offline page');
                  return caches.match('/offline.html');
                });
            }
            
            // Not a page request, might be an asset, just return the error
            throw error;
          });
      })
  );
}); 