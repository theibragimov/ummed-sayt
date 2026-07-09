import { NextRequest, NextResponse } from 'next/server';
import { fetchMS } from '@/lib/ms-api';
import { getCached } from '@/lib/server-cache';

async function safe(path: string) {
  try { return await fetchMS(path); } catch { return null; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const priceTypeId = searchParams.get('priceTypeId') || process.env.ORDER_PRICE_TYPE_ID || '';

  try {
    const payload = await getCached(`order-catalog:${priceTypeId}`, 300_000, async () => {
    // 1. Price types (returns array directly, not {rows:[]})
    const priceTypesRaw = await safe('/context/companysettings/pricetype');
    const priceTypes: { id: string; name: string }[] = (Array.isArray(priceTypesRaw) ? priceTypesRaw : [])
      .map((p: any) => ({ id: p.id, name: p.name }));

    const selectedPriceType = priceTypeId
      ? priceTypes.find(p => p.id === priceTypeId)
      : priceTypes[0] || null;

    // 2. Fetch ALL product folders (to build parent-child hierarchy)
    const folderMap: Record<string, { id: string; name: string; parentId: string | null }> = {};
    let fOffset = 0;
    while (true) {
      const data = await safe(`/entity/productfolder?limit=100&offset=${fOffset}`);
      if (!data?.rows?.length) break;
      for (const f of data.rows) {
        const parentId = f.productFolder?.meta?.href?.split('/').pop() || null;
        folderMap[f.id] = { id: f.id, name: f.name, parentId };
      }
      if (data.rows.length < 100) break;
      fOffset += 100;
    }

    // Get root ancestor of a folder (top-level parent)
    const getRootFolder = (folderId: string): string => {
      let current = folderMap[folderId];
      if (!current) return folderId;
      let depth = 0;
      while (current.parentId && folderMap[current.parentId] && depth < 10) {
        current = folderMap[current.parentId];
        depth++;
      }
      return current.id;
    };

    // Get all descendant folder IDs (including itself)
    const getDescendants = (folderId: string): string[] => {
      const result: string[] = [folderId];
      for (const f of Object.values(folderMap)) {
        if (f.parentId === folderId) {
          result.push(...getDescendants(f.id));
        }
      }
      return result;
    };

    // 3. Fetch stock report
    const stockRows: any[] = [];
    let offset = 0;
    while (true) {
      const data = await safe(`/report/stock/all?stockMode=nonEmpty&limit=1000&offset=${offset}`);
      if (!data?.rows?.length) break;
      stockRows.push(...data.rows);
      if (data.rows.length < 1000 || stockRows.length >= 8000) break;
      offset += 1000;
    }

    // Build stock map
    const stockMap: Record<string, {
      stock: number; imageHref: string; name: string; code: string;
      defaultPrice: number; type: string;
      folderId: string; folderName: string;
      rootFolderId: string; rootFolderName: string;
      parentProductId: string;
    }> = {};

    for (const row of stockRows) {
      const rowType = row.meta?.type || 'product';
      if (rowType !== 'product' && rowType !== 'variant') continue;
      const href = (row.meta?.href || '').split('?')[0];
      const productId = href.split('/').pop();
      if (!productId) continue;
      const miniatureHref = row.image?.miniature?.downloadHref || '';
      const folderId = (row.folder?.meta?.href || '').split('?')[0].split('/').pop() || '';
      const folderName = row.folder?.name || '';
      const rootFolderId = folderId ? getRootFolder(folderId) : folderId;
      const rootFolderName = rootFolderId ? (folderMap[rootFolderId]?.name || folderName) : folderName;

      const parentProductId = rowType === 'variant'
        ? ((row.product?.meta?.href || '').split('?')[0].split('/').pop() || '')
        : '';
      stockMap[productId] = {
        stock: Math.floor(Number(row.quantity) || 0),
        imageHref: miniatureHref,
        name: row.name || '',
        code: row.code || '',
        defaultPrice: Number(row.salePrice) || 0,
        type: rowType,
        folderId,
        folderName,
        rootFolderId,
        rootFolderName,
        parentProductId,
      };
    }

    const productIds = Object.keys(stockMap);
    if (productIds.length === 0) {
      return { priceTypes, selectedPriceType, categories: [], products: [] };
    }

    // 4. Build variantToProduct map (always) + price map for custom price type
    // variantToProduct: variantId -> parentProductId
    const variantToProduct: Record<string, string> = {};
    let priceMap: Record<string, number> = {};
    const useCustomPrice = !!(priceTypeId && selectedPriceType);

    // Always fetch variants to get parentProductId mapping
    {
      let vOffset = 0;
      while (true) {
        const expand = useCustomPrice && selectedPriceType ? '&expand=salePrices' : '';
        const data = await safe(`/entity/variant?limit=100&offset=${vOffset}${expand}`);
        if (!data?.rows?.length) break;
        for (const v of data.rows) {
          if (!stockMap[v.id]) continue;
          const parentId = (v.product?.meta?.href || '').split('/').pop() || '';
          if (parentId) variantToProduct[v.id] = parentId;
          if (useCustomPrice && selectedPriceType) {
            const sp = (v.salePrices || []).find((s: any) => s.priceType?.id === selectedPriceType.id);
            if (sp && Number(sp.value) > 0) priceMap[v.id] = Number(sp.value);
          }
        }
        if (data.rows.length < 100 || vOffset >= 9000) break;
        vOffset += 100;
      }
    }

    if (useCustomPrice && selectedPriceType) {
      let pOffset = 0;
      while (true) {
        const data = await safe(`/entity/product?expand=salePrices&limit=100&offset=${pOffset}`);
        if (!data?.rows?.length) break;
        for (const p of data.rows) {
          if (!stockMap[p.id]) continue;
          const sp = (p.salePrices || []).find((s: any) => s.priceType?.id === selectedPriceType.id);
          if (sp && Number(sp.value) > 0) priceMap[p.id] = Number(sp.value);
        }
        if (data.rows.length < 100 || pOffset >= 9000) break;
        pOffset += 100;
      }
    }

    // 5. Build product list
    const products = productIds
      .map(id => {
        const s = stockMap[id];
        const price = useCustomPrice ? (priceMap[id] || s.defaultPrice) : s.defaultPrice;
        return {
          id,
          type: s.type,
          name: s.name,
          code: s.code,
          // Use direct folder for precise filtering
          categoryId: s.folderId || null,
          categoryName: s.folderName || '',
          // Root folder for top-level grouping
          rootCategoryId: s.rootFolderId || s.folderId || null,
          rootCategoryName: s.rootFolderName || s.folderName || '',
          price,
          stock: s.stock,
          imageHref: s.imageHref,
          parentProductId: variantToProduct[id] || '',
        };
      })
      .filter(p => p.stock > 0);

    // 6. Build category tree: top-level categories with subcategories
    // Only include categories that have products (direct or in subcategories)
    const usedFolderIds = products.map(p => p.categoryId).filter((x): x is string => !!x);

    // Find all top-level categories that appear in products (directly or via ancestry)
    const topLevelCatSet: Record<string, true> = {};
    const subCatMap: Record<string, Record<string, true>> = {};

    for (const folderId of usedFolderIds) {
      const root = getRootFolder(folderId);
      topLevelCatSet[root] = true;
      if (folderId !== root) {
        if (!subCatMap[root]) subCatMap[root] = {};
        subCatMap[root][folderId] = true;
      }
    }

    const categories = Object.keys(topLevelCatSet)
      .map(id => ({
        id,
        name: folderMap[id]?.name || id,
        children: Object.keys(subCatMap[id] || {})
          .map(cid => ({ id: cid, name: folderMap[cid]?.name || cid }))
          .sort((a, b) => a.name.localeCompare(b.name)),
        descendantIds: getDescendants(id),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Order products by category (matching the sidebar order), then alphabetically within each category
    const categoryRank: Record<string, number> = {};
    let rank = 0;
    for (const cat of categories) {
      categoryRank[cat.id] = rank++;
      for (const child of cat.children) {
        categoryRank[child.id] = rank++;
      }
    }
    products.sort((a, b) => {
      const ra = (a.categoryId && categoryRank[a.categoryId]) ?? Number.MAX_SAFE_INTEGER;
      const rb = (b.categoryId && categoryRank[b.categoryId]) ?? Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name);
    });

    return { priceTypes, selectedPriceType, categories, products };
    });

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
