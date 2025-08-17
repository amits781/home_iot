// public/service-worker.js

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  // You can cache static assets here if needed
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  // You can clean up old caches here
});

self.addEventListener('fetch', event => {
  // You could intercept requests and serve from cache, if desired
  // For pure registration, you can leave this empty
});
