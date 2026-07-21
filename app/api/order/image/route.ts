import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.MOYSKLAD_TOKEN!;
const BASE = 'https://api.moysklad.ru/api/remap/1.2';

const ALLOWED = ['miniature-prod.moysklad.ru', 'tinyimage-prod.moysklad.ru', 'api.moysklad.ru', 'online.moysklad.ru'];

async function proxyUrl(url: string): Promise<NextResponse> {
  let host: string;
  try { host = new URL(url).hostname; } catch { return new NextResponse('Invalid URL', { status: 400 }); }
  if (!ALLOWED.some(d => host === d)) return new NextResponse('Forbidden', { status: 403 });

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'Accept-Encoding': 'gzip' },
  });
  if (!res.ok) return new NextResponse(null, { status: res.status });
  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const href = searchParams.get('href');
  const id = searchParams.get('id');
  const entityType = searchParams.get('t') || 'product'; // 'product' or 'variant'
  const full = searchParams.get('full') === '1';

  // ?href= mode: proxy a known miniature URL directly (used for thumbnails)
  if (href && !full) {
    return proxyUrl(href);
  }

  // ?id=&full=1 mode: fetch the original full-size image from MoySklad
  // For variants, images live on the parent product — use product endpoint
  if (id && full) {
    try {
      // Variants inherit images from the product; get parent product first if variant
      let productId = id;
      if (entityType === 'variant') {
        const varRes = await fetch(`${BASE}/entity/variant/${id}`, {
          headers: { Authorization: `Bearer ${TOKEN}`, 'Accept-Encoding': 'gzip' },
        });
        if (varRes.ok) {
          const varData = await varRes.json();
          const productHref: string = varData.product?.meta?.href || '';
          if (productHref) productId = productHref.split('?')[0].split('/').pop() || id;
        }
      }

      const listRes = await fetch(`${BASE}/entity/product/${productId}/images?limit=1`, {
        headers: { Authorization: `Bearer ${TOKEN}`, 'Accept-Encoding': 'gzip' },
      });
      if (!listRes.ok) return new NextResponse(null, { status: 404 });

      const listData = await listRes.json();
      const downloadHref: string = listData.rows?.[0]?.meta?.downloadHref || '';
      if (!downloadHref) return new NextResponse(null, { status: 404 });

      return proxyUrl(downloadHref);
    } catch {
      return new NextResponse(null, { status: 500 });
    }
  }

  // ?href= fallback for full mode
  if (href) return proxyUrl(href);

  return new NextResponse('Missing params', { status: 400 });
}
