const CACHE='the-king-v5-1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin && (url.pathname.endsWith('/index.html') || url.pathname.endsWith('/sw.js'))){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok && url.pathname.endsWith('/index.html')) caches.open(CACHE).then(c=>c.put(e.request,r.clone())); return r;}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok && url.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}return r;}).catch(()=>caches.match(e.request)));
});
