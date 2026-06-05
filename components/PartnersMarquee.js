"use client";

import { useEffect, useRef } from "react";

const PARTNERS = [
  { name: "Elta",        logo: "/partners/elta.png" },
  { name: "Grand",       logo: "/partners/grand.png" },
  { name: "IHMA",        logo: "/partners/ihma.png" },
  { name: "LDH",         logo: "/partners/ldh.png" },
  { name: "Makon Mirzo", logo: "/partners/makonmirzo.png" },
  { name: "Palma",       logo: "/partners/palma.png" },
  { name: "Sandstone",   logo: "/partners/sandstone.png" },
  { name: "Sterilance",  logo: "/partners/sterilance.png" },
  { name: "Vaksina",     logo: "/partners/vaksina.png" },
];

function PartnerItem({ name, logo }) {
  return (
    <div className="flex items-center justify-center px-5 sm:px-14 flex-shrink-0" data-marquee-item>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={name}
        className="partner-logo sm:!h-[52px] sm:!max-w-[160px]"
        style={{ height: 36, maxWidth: 110, objectFit: "contain" }}
      />
    </div>
  );
}

export default function PartnersMarquee() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cycleWidth = () => track.scrollWidth / 2;

    const NORMAL_MS = 150_000;
    const HOVERED_MS = 900_000;

    let x = 0;
    let durationMs = NORMAL_MS;
    let targetDurationMs = NORMAL_MS;
    let lastTime = performance.now();
    let raf;

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;
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
          maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex items-center"
          style={{ width: "max-content", willChange: "transform", height: 80 }}
        >
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <PartnerItem key={i} name={p.name} logo={p.logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
