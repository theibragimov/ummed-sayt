"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";

const PARTNERS = [
  { name: "Omron", icon: "❤" },
  { name: "Philips", icon: "✦" },
  { name: "Siemens", icon: "◈" },
  { name: "GE Health", icon: "◆" },
  { name: "Medtronic", icon: "✚" },
  { name: "B.Braun", icon: "▲" },
  { name: "Roche", icon: "◉" },
  { name: "Bayer", icon: "◐" },
  { name: "Abbott", icon: "★" },
  { name: "Nipro", icon: "❖" },
];

function PartnerItem({ name, icon }) {
  return (
    <div className="flex items-center gap-2.5 px-8 flex-shrink-0" data-marquee-item>
      <span className="text-2xl leading-none select-none" style={{ color: "#0a0a0a" }}>
        {icon}
      </span>
      <span
        className="text-xl font-bold tracking-tight whitespace-nowrap select-none"
        style={{ color: "#0a0a0a" }}
      >
        {name}.
      </span>
    </div>
  );
}

export default function PartnersMarquee() {
  const { lang } = useLang();
  const label = lang === "ru" ? "Наши партнёры" : "Hamkorlarimiz";

  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cycleWidth = () => track.scrollWidth / 2;

    // Vaqt asosida: bitta to'liq aylanish necha ms da o'tadi
    const NORMAL_MS = 150_000;   // 150 sekund
    const HOVERED_MS = 900_000;  // 6x sekinroq (~15 daqiqa)

    let x = 0;
    let durationMs = NORMAL_MS;
    let targetDurationMs = NORMAL_MS;
    let lastTime = performance.now();
    let raf;

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      // Davomiylikni smooth o'zgartiramiz (lerp)
      durationMs += (targetDurationMs - durationMs) * 0.05;

      const w = cycleWidth();
      if (w > 0 && durationMs > 0) {
        const pxPerMs = w / durationMs;
        x -= pxPerMs * dt;
        if (x <= -w) x += w;
      }
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = () => { targetDurationMs = HOVERED_MS; };
    const onLeave = () => { targetDurationMs = NORMAL_MS; };

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="w-full mt-10 anim-fade-up" style={{ animationDelay: "700ms" }}>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ width: "max-content", willChange: "transform" }}
        >
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <PartnerItem key={i} name={p.name} icon={p.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
