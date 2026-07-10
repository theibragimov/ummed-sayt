import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { rating, comment, orderName } = await req.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const lines = [
      `⭐ <b>Yangi baholash</b>`,
      ``,
      `📋 Buyurtma: <b>${orderName ?? '—'}</b>`,
      `${stars} <b>${rating}/5</b>`,
    ];
    if (comment?.trim()) {
      lines.push(``, `💬 <i>${comment.trim()}</i>`);
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join('\n'),
          parse_mode: 'HTML',
        }),
        signal: AbortSignal.timeout(8_000),
      });
    }

    console.log(`[ORDER_RATING] orderName=${orderName ?? 'unknown'} rating=${rating}/5${comment ? ` comment="${comment}"` : ''}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
