import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.moysklad.ru/api/remap/1.2';

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
  });
  if (!res.ok) throw new Error(`MoySklad GET error: ${res.status} ${path}`);
  return res.json();
}

async function msPost(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MoySklad POST error: ${res.status} — ${text.substring(0, 200)}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items } = body;
    // customer: { name, company, phone }
    // items: [{ productId, name, quantity, price }]

    if (!customer?.name || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const orderPayload = {
      organization: { meta: org.meta },
      agent: { meta: agent.meta },
      description,
      positions,
    };

    const result = await msPost('/entity/customerorder', orderPayload);

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderName: result.name,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
