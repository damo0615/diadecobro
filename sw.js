const V='cobros-v2',SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Cache-first: responde desde cache; si no existe, va a la red y guarda (fuentes incluidas).
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(V).then(ch=>ch.put(e.request,c))}
    return r;
  }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
