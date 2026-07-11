"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InteractiveHero from "@/components/InteractiveHero";
import CountUp from "@/components/CountUp";
import ProductGrid from "@/components/ProductCarousel";
import { useLang } from "@/lib/i18n";


const advantageIcons = ["🏅", "🛡️", "🚚"];

// SVG va gradient ma'lumotlari distribyutor mahsulotlar uchun
const DISTRIB_VISUALS = {
  satellite: {
    gradient: "linear-gradient(160deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-[240px] drop-shadow-xl">
        <rect x="20" y="20" width="80" height="130" rx="6" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5" />
        <text x="60" y="45" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">Сателлит</text>
        <rect x="32" y="60" width="56" height="42" rx="4" fill="#dbeafe" />
        <rect x="38" y="66" width="44" height="18" rx="2" fill="#1e293b" />
        <text x="60" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10b981" fontFamily="monospace">4.8</text>
        <circle cx="52" cy="94" r="3" fill="#64748b" />
        <circle cx="60" cy="94" r="3" fill="#64748b" />
        <circle cx="68" cy="94" r="3" fill="#64748b" />
        <rect x="110" y="40" width="70" height="110" rx="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
        <text x="145" y="62" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">ТЕСТ-</text>
        <text x="145" y="75" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">ПОЛОСКИ</text>
        <rect x="120" y="85" width="50" height="32" rx="2" fill="#ffffff" />
        <text x="145" y="108" textAnchor="middle" fontSize="17" fontWeight="800" fill="#f97316">50</text>
      </svg>
    ),
  },
  palma: {
    gradient: "linear-gradient(160deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)",
    visual: (
      <div className="flex items-end gap-1.5">
        {[
          { c: "#0891b2", l: "KM" },
          { c: "#0d9488", l: "СМ" },
          { c: "#7c3aed", l: "К" },
          { c: "#10b981", l: "Д" },
          { c: "#8b5cf6", l: "ВТ" },
        ].map((b, i) => (
          <div
            key={i}
            className="rounded flex items-center justify-center shadow-md"
            style={{
              width: "30px",
              height: 56 + (i % 2) * 14,
              backgroundColor: b.c,
              color: "#fff",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            {b.l}
          </div>
        ))}
      </div>
    ),
  },
  easydrip: {
    gradient: "linear-gradient(160deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
    visual: (
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { num: "4", c: "#10b981" },
          { num: "5", c: "#6366f1" },
          { num: "6", c: "#f97316" },
          { num: "8", c: "#14b8a6" },
        ].map((b) => (
          <div
            key={b.num}
            className="rounded flex flex-col items-center justify-center text-white shadow-md"
            style={{ backgroundColor: b.c, width: "48px", height: "56px" }}
          >
            <span className="text-lg font-extrabold leading-none">{b.num}</span>
            <span className="text-[9px] opacity-80 mt-0.5">mm</span>
          </div>
        ))}
      </div>
    ),
  },
  makon: {
    gradient: "linear-gradient(160deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)",
    visual: (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded shadow-md"
            style={{
              width: "34px",
              height: "48px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            }}
          />
        ))}
      </div>
    ),
  },
};

