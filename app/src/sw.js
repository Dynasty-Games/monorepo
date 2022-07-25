// const version = __buildDate__
// const oldVersion = __lastbuildDate__
//
// const addResourcesToCache = async (resources) => {
//   const cache = await caches.open(version);
//   await cache.addAll(resources);
// };
//
// const putInCache = async (request, response) => {
//   const cache = await caches.open(version);
//   await cache.put(request, response);
// };
//
// const activate = async () => {
//   if (self.registration.navigationPreload) {
//     // Enable navigation preloads!
//     await self.registration.navigationPreload.enable();
//   }
// }
//
// self.addEventListener('activate', async event => {
//
//   event.waitUntil(async () => {
//     await activate()
//     return clients.claim()
//   })
//
//
// });
//
// self.addEventListener('install', async (event) => {
//   self.skipWaiting();
//   event.waitUntil(async () => {
//
//     await addResourcesToCache([
//       '/index.html',
//       '/shell.js',
//       '/home.js',
//       '/themes/dark.js'
//     ])
//
//
//   });
//
//
// });
//
// const cacheFirst = async (request, preloadResponse) => {
//   const responseFromCache = await caches.match(request);
//   if (responseFromCache) return responseFromCache;
//   let responseFromNetwork = await preloadResponse;
//
//   if (!responseFromNetwork) responseFromNetwork = await fetch(request);
//
//   if (request.method !== 'POST') putInCache(request, responseFromNetwork.clone())
//   return responseFromNetwork;
// };
//
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     cacheFirst(event.request, event.preloadResponse)
//   )
//
// });

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    });
});
