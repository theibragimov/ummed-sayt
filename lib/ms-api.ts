const BASE_URL = 'https://api.moysklad.ru/api/remap/1.2';

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.MOYSKLAD_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
  };
}

export async function fetchMS(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`MoySklad API error: ${res.status} ${path}`);
  return res.json();
}

export function formatSum(amount: number) {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

export function formatSumShort(amount: number) {
  const val = amount / 100;
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} mlrd`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} mln`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)} ming`;
  return val.toFixed(0);
}
