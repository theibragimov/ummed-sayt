import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hisoblaTopSotuvlar, topSotuvlarniSaqlash, keshlanganTopSotuvlarniOlish } from '@/lib/topsales';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const keshlangan = await keshlanganTopSotuvlarniOlish(prisma);
    if (keshlangan) {
      return NextResponse.json(keshlangan);
    }

    // Kesh hali bo'sh (masalan birinchi deploy) — jonli hisoblab, keshga saqlaymiz
    const natija = await hisoblaTopSotuvlar();
    await topSotuvlarniSaqlash(prisma, natija);
    return NextResponse.json(natija);
  } catch (e: any) {
    return NextResponse.json({ top50Ranked: [], error: e.message });
  }
}
