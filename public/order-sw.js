// Mahsulot rasmlari keshi (Online Buyurtma).
// MoySklad miniatyuralari bir marta yuklangach qurilmaning o'zida saqlanadi va keyingi
// safar internetdan emas, shu keshdan darhol ko'rsatiladi. Rasm yangilansa MoySklad unga
// yangi manzil beradi, shuning uchun eski rasm ko'rinib qolmaydi.
// Faqat MoySklad rasmlariga tegadi — sayt sahifalari va API so'rovlari o'zgarishsiz o'tadi.
// Vercel orqali o'tmaydi, limitga ta'sir qilmaydi.

const CACHE = 'order-images-v1';
const HOSTS = ['miniature-prod.moysklad.ru', 'tinyimage-prod.moysklad.ru'];
const MAX_ENTRIES = 3000;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('order-images-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function trim(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map(k => cache.delete(k)));
}

async function fromCacheOrNetwork(request) {
  const cache = await caches.open(CACHE);
  const url = request.url;
  const hit = await cache.match(url);
  if (hit) return hit;

  let res;
  try {
    res = await fetch(url, { mode: 'cors', credentials: 'omit' });
  } catch {
    // CORS ishlamasa — oddiy yuklash (kesh uchun ham yaroqli)
    res = await fetch(url, { mode: 'no-cors', credentials: 'omit' });
  }
  if (res.ok || res.type === 'opaque') {
    cache.put(url, res.clone()).then(() => trim(cache)).catch(() => {});
  }
  return res;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let host;
  try { host = new URL(req.url).hostname; } catch { return; }
  if (!HOSTS.includes(host)) return;
  event.respondWith(fromCacheOrNetwork(req).catch(() => fetch(req)));
});
