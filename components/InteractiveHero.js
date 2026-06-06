"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import PartnersMarquee from "./PartnersMarquee";

export default function InteractiveHero() {
  const { t, lang } = useLang();
  const L = (uz, ru, en) => (lang === "ru" ? ru : lang === "en" && en ? en : uz);
  const [soz, setSoz] = useState(null);

  useEffect(() => {
    fetch("/api/sozlamalar")
      .then(r => r.json())
      .then(setSoz)
      .catch(() => setSoz({}));
  }, []);

  // Bazadan matn ol, bo'lmasa i18n fallback
  const badge   = soz ? (soz[`hero_badge_${lang}`]   || t.hero.badge)   : t.hero.badge;
  const title1  = soz ? (soz[`hero_title1_${lang}`]  || t.hero.title1)  : t.hero.title1;
  const title2  = soz ? (soz[`hero_title2_${lang}`]  || t.hero.title2)  : t.hero.title2;
  const title3  = soz ? (soz[`hero_title3_${lang}`]  || t.hero.title3)  : t.hero.title3;

  return (
    <section
      className="relative overflow-hidden hero-pixend"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Nuqtali grid teksturasi — chetlarda so'nadi */}
      <div
        className="absolute inset-0 pointer-events-none hero-dots"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(10,10,10,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 70% at center, #000 25%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at center, #000 25%, transparent 95%)",
        }}
      />

      {/* Hodunok rasmi — o'ng tomonda, vertikal markaz */}
      <div
        className="hidden lg:block absolute pointer-events-none select-none"
        style={{
          top: "40%",
          right: "12%",
          transform: "translateY(-50%)",
          animation: "floatHodunok 4s ease-in-out infinite",
        }}
      >
        <Image
          src="/hodunok.png"
          alt="Tibbiy hodunok"
          width={280}
          height={280}
          className="object-contain"
          priority
        />
      </div>

      <style>{`
        @keyframes floatHodunok {
          0%, 100% { transform: translateY(-50%) translateY(0px); }
          50%       { transform: translateY(-50%) translateY(-16px); }
        }
      `}</style>

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 md:pt-14 pb-12 sm:pb-20">
        {/* Label */}
        <div className="anim-fade-up" style={{ animationDelay: "80ms" }}>
          <span className="section-label">{badge}</span>
        </div>

        {/* Asosiy sarlavha */}
        <h1
          className="mt-5 sm:mt-7 text-[30px] sm:text-[42px] md:text-[60px] lg:text-[76px] font-medium leading-[1.1] sm:leading-[1.05] tracking-[-0.03em] sm:tracking-[-0.04em] max-w-5xl anim-fade-up"
          style={{ animationDelay: "180ms", color: "var(--text)" }}
        >
          <span className="block">{title1}</span>
          <span className="block">{title2}</span>
          <span className="block">{title3}</span>
        </h1>

        {/* CTA */}
        <div
          className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6 anim-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <Link
            href="/aloqa"
            className="hero-cta inline-flex items-center justify-center px-6 py-3 sm:px-9 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all hover:scale-[1.03]"
          >
            {L("Biz bilan bog'laning!", "Связаться с нами!", "Get in Touch!")}
          </Link>

          {/* Ijtimoiy ikonkalar */}
          <div className="hidden sm:flex items-center gap-3 ml-auto">
            <div className="w-16 h-px bg-gray-200 mr-2" />
            {[
              {
                href: "https://t.me/ummeduz",
                label: "Telegram",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
                  </svg>
                ),
              },
              {
                href: "https://www.instagram.com/ummed_uz/",
                label: "Instagram",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                ),
              },
              {
                href: "https://www.youtube.com/channel/UCPE1FJuYNkMyEehQkEh01CQ",
                label: "YouTube",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                ),
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="hero-social w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Hamkorlar marquee */}
        <div className="mt-10 sm:mt-20">
          <PartnersMarquee />
        </div>
      </div>
    </section>
  );
}
