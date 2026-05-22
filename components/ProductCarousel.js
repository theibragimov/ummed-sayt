"use client";

import { useRef, useState } from "react";

export default function ProductGrid({ items }) {
  const N = items.length;
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

  // Strelkalar top — rasm markaziga
  const arrowTop = IMG_H / 2 - 22;

  return (
    /* Tashqi wrapper — strelkalarga joy berish uchun gorizontal padding */
    <div className="relative px-14">

      {/* Chap strelka — to'liq tashqarida */}
      <button
        onClick={() => slide(-1)}
        className="absolute left-0 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
        style={{
          top: `${arrowTop}px`,
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border-strong)",
          color: "var(--text)",
        }}
        aria-label="Oldingi"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* O'ng strelka — to'liq tashqarida */}
      <button
        onClick={() => slide(1)}
        className="absolute right-0 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          top: `${arrowTop}px`,
          background: "linear-gradient(135deg, #FF6B35 0%, #E8491D 100%)",
          color: "#ffffff",
          boxShadow: "0 8px 20px -6px rgba(232,73,29,0.45)",
        }}
        aria-label="Keyingi"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Track — overflow hidden */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(calc(-${active} * (((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE}) + ${GAP}px)))`,
            transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {tripled.map((item, idx) => (
            <div
              key={idx}
              className="group flex-shrink-0 cursor-pointer"
              style={{ width: `calc((100% - ${(VISIBLE - 1) * GAP}px) / ${VISIBLE})` }}
            >
              {/* Rasm — to'rt burchakli */}
              <div
                className="relative w-full overflow-hidden flex items-center justify-center"
                style={{ background: item.gradient, height: `${IMG_H}px`, borderRadius: 0 }}
              >
                <div className="transition-transform duration-500 group-hover:scale-105">
                  {item.visual}
                </div>
              </div>

              {/* Matn */}
              <div className="mt-5">
                <h3
                  className="text-[22px] font-medium leading-snug tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  {item.name}
                </h3>
                <p
                  className="mt-2 text-[15px] font-light leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
