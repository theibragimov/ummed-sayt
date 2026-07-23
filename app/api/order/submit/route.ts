import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const BASE_URL = 'https://api.moysklad.ru/api/remap/1.2';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/;

function validateOrder(customer: any, items: any[]): string | null {
  if (!customer?.name || typeof customer.name !== 'string' || customer.name.trim().length < 2) {
    return 'Ism noto\'g\'ri';
  }
  if (!customer?.phone || !PHONE_RE.test(customer.phone)) {
    return 'Telefon raqami noto\'g\'ri';
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 200) {
    return 'Mahsulotlar ro\'yxati noto\'g\'ri';
  }
  for (const item of items) {
    if (!item.productId || !UUID_RE.test(String(item.productId))) {
      return 'Mahsulot ID noto\'g\'ri';
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 9999) {
      return 'Miqdor noto\'g\'ri (1–9999)';
    }
    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 0) {
      return 'Narx noto\'g\'ri';
    }
  }
  return null;
}

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.MOYSKLAD_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
  };
}

async function msGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    console.error(`MoySklad GET error: ${res.status} ${path}`);
    throw new Error(`MoySklad GET error: ${res.status} ${path}`);
  }
  return res.json();
}

async function msPost(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`MoySklad POST error: ${res.status} ${path} — ${text.substring(0, 200)}`);
    throw new Error(`MoySklad POST error: ${res.status} ${path}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  // 3 ta buyurtma / 10 daqiqa (bir IP dan)
  if (!checkRateLimit(`order:${ip}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Juda ko\'p so\'rov. Biroz kuting.' }, { status: 429 });
  }

  const startedAt = Date.now();
  const timestamp = () => new Date().toISOString();
  const requestId = crypto.randomUUID().split('-')[0];

  console.log(`[ORDER_STARTED]\nRequestID: ${requestId}\nTimestamp: ${timestamp()}\nRequest received`);

  try {
    const body = await req.json();
    const { customer, items } = body;

    const validationError = validateOrder(customer, items);
    if (validationError) {
      const duration = Date.now() - startedAt;
      console.log(`[ORDER_FAILED]\nRequestID: ${requestId}\nTimestamp: ${timestamp()}\nDuration: ${duration}ms\nReason: ${validationError}`);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Get organization
    const orgData = await msGet('/entity/organization?limit=1');
    const org = orgData.rows?.[0];
    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 500 });

    // Get "Розничный покупатель" counterparty (default retail buyer in MoySklad)
    const agentSearch = await msGet('/entity/counterparty?filter=name%3D%D0%A0%D0%BE%D0%B7%D0%BD%D0%B8%D1%87%D0%BD%D1%8B%D0%B9+%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%B0%D1%82%D0%B5%D0%BB%D1%8C&limit=1');
    let agent = agentSearch.rows?.[0];
    // Fallback: use first counterparty
    if (!agent) {
      const anyAgent = await msGet('/entity/counterparty?limit=1');
      agent = anyAgent.rows?.[0];
    }
    if (!agent) return NextResponse.json({ error: 'No counterparty found' }, { status: 500 });

    // Build description (comment)
    const parts = [`Mijoz: ${customer.name}`];
    if (customer.company) parts.push(`Firma: ${customer.company}`);
    parts.push(`Tel: ${customer.phone}`);
    if (customer.address) parts.push(`Manzil: ${customer.address}`);
    const description = parts.join(' | ');

    // Build positions (support both product and variant types)
    const positions = items.map((item: any) => {
      const entityType = item.type === 'variant' ? 'variant' : 'product';
      return {
        quantity: Number(item.quantity),
        price: Number(item.price),
        assortment: {
          meta: {
            href: `${BASE_URL}/entity/${entityType}/${item.productId}`,
            type: entityType,
            mediaType: 'application/json',
          },
        },
      };
    });

    // Get "Склад Мед" store
    let skladMed: any = null;
    try {
      const storesData = await msGet('/entity/store?limit=100');
      skladMed = storesData.rows?.find((s: any) => s.name === 'Склад Мед') ?? null;
    } catch {}

    const orderPayload: any = {
      organization: { meta: org.meta },
      agent: { meta: agent.meta },
      description,
      positions,
    };
    if (skladMed) {
      orderPayload.store = { meta: skladMed.meta };
    }

    const result = await msPost('/entity/customerorder', orderPayload);

    const duration = Date.now() - startedAt;
    console.log(`[ORDER_SUCCESS]\nRequestID: ${requestId}\nTimestamp: ${timestamp()}\nDuration: ${duration}ms`);

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderName: result.name,
    });
  } catch (e: any) {
    const duration = Date.now() - startedAt;
    const httpMatch = e?.message?.match(/MoySklad (?:GET|POST) error: (\d{3}) /);
    const reason = httpMatch
      ? `HTTP ${httpMatch[1]}`
      : e?.name === 'TimeoutError' || e?.name === 'AbortError'
        ? 'Timeout'
        : e?.message ?? 'Unknown error';
    console.log(`[ORDER_FAILED]\nRequestID: ${requestId}\nTimestamp: ${timestamp()}\nDuration: ${duration}ms\nReason: ${reason}`);
    console.error('order/submit xato:', e);
    return NextResponse.json({ error: 'Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.' }, { status: 500 });
  }
}
