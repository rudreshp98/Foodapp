const CACHE_NAME = 'food-delivery-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/categories.html',
  '/foods.html',
  '/order.html',
  '/contact.html',
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

const RESTRICTED_OFFLINE_PAGES = [
  '/login.html',
  '/register.html',
  '/checkout.html',
  '/payment.html',
  '/account.html',
  '/profile.html',
  '/order-history.html',
  '/food-search.html',
  '/categories.html',  // newly added
  '/foods.html',       // newly added
  '/order.html',       // newly added
  '/cart.html'         // newly added
];

// Install event - pre-cache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching core assets');
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('[Service Worker] Failed to cache assets:', error);
    })
  );
  self.skipWaiting(); // activate immediately after install
});

// Activate event - clean old caches and take control
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim(); // take control immediately
});

// Utility: Is it a navigation (HTML) request?
function isHtmlRequest(request) {
  return request.mode === 'navigate' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));
}

// Fetch event - fallback to home page if offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (isHtmlRequest(event.request)) {
    const url = new URL(event.request.url);
    
    // Block restricted pages from being served offline
    if (RESTRICTED_OFFLINE_PAGES.includes(url.pathname)) {
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            console.log(`[Service Worker] Offline - restricted page: ${url.pathname}`);
            return caches.match('/index.html');
          })
      );
      return;
    }

    // Handle allowed HTML page requests
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return caches.match('/index.html');
          }
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Offline - serving home page');
          return caches.match('/index.html');
        })
    );
  } else {
    // Handle static assets
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fail silently if asset not cached
            return caches.match('/index.html');
          });
      })
    );
  }
});
