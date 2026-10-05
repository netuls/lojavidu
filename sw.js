// Push (FCM): a config chega pela URL de registro (?cfg=), definida no config.js
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp(JSON.parse(new URL(self.location).searchParams.get('cfg')));
  firebase.messaging().onBackgroundMessage(m => {
    const d = m.data || {};
    return self.registration.showNotification(d.title || 'Novo pedido', {
      body: d.body || '', icon: 'icon-192.png', badge: 'badge.png',
      tag: 'pedido-' + Date.now(),          // tag única: cada pedido gera um aviso novo, com som
      renotify: true, silent: false,         // garante o som padrão do sistema
      requireInteraction: true,              // fica na tela até você tocar (ignorado no iOS)
      vibrate: [300, 150, 300, 150, 500]     // ignorado no iOS
    });
  });
} catch (e) { console.error('SW push:', e); }

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = new URL('admin.html', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    const w = l.find(x => x.url.includes('admin.html'));
    return w ? w.focus() : clients.openWindow(alvo);
  }));
});

// Aumente o número da versão (v4 -> v5...) a cada atualização grande para limpar o cache dos aparelhos
const V = 'lojavidu-v4', SHELL = ['./', 'index.html', 'admin.html', 'style.css', 'app.js', 'admin.js', 'config.js', 'pix.js', 'logo.png', 'logo-emblem.png', 'logo-full.png', 'icon-192.png', 'icon-512.png', 'badge.png'];
self.addEventListener('install', e => {
  // Se algum arquivo falhar, não derruba a instalação do service worker (o push continua funcionando)
  e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => c.add(u).catch(err => console.warn('SW cache falhou:', u, err))))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // Firebase/CDN passam direto
  // 'no-cache': sempre pergunta ao servidor se há versão nova (evita pegar o arquivo antigo guardado pelo navegador)
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(res => {
    const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res;
  }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
