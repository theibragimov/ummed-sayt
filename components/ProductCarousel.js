"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const BG_COLORS = [
  "linear-gradient(160deg, #dbeafe 0%, #bfdbfe 100%)",
  "linear-gradient(160deg, #d1fae5 0%, #a7f3d0 100%)",
  "linear-gradient(160deg, #fef3c7 0%, #fde68a 100%)",
  "linear-gradient(160deg, #ede9fe 0%, #ddd6fe 100%)",
  "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 100%)",
  "linear-gradient(160deg, #e0f2fe 0%, #bae6fd 100%)",
];

export default function ProductGrid({ items }) {
  const N = items.length;
  if (N === 0) return (
    <div className="flex items-center justify-center py-16 text-sm font-light" style={{ color: "var(--text-muted, #888)" }}>
      Mahsulotlar yo'q
    </div>
  );

  const tripled = [...items, ...items, ...items];
  const trackRef = useRef(null);
  const lockRef = useRef(false);
  const [active, setActive] = useState(N);

  const VISIBLE = 4;
  const GAP = 20;
  const IMG_H = 340;

  const slide = (dir) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const t = trackRef.current;
    t.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
    const newActive = active + dir;
    setActive(newActive);
    setTimeout(() => {
      if (newActive >= 2 * N) { t.style.transition = "none"; setActive(newActive - N); }
      else if (newActive < N) { t.style.transition = "none"; setActive(newActive + N); }
      lockRef.current = false;
    }, 580);
  };

  const arrowTop = IMG_H / 2 - 22;

  return (
    <div className="relative px-14">
      {/* Chap strelka */}
      <button onClick={() => slide(-1)}
        className="absolute left-0 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
        style={{ top: `${arrowTop}px`, backgroundColor: "var(--bg)", border: "1px solid var(--border-strong)", color: "var(--text)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* O'ng strelka */}
      <button onClick={() => slide(1)}
        className="absolute right-0 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ top: `${arrowTop}px`, background: "linear-gradient(135deg, #FF6B35 0%, #E8491D 100%)", color: "#ffffff", boxShadow: "0 8px 20px -6px rgba(232,73,29,0.45)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(calc(-${active} * (((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE}) + ${GAP}px)))`,
            transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          }}>
          {tripled.map((item, idx) => {
            // DB mahsulot yoki static item
            const isDbItem = !!item.slug
            const name = item.nom || item.name || ""
            const desc = item.qisqaTavsif || item.desc || ""
            const bg = item.gradient || BG_COLORS[idx % BG_COLORS.length]
            const href = isDbItem ? `/mahsulot/${item.slug}` : null

            const CardInner = (
              <>
                {/* Rasm */}
                <div className="relative w-full overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500"
                  style={{ background: bg, height: `${IMG_H}px` }}>
                  {item.asosiyRasmUrl ? (
                    <Image src={item.asosiyRasmUrl} alt={name} fill style={{ objectFit: "cover" }} />
                  ) : item.visual ? (
                    <div className="transition-transform duration-500">{item.visual}</div>
                  ) : (
                    <span className="text-8xl select-none">{getCategoryEmoji(item.kategoriya?.slug)}</span>
                  )}
                </div>
                {/* Matn */}
                <div className="mt-5">
                  {item.kategoriya?.nom && (
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#E8491D" }}>
                      {item.kategoriya.nom}
                    </span>
                  )}
                  <h3 className="text-[22px] font-medium leading-snug tracking-tight mt-1" style={{ color: "var(--text)" }}>
                    {name}
                  </h3>
                  <p className="mt-2 text-[15px] font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </p>
                  {isDbItem && item.narx && (
                    <p className="mt-2 text-base font-semibold" style={{ color: "#E8491D" }}>
                      {item.narx.toLocaleString("uz-UZ")} so'm
                    </p>
                  )}
                </div>
              </>
            )

            return href ? (
              <Link key={idx} href={href}
                className="group flex-shrink-0 cursor-pointer block no-underline"
                style={{ width: `calc((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE})` }}>
                {CardInner}
              </Link>
            ) : (
              <div key={idx} className="group flex-shrink-0"
                style={{ width: `calc((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE})` }}>
                {CardInner}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(slug) {
  const map = { diagnostika: "🩺", "nafas-jihozlari": "💨", "yurak-jihozlari": "❤️", "tibbiy-mebel": "🛏️", sterilizatsiya: "🧪" };
  return map[slug] || "🏥";
}
