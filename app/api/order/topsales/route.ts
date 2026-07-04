import { NextResponse } from 'next/server';
import { fetchMS } from '@/lib/ms-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    const fmt = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19);

    // Fetch profit report sorted by quantity descending (server-side sort)
    const data = await fetchMS(
      `/report/profit/byproduct?momentFrom=${fmt(from)}&momentTo=${fmt(now)}&limit=100&order=quantity%2Cdesc`
    );

    const rows: any[] = data?.rows ?? [];

    // Build variant -> parent product map for cross-referencing
    // (profit report returns parent product IDs for variant products)
    const variantData = await fetchMS('/entity/variant?limit=1000&offset=0').catch(() => null);
    const variantRows: any[] = variantData?.rows ?? [];
    if (variantData?.rows?.length === 1000) {
      const page2 = await fetchMS('/entity/variant?limit=1000&offset=1000').catch(() => null);
      variantRows.push(...(page2?.rows ?? []));
    }

    // parentId -> Set of variantIds
    const productToVariants: Record<string, string[]> = {};
    for (const v of variantRows) {
      const vid = v.id;
      const pid = (v.product?.meta?.href || '').split('/').pop();
      if (vid && pid) {
        if (!productToVariants[pid]) productToVariants[pid] = [];
        productToVariants[pid].push(vid);
      }
    }

    // rows are already sorted by quantity desc from API
    // Take top 10 and top 50 by actual quantity
    const top10 = new Set<string>();
    const top50 = new Set<string>();

    // Count unique products (by parent or by self), respecting quantity ranking
    let rank = 0;
    const seenParents = new Set<string>();

    for (const row of rows) {
      if (rank >= 50) break;
      const href: string = row.assortment?.meta?.href ?? '';
      const id = href.split('/').pop();
      if (!id) continue;
      const qty = row.sellQuantity ?? 0;
      if (qty <= 0) continue;

      // Determine parent product ID (if this is a product with variants, use its own ID as parent)
      const isParent = !!productToVariants[id];
      const parentId = isParent ? id : null;

      // Deduplicate: if parent already counted, skip to avoid counting same product twice
      const dedupeKey = parentId ?? id;
      if (seenParents.has(dedupeKey)) continue;
      seenParents.add(dedupeKey);

      rank++;

      if (rank <= 10) {
        top10.add(id);
        if (isParent) {
          for (const vid of productToVariants[id]) top10.add(vid);
        }
      }
      if (rank <= 50) {
        top50.add(id);
        if (isParent) {
          for (const vid of productToVariants[id]) top50.add(vid);
        }
      }
    }

    return NextResponse.json({ top10: [...top10], top50: [...top50] });
  } catch (e: any) {
    return NextResponse.json({ top10: [], top50: [], error: e.message });
  }
}
