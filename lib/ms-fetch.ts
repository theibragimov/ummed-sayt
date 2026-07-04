import { fetchMS } from './ms-api';
import { format } from 'date-fns';

export function msDate(d: Date) {
  return format(d, 'yyyy-MM-dd HH:mm:ss');
}

export async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export async function safeFetch(path: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchMS(path);
    } catch (e: any) {
      if (e.message?.includes('429') && i < retries - 1) {
        await sleep(1200 * (i + 1));
        continue;
      }
      console.error('safeFetch error:', path.substring(0, 80), e.message);
      return { rows: [], meta: { size: 0 } };
    }
  }
  return { rows: [], meta: { size: 0 } };
}

async function fetchPage(basePath: string, limit: number, offset: number) {
  const sep = basePath.includes('?') ? '&' : '?';
  return safeFetch(`${basePath}${sep}limit=${limit}&offset=${offset}`);
}

export async function fetchAllRows(basePath: string, maxRows = 5000): Promise<any[]> {
  const limit = basePath.includes('expand=') ? 100 : 1000;
  const first = await fetchPage(basePath, limit, 0);
  const rows = [...(first.rows || [])];
  const total = Math.min(Number(first.meta?.size) || rows.length, maxRows);

  if (rows.length < limit || rows.length >= total) {
    return rows.slice(0, maxRows);
  }

  const offsets: number[] = [];
  for (let offset = limit; offset < total; offset += limit) {
    offsets.push(offset);
  }

  const batchSize = 4;
  for (let i = 0; i < offsets.length; i += batchSize) {
    const pages = await Promise.all(
      offsets.slice(i, i + batchSize).map(offset => fetchPage(basePath, limit, offset))
    );
    for (const page of pages) {
      rows.push(...(page.rows || []));
      if (rows.length >= maxRows) return rows.slice(0, maxRows);
    }
  }

  return rows.slice(0, maxRows);
}

export const sumRows = (rows: any[]) =>
  (rows || []).reduce((s: number, d: any) => s + (Number(d.sum) || 0), 0);
