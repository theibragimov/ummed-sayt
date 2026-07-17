"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CountUp from "@/components/CountUp";
import { useLang } from "@/lib/i18n";

function FounderImage({ alt }) {
  // /public/farhod.jpg faylini qo'ysangiz rasm chiqadi, yo'q bo'lsa initials ko'rinadi
  const [error, setError] = useState(false);
  if (!error) {
    return (
      <Image
        src="/Farhod.png"
        alt={alt}
        fill
        className="object-cover object-top"
        onError={() => setError(true)}
      />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4" style={{ color: "#a0967e" }}>
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white"
        style={{ backgroundColor: "#E8491D" }}
      >
        FA
      </div>
      <p className="text-xs font-light" style={{ color: "#b0a090" }}>Farhod Abdullayev</p>
    </div>
  );
}

const PARTNERS = [
  { name: "Elta",         logo: "/partners/elta.png" },
  { name: "Grand",        logo: "/partners/grand.png" },
  { name: "IHMA",         logo: "/partners/ihma.png" },
  { name: "LDH",          logo: "/partners/ldh.png" },
  { name: "Makon Mirzo",  logo: "/partners/makonmirzo.png" },
  { name: "Palma",        logo: "/partners/palma.png" },
  { name: "Sandstone",    logo: "/partners/sandstone.png" },
  { name: "Sterilance",   logo: "/partners/sterilance.png" },
  { name: "Vaksina",      logo: "/partners/vaksina.png" },
];

export default function HaqimzdaPage() {
  const { t } = useLang();
  const a = t.about;

  const STATS = [
    { value: 11,  suffix: "+", label: a.stats.experience },
    { value: 550, suffix: "+", label: a.stats.partners },
    { value: 700, suffix: "+", label: a.stats.products },
  ];

  return (
    <>
      <SiteHeader />

      <main style={{ backgroundColor: "var(--bg)" }}>

        {/* ===== HERO: Sarlavha + rasm ===== */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-0">
          <Reveal variant="up">
            <h1
              className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {a.title}
            </h1>
          </Reveal>
        </div>

        {/* To'liq kenglikdagi rasm */}
        <Reveal variant="up" delay={100}>
          <div
            className="mx-auto mt-8 overflow-hidden"
            style={{ maxWidth: "1100px", paddingLeft: "24px", paddingRight: "24px" }}
          >
            <div
              className="w-full relative"
              style={{ height: "clamp(240px, 38vw, 560px)" }}
            >
              <Image
                src="/team.jpg"
                alt={a.teamAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Reveal>

        {/* ===== ABOUT US qismi ===== */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Chap — label */}
            <div className="lg:w-64 flex-shrink-0">
              <Reveal variant="up">
                <span className="section-label">{a.label}</span>
              </Reveal>
            </div>

            {/* O'ng — statistika + matn */}
            <div className="flex-1">

              {/* Statistika */}
              <Reveal variant="up" delay={80}>
                <div className="flex flex-wrap gap-12 mb-14">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <p
                        className="text-[52px] md:text-[64px] font-medium leading-none tracking-tight"
                        style={{ color: "#E8491D" }}
                      >
                        <CountUp to={s.value} suffix={s.suffix} />
                      </p>
                      <p
                        className="text-sm font-light mt-2"
                        style={{ color: "var(--text-muted, #888)" }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Asosiy matn */}
              <Reveal variant="up" delay={160}>
                <p
                  className="text-2xl md:text-[28px] font-medium leading-[1.3] mb-8"
                  style={{ color: "var(--text)" }}
                >
                  {a.text1}
                </p>
                <p
                  className="text-base md:text-lg font-light leading-relaxed mb-5"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  {a.text2}
                </p>
                <p
                  className="text-base md:text-lg font-light leading-relaxed mb-5"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  {a.text3}
                </p>
                <p
                  className="text-base md:text-lg font-light leading-relaxed"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  {a.text4}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ===== Asoschimiz ===== */}
        <div style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)" }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-28">
            <Reveal variant="up" className="mb-8 lg:mb-14">
              <span className="section-label">{a.founder.label}</span>
            </Reveal>

            <Reveal variant="up" delay={80}>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">

                {/* Rasm */}
                <div className="flex-shrink-0 w-full lg:w-[380px] flex justify-center lg:justify-start">
                  <div
                    className="relative overflow-hidden flex items-center justify-center"
                    style={{ aspectRatio: "4/5", width: "min(300px, 80vw)", backgroundColor: "#f0ece6" }}
                  >
                    <FounderImage alt={a.founder.name} />
                  </div>
                </div>

                {/* Ma'lumotlar */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#E8491D" }}>
                    {a.founder.role}
                  </p>
                  <h2
                    className="text-3xl md:text-4xl lg:text-[48px] font-medium leading-[1.1] tracking-tight mb-8"
                    style={{ color: "var(--text)" }}
                  >
                    {a.founder.name}
                  </h2>
                  <p className="text-base md:text-lg font-light leading-relaxed mb-4" style={{ color: "var(--text-muted, #888)" }}>
                    {a.founder.bio1}
                  </p>
                  <p className="text-base md:text-lg font-light leading-relaxed mb-10" style={{ color: "var(--text-muted, #888)" }}>
                    {a.founder.bio2}
                  </p>

                  {/* Pochta */}
                  <a
                    href={`mailto:${a.founder.email}`}
                    className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-60"
                    style={{ color: "var(--text)" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    {a.founder.email}
                  </a>

                  {/* Tugmalar — ikonkasiz, gradientsiz, hover animatsiya */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={a.founder.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="founder-btn"
                    >
                      {a.founder.instagramLabel}
                    </a>
                    <a
                      href={a.founder.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="founder-btn"
                    >
                      {a.founder.telegramLabel}
                    </a>
                  </div>

                  <style>{`
                    .founder-btn {
                      display: inline-flex;
                      align-items: center;
                      padding: 12px 28px;
                      border-radius: 9999px;
                      font-size: 13px;
                      font-weight: 500;
                      letter-spacing: 0.02em;
                      border: 1px solid var(--border-strong, #e5e5e5);
                      color: var(--text);
                      background: transparent;
                      cursor: pointer;
                      text-decoration: none;
                      transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease, transform 0.18s ease;
                    }
                    .founder-btn:hover {
                      background: #E8491D;
                      color: #ffffff;
                      border-color: #E8491D;
                      transform: translateY(-2px);
                    }
                  `}</style>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ===== Qadriyatlar ===== */}
        <div>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 lg:py-20">
            <Reveal variant="up" className="mb-14">
              <span className="section-label">{a.values.label}</span>
            </Reveal>

            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}
            >
              {a.values.items.map((v, i) => (
                <Reveal key={v.title} variant="up" delay={i * 80}>
                  <div
                    className="p-8 md:p-10"
                    style={{
                      borderRight: i < a.values.items.length - 1 ? "1px solid var(--border-strong, #e5e5e5)" : "none",
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-widest mb-5"
                      style={{ color: "#E8491D" }}
                    >
                      0{i + 1}
                    </p>
                    <h3
                      className="text-lg font-medium mb-3"
                      style={{ color: "var(--text)" }}
                    >
                      {v.title}
                    </h3>
                    <p
                      className="text-sm font-light leading-relaxed"
                      style={{ color: "var(--text-muted, #888)" }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Gallery ===== */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
          <Reveal variant="up" className="mb-14">
            <span className="section-label">{a.gallery.label}</span>
          </Reveal>

          <Reveal variant="up" delay={80}>
            {/* Mobil: 2x2 grid, Desktop: 5 ustunli */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-3" style={{ height: "clamp(400px, 55vw, 680px)" }}>
              <div className="lg:col-span-2 grid grid-rows-2 gap-3">
                <div className="relative overflow-hidden">
                  <Image src="/j2.jpg" alt="Ummed ish jarayoni" fill className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
                </div>
                <div className="relative overflow-hidden">
                  <Image src="/j3.jpg" alt="Ummed jo'natish" fill className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
                </div>
              </div>
              <div className="relative overflow-hidden lg:col-span-2">
                <Image src="/j1.jpg" alt="Ummed ombor" fill className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
              </div>
              <div className="relative overflow-hidden lg:col-span-1">
                <Image src="/j0.jpg" alt="Ummed ishxona" fill className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
              </div>
            </div>

            {/* Mobil versiya: 2x2 grid, to'g'ri o'lcham */}
            <div className="grid lg:hidden grid-cols-2 gap-2">
              {["/j1.jpg", "/j2.jpg", "/j3.jpg", "/j0.jpg"].map((src, i) => (
                <div key={i} className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <Image src={src} alt="Ummed" fill className="object-cover" />
                </div>
              ))}
            </div>

            <p
              className="text-base md:text-lg font-light mt-8 leading-relaxed"
              style={{ color: "var(--text-muted, #888)", maxWidth: 680 }}
            >
              {a.gallery.caption}
            </p>
          </Reveal>
        </div>

        {/* ===== Hamkorlarimiz ===== */}
        <div>
          <div className="py-8 sm:py-20">
            <Reveal variant="up" className="mb-12 px-6 lg:px-10 max-w-[1400px] mx-auto">
              <span className="section-label">{a.partners.label}</span>
            </Reveal>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="overflow-hidden">
                <div className="partner-track flex gap-5">
                  {[...PARTNERS, ...PARTNERS].map((p, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{ padding: "12px 16px" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="partner-logo"
                        style={{ height: 36, maxWidth: 110, objectFit: "contain", display: "block" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <style>{`
              .partner-track {
                animation: partnerScroll 50s linear infinite;
                width: max-content;
              }
              @keyframes partnerScroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div>
          <Reveal variant="up">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 sm:py-20 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-8">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-medium max-w-xl"
                style={{ color: "var(--text)" }}
              >
                {a.cta.title}
              </h2>
              <a
                href="/aloqa"
                className="hero-cta inline-flex items-center self-start px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
              >
                {a.cta.btn}
              </a>
            </div>
          </Reveal>
        </div>

      </main>

      <SiteFooter />
    </>
  );
}
