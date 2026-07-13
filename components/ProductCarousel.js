"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

const BG_COLORS = [
  "linear-gradient(160deg, #dbeafe 0%, #bfdbfe 100%)",
  "linear-gradient(160deg, #d1fae5 0%, #a7f3d0 100%)",
  "linear-gradient(160deg, #fef3c7 0%, #fde68a 100%)",
  "linear-gradient(160deg, #ede9fe 0%, #ddd6fe 100%)",
  "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 100%)",
  "linear-gradient(160deg, #e0f2fe 0%, #bae6fd 100%)",
];

function getCategoryEmoji(slug) {
  const map = { diagnostika: "🩺", "nafas-jihozlari": "💨", "yurak-jihozlari": "❤️", "tibbiy-mebel": "🛏️", sterilizatsiya: "🧪" };
  return map[slug] || "🏥";
}

export default function ProductGrid({ items, visibleCount = 4 }) {
  const { lang } = useLang();
  const N = items.length;

  // ── Barcha hooklar shart va return DAN OLDIN ──
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef(null);
  const animRef = useRef(false);
  const [idx, setIdx] = useState(N);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const VISIBLE = isMobile ? 2 : visibleCount;
  const GAP = isMobile ? 10 : 20;
  const IMG_H = isMobile ? 160 : 340;
  const useCarousel = N >= VISIBLE;
  const cardW = `calc((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE})`;

  const slide = useCallback((dir) => {
    if (!useCarousel || animRef.current) return;
    animRef.current = true;
    const t = trackRef.current;
    if (!t) { animRef.current = false; return; }
    const next = idx + dir;
    t.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    t.style.transform = `translateX(calc(-${next} * (${cardW} + ${GAP}px)))`;
    const onEnd = () => {
      t.removeEventListener("transitionend", onEnd);
      let corrected = next;
      if (next >= 2 * N) corrected = next - N;
      else if (next < N) corrected = next + N;
      if (corrected !== next) {
        t.style.transition = "none";
        t.style.transform = `translateX(calc(-${corrected} * (${cardW} + ${GAP}px)))`;
        void t.offsetHeight;
      }
      setIdx(corrected);
      animRef.current = false;
    };
    t.addEventListener("transitionend", onEnd);
  }, [idx, N, useCarousel, cardW, GAP]);
  // ── Hooklar tugadi ──

  if (N === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm font-light" style={{ color: "var(--text-muted, #888)" }}>
        Mahsulotlar yo'q
      </div>
    );
  }

  // Grid rejim
  if (!useCarousel) {
    const cols = isMobile ? 1 : Math.min(N, VISIBLE);
    return (
      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {items.map((item, i) => (
          <Card key={i} item={item} bg={BG_COLORS[i % BG_COLORS.length]} imgH={isMobile ? 200 : 340} lang={lang} />
        ))}
      </div>
    );
  }

  // Carousel rejim
  const tripled = [...items, ...items, ...items];
  const arrowTop = IMG_H / 2 - 22;

  return (
    <div className="relative px-14">
      {/* Chap strelka */}
      <button
        onClick={() => slide(-1)}
        className="absolute left-0 z-30 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
        style={{ top: `${arrowTop}px`, width: isMobile ? 32 : 44, height: isMobile ? 32 : 44, backgroundColor: "var(--bg)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
      >
        <svg width={isMobile ? 13 : 18} height={isMobile ? 13 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* O'ng strelka */}
      <button
        onClick={() => slide(1)}
        className="absolute right-0 z-30 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ top: `${arrowTop}px`, width: isMobile ? 32 : 44, height: isMobile ? 32 : 44, background: "linear-gradient(135deg, #FF6B35 0%, #E8491D 100%)", color: "#fff", boxShadow: "0 8px 20px -6px rgba(232,73,29,0.45)" }}
      >
        <svg width={isMobile ? 13 : 18} height={isMobile ? 13 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(calc(-${idx} * (${cardW} + ${GAP}px)))`,
            transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {tripled.map((item, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: cardW }}>
              <Card item={item} bg={BG_COLORS[i % BG_COLORS.length]} imgH={IMG_H} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ item, bg, imgH, lang }) {
  const isDbItem = !!item.slug;
  const name = lang === "ru" ? (item.nomRu || item.nom || item.name || "") : (item.nom || item.name || "");
  const desc = lang === "ru" ? (item.qisqaTavsifRu || item.qisqaTavsif || item.desc || "") : (item.qisqaTavsif || item.desc || "");
  const href = isDbItem ? `/mahsulot/${item.slug}` : null;

  const inner = (
    <>
      <div className="relative w-full overflow-hidden" style={{ height: `${imgH}px`, background: item.asosiyRasmUrl ? "transparent" : bg }}>
        {item.asosiyRasmUrl ? (
          <Image src={item.asosiyRasmUrl} alt={name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} className="group-hover:scale-[1.03]" />
        ) : item.visual ? (
          <div className="w-full h-full flex items-center justify-center">{item.visual}</div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl select-none">{getCategoryEmoji(item.kategoriya?.slug)}</span>
          </div>
        )}
      </div>
      <div className="mt-5">
        <h3 className="text-[14px] sm:text-[22px] font-medium leading-snug tracking-tight mt-1" style={{ color: "var(--text)" }}>{name}</h3>
        <p className="mt-1 sm:mt-2 text-[12px] sm:text-[15px] font-light leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>{desc}</p>
        {isDbItem && item.narx && (
          <p className="mt-2 text-base font-semibold" style={{ color: "#E8491D" }}>{item.narx.toLocaleString("uz-UZ")} so'm</p>
        )}
      </div>
    </>
  );

  return href ? (
    <Link href={href} className="group block no-underline cursor-pointer">{inner}</Link>
  ) : (
    <div className="group">{inner}</div>
  );
}