// Ummed brendi mahsulotlari visualari
const OWN_VISUALS = {
  tonometr: {
    gradient: "linear-gradient(160deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%)",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-[230px] drop-shadow-xl">
        <rect x="50" y="30" width="100" height="100" rx="14" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <rect x="62" y="45" width="76" height="40" rx="4" fill="#1e293b" />
        <text x="100" y="65" textAnchor="middle" fontSize="14" fontWeight="800" fill="#E8491D" fontFamily="monospace">120</text>
        <text x="100" y="79" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily="monospace">/80 mmHg</text>
        <rect x="70" y="95" width="60" height="6" rx="2" fill="#E8491D" />
        <circle cx="80" cy="115" r="6" fill="#FF6B35" />
        <circle cx="100" cy="115" r="6" fill="#6b7280" />
        <circle cx="120" cy="115" r="6" fill="#6b7280" />
        <text x="100" y="148" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0a0a0a">UMMED</text>
      </svg>
    ),
  },
  glukometr: {
    gradient: "linear-gradient(160deg, #cffafe 0%, #a5f3fc 50%, #67e8f9 100%)",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-[230px] drop-shadow-xl">
        <rect x="55" y="20" width="90" height="120" rx="10" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <rect x="65" y="32" width="70" height="35" rx="3" fill="#0f766e" />
        <text x="100" y="55" textAnchor="middle" fontSize="16" fontWeight="800" fill="#5eead4" fontFamily="monospace">5.6</text>
        <rect x="68" y="78" width="64" height="28" rx="2" fill="#f1f5f9" />
        <text x="100" y="97" textAnchor="middle" fontSize="7" fontWeight="700" fill="#475569">mmol/L</text>
        <circle cx="82" cy="120" r="5" fill="#FF6B35" />
        <circle cx="100" cy="120" r="5" fill="#94a3b8" />
        <circle cx="118" cy="120" r="5" fill="#94a3b8" />
        {/* Tag */}
        <rect x="62" y="0" width="76" height="14" rx="3" fill="#E8491D" />
        <text x="100" y="11" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">UMMED</text>
      </svg>
    ),
  },
  termometr: {
    gradient: "linear-gradient(160deg, #f3e8ff 0%, #e9d5ff 50%, #d8b4fe 100%)",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-[230px] drop-shadow-xl">
        {/* Korpus */}
        <path d="M70 25 Q70 18 80 18 L120 18 Q130 18 130 25 L130 105 Q130 125 100 125 Q70 125 70 105 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        {/* Ekran */}
        <rect x="80" y="35" width="40" height="30" rx="3" fill="#1e293b" />
        <text x="100" y="55" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FF6B35" fontFamily="monospace">36.6</text>
        {/* Lazer markeri */}
        <circle cx="100" cy="98" r="10" fill="#7c3aed" />
        <circle cx="100" cy="98" r="5" fill="#ddd6fe" />
        {/* Tugma */}
        <rect x="90" y="115" width="20" height="6" rx="2" fill="#E8491D" />
        <text x="100" y="148" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0a0a0a">UMMED</text>
      </svg>
    ),
  },
  oksimetr: {
    gradient: "linear-gradient(160deg, #ffedd5 0%, #fed7aa 50%, #fdba74 100%)",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-[230px] drop-shadow-xl">
        {/* Korpus */}
        <path d="M60 50 L140 50 Q150 50 150 60 L150 110 Q150 120 140 120 L60 120 Q50 120 50 110 L50 60 Q50 50 60 50 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        {/* OLED ekran */}
        <rect x="65" y="60" width="70" height="50" rx="4" fill="#0a0a0a" />
        <text x="80" y="83" fontSize="20" fontWeight="800" fill="#FF6B35" fontFamily="monospace">98</text>
        <text x="105" y="83" fontSize="9" fontWeight="700" fill="#FF6B35" fontFamily="monospace">%</text>
        <text x="80" y="100" fontSize="10" fontWeight="800" fill="#3DB851" fontFamily="monospace">72</text>
        <text x="100" y="100" fontSize="7" fontWeight="700" fill="#3DB851" fontFamily="monospace">BPM</text>
        {/* Barmoq tutqich */}
        <rect x="48" y="62" width="6" height="26" rx="2" fill="#E8491D" />
        <text x="100" y="142" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0a0a0a">UMMED</text>
      </svg>
    ),
  },
};

export default function HomePage() {
  const { t, lang } = useLang();
  const L = (uz, ru, en) => (lang === "ru" ? ru : lang === "en" && en ? en : uz);

  const [distribItems, setDistribItems] = useState([]);
  const [ownItems, setOwnItems] = useState([]);
  const [yangiliklar, setYangiliklar] = useState([]);

  useEffect(() => {
    fetch("/api/mahsulotlar?turi=distribyutor")
      .then(r => r.json()).then(d => setDistribItems(Array.isArray(d) ? d : []));
    fetch("/api/mahsulotlar?turi=ummed-brend")
      .then(r => r.json()).then(d => setOwnItems(Array.isArray(d) ? d : []));
    fetch("/api/yangiliklar?holat=published")
      .then(r => r.json()).then(d => setYangiliklar(Array.isArray(d) ? d.slice(0, 3) : []));
  }, []);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <InteractiveHero />

        {/* STATISTIKA — orange katta sonlar */}
        <section className="bg-white py-10 sm:py-16">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-10 items-start">
              {[t.hero.stats.experience, t.hero.stats.products, t.hero.stats.clients].map(
                (s, idx) => (
                  <Reveal
                    key={s.label}
                    variant="up"
                    delay={idx * 120}
                    className="text-center"
                  >
                    <div
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-extrabold leading-none tracking-tight"
                      style={{ color: "#E8491D" }}
                    >
                      <CountUp to={s.num} duration={2000} suffix="+" />
                    </div>
                    <div
                      className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-semibold tracking-wide"
                      style={{ color: "var(--text)" }}
                    >
                      {s.label}
                    </div>
                  </Reveal>
                )
              )}
            </div>
          </div>
        </section>

        {/* AFZALLIKLAR — Pixend "OUR SERVICES" uslubi: to'q fon */}
        <section className="services-section py-8 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            {/* Label */}
            <Reveal variant="up" className="mb-10">
              <span className="section-label services-label">
                {L("Bizning Afzalliklarimiz", "Наши преимущества", "Our Advantages")}
              </span>
            </Reveal>

            {/* Kartalar — minimalistik, 2x3 grid */}
            <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  // Tajriba asosida yondashuv — medal/yulduz
                  ...t.advantages.experience,
                  accent: "#3DB851",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
                    </svg>
                  ),
                },
                {
                  // Xususiy ombor — ombor binosi
                  ...t.advantages.warehouse,
                  accent: "#3DB851",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 20h20M4 20V10l8-7 8 7v10" />
                      <path d="M9 20v-5h6v5" />
                      <rect x="10" y="11" width="4" height="4" />
                    </svg>
                  ),
                },
                {
                  // Ishonchli ta'minot — zanjirlangan halqalar (supply chain)
                  ...t.advantages.distribution,
                  accent: "#3DB851",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  ),
                },
                {
                  // Rasmiy kafolat — sertifikat/hujjat
                  ...t.advantages.certificate,
                  accent: "#3DB851",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="13" x2="15" y2="13" />
                      <line x1="9" y1="17" x2="12" y2="17" />
                      <polyline points="9 9 10 9 11 9" />
                    </svg>
                  ),
                },
                {
                  // Rasmiy distribyutorlik — tasdiqlangan belgi
                  ...t.advantages.guarantee,
                  accent: "#3DB851",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  ),
                },
                {
                  // Barqaror hamkorlik — qo'l siqish
                  ...t.advantages.delivery,
                  accent: "#3DB851",
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <Reveal
                  key={item.title}
                  variant="up"
                  delay={(idx % 3) * 100}
                  className="service-card group relative p-5 sm:p-10 lg:p-12 flex flex-col items-start transition-all duration-300"
                >
                  {/* Ikonka — yuqorida */}
                  <div
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-5 sm:mb-16 service-icon transition-transform duration-300 group-hover:scale-110"
                  >
                    <span className="scale-125 sm:scale-150">{item.icon}</span>
                  </div>
                  {/* Sarlavha — katta */}
                  <h3 className="text-base sm:text-2xl lg:text-3xl font-medium leading-tight tracking-tight service-title">
                    {item.title}
                  </h3>
                  {/* Tavsif */}
                  <p className="mt-2 sm:mt-5 text-sm sm:text-[15px] leading-relaxed service-desc">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* JARAYON */}
        <section className="py-12 sm:py-20" style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <Reveal variant="up" className="mb-8 sm:mb-12">
              <span className="section-label">{L("Jarayon", "Процесс", "Process")}</span>
            </Reveal>

            <Reveal variant="up" delay={100}>
              <div
                className="grid grid-cols-3 relative max-w-5xl mx-auto"
                style={{ border: "1px solid var(--border-strong)", borderRadius: "2px" }}
              >
                {[
                  {
                    title: L("Buyurtma bering", "Оформите заказ", "Place an Order"),
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    ),
                  },
                  {
                    title: L("Tasdiqlating", "Подтвердите", "Confirm"),
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    ),
                  },
                  {
                    title: L("Qabul qiling", "Получите", "Receive"),
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                    ),
                  },
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Karta */}
                    <div
                      className="flex flex-col items-center justify-center py-5 sm:py-10 px-2 sm:px-8 text-center"
                      style={{
                        borderRight: idx < 2 ? "1px solid var(--border-strong)" : "none",
                      }}
                    >
                      <div className="mb-2 sm:mb-5 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7" style={{ color: "#E8491D" }}>
                        {step.icon}
                      </div>
                      <h3
                        className="text-[11px] sm:text-2xl lg:text-[28px] font-medium tracking-tight leading-tight"
                        style={{ color: "var(--text)" }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* O'rtadagi strelka */}
                    {idx < 2 && (
                      <div
                        className="flex absolute top-1/2 -right-4 sm:-right-5 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center"
                        style={{
                          transform: "translateY(-50%)",
                          backgroundColor: "var(--bg)",
                          border: "1px solid var(--border-strong)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* DISTRIBYUTOR MAHSULOTLAR */}
        <section className="pt-12 pb-6 sm:pt-20 sm:pb-10" style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <Reveal variant="up" className="mb-8 sm:mb-12">
              <span className="section-label">{L("Distribyutsiya", "Дистрибуция", "Distribution")}</span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mt-4 sm:mt-6"
                style={{ color: "var(--text)" }}
              >
                {L("Biz taqdim etadigan distribyutor mahsulotlar", "Дистрибьюторские продукты", "Distributor Products We Offer")}
              </h2>
            </Reveal>
            <ProductGrid items={distribItems} />
          </div>
        </section>

        {/* UMMED BRENDI OSTIDA MAHSULOTLAR */}
        <section className="pt-6 pb-12 sm:pt-10 sm:pb-20" style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <Reveal variant="up" className="mb-8 sm:mb-12">
              <span className="section-label">{L("Brend Ummed", "Бренд Ummed", "Ummed Brand")}</span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mt-4 sm:mt-6"
                style={{ color: "var(--text)" }}
              >
                {L("Ummed brendi ostidagi mahsulotlar", "Продукты под брендом Ummed", "Products Under the Ummed Brand")}
              </h2>
            </Reveal>
            <ProductGrid items={ownItems} />
          </div>
        </section>

        {/* UZUM MARKET — pricing card uslubi */}
        <section className="pt-10 sm:pt-16 pb-4" style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <Reveal variant="up">
              <div
                className="rounded-2xl overflow-hidden flex flex-col lg:flex-row"
                style={{ backgroundColor: "var(--bg-soft)" }}
              >
                {/* Chap qism */}
                <div className="flex-1 p-7 sm:p-10 lg:p-14 flex flex-col justify-center gap-3 sm:gap-5">
                  <span className="section-label">{L("Uzum Market", "Uzum Market", "Uzum Market")}</span>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-[38px] font-medium leading-[1.1] tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {t.uzum.title}
                  </h2>
                  <p
                    className="text-sm font-light leading-relaxed max-w-md"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.uzum.subtitle}
                  </p>
                </div>

                {/* O'ng qism — do'konlar, kengaytirilgan */}
                <div
                  className="lg:w-[480px] p-7 sm:p-10 lg:p-14 flex flex-col justify-center"
                  style={{ borderLeft: "1px solid var(--border)" }}
                >
                  <h3
                    className="text-base sm:text-lg font-medium mb-4 sm:mb-6"
                    style={{ color: "var(--text)" }}
                  >
                    {L("Do'konlar", "Магазины", "Stores")}
                  </h3>

                  <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
                    {[
                      t.uzum.shops.ummed,
                      t.uzum.shops.ababil,
                    ].map((shop) => (
                      <a
                        key={shop.name}
                        href={shop.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-medium transition-all hover:opacity-85 hover:scale-[1.02] whitespace-nowrap"
                        style={{ backgroundColor: "#6E27D9" }}
                      >
                        {shop.name}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SO'NGI YANGILIKLAR */}
        <section className="pt-5 sm:pt-8 pb-8 sm:pb-16" style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">

            {/* Sarlavha + "Barchasi" linki — bir qatorda */}
            <Reveal variant="up" className="flex items-center justify-between mb-5 sm:mb-10">
              <div>
                <span className="section-label">{L("Yangiliklar", "Новости", "News")}</span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight mt-2 sm:mt-5" style={{ color: "var(--text)" }}>
                  {L("So'nggi yangiliklar", "Последние новости", "Latest News")}
                </h2>
              </div>
              <Link href="/yangiliklar" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium flex-shrink-0 ml-4 transition-opacity hover:opacity-60" style={{ color: "var(--text)" }}>
                {L("Barchasi", "Все", "All")}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8"/>
                </svg>
              </Link>
            </Reveal>

            {yangiliklar.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted, #888)" }}>{L("Yangiliklar yo'q", "Новостей нет", "No news yet")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-px sm:border sm:border-[var(--border-strong,#e5e5e5)]">
                {yangiliklar.map((item, idx) => {
                  const sarlavha = (lang === "ru" && item.sarlavhaRu) ? item.sarlavhaRu : item.sarlavha;
                  const sana = item.sana ? new Date(item.sana).toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ", { day: "numeric", month: "short", year: "numeric" }) : "";
                  const katNom = item.kategoriya?.nom || "";
                  return (
                    <Reveal key={item.id} variant="up" delay={idx * 70}>
                      <Link
                        href={`/yangiliklar/${item.slug}`}
                        className="group flex flex-col overflow-hidden rounded-xl sm:rounded-none border border-[var(--border-strong,#e5e5e5)] sm:border-0"
                        style={{
                          backgroundColor: "var(--bg)",
                          borderRight: idx < yangiliklar.length - 1 ? "1px solid var(--border-strong, #e5e5e5)" : "none",
                        }}
                      >
                        <div className="w-full overflow-hidden" style={{ height: 200, backgroundColor: item.kategoriya?.rang || "#f0f4f8" }}>
                          {item.muqovaRasmUrl ? (
                            <Image src={item.muqovaRasmUrl} alt={sarlavha} width={400} height={200} style={{ width: "100%", height: "100%", objectFit: "cover" }} className="group-hover:scale-[1.03] transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                          )}
                        </div>
                        <div className="p-3 sm:p-5 flex flex-col flex-1">
                          <p className="text-[11px] font-light mb-2" style={{ color: "var(--text-muted, #888)" }}>
                            {sana}{katNom ? ` · ${katNom}` : ""}
                          </p>
                          <h3 className="text-sm sm:text-base font-medium leading-snug group-hover:opacity-60 transition-opacity" style={{ color: "var(--text)" }}>
                            {sarlavha}
                          </h3>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA — Hamkorlik */}
        <section className="pb-10 sm:pb-0" style={{ backgroundColor: "var(--bg)" }}>
          <Reveal variant="up">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
              <div
                className="py-8 sm:py-20 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-10"
                style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)" }}
              >
                <div>
                  <span className="section-label">{L("Hamkorlik", "Партнёрство", "Partnership")}</span>
                  <h2 className="text-xl sm:text-3xl font-medium leading-snug tracking-tight mt-3 sm:mt-6" style={{ color: "var(--text)", maxWidth: 560 }}>
                    {L("Apteka yoki klinikangiz uchun kerakli tibbiyot buyumlarini bir joydan toping!", "Всё необходимое для вашей аптеки или клиники — в одном месте!", "Find all the medical supplies your pharmacy or clinic needs — in one place!")}
                  </h2>
                  <p className="mt-3 text-sm font-light leading-relaxed" style={{ color: "var(--text-muted, #888)" }}>
                    {L("550+ mijoz va hamkorlar ishonchi asosida faoliyat yuritamiz.", "Работаем на основе доверия 550+ клиентов и партнёров.", "We operate on the trust of 550+ clients and partners.")}
                  </p>
                </div>
                <div className="flex flex-row gap-3 flex-shrink-0">
                  <Link href="/aloqa" className="hero-cta inline-flex items-center justify-center px-5 py-3 sm:px-9 sm:py-4 rounded-full text-sm font-medium transition-all hover:scale-[1.03] whitespace-nowrap">
                    {L("Hamkorlikni boshlang", "Начать сотрудничество", "Start Partnership")}
                  </Link>
                  <Link href="/katalog" className="inline-flex items-center justify-center px-5 py-3 sm:px-9 sm:py-4 rounded-full text-sm font-medium transition-all hover:opacity-70 whitespace-nowrap" style={{ border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text)" }}>
                    {L("Katalog", "Каталог", "Catalog")}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
