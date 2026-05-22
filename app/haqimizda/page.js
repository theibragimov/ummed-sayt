"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CountUp from "@/components/CountUp";

const STATS = [
  { value: 550, suffix: "+", label: "Hamkor dorixona" },
  { value: 12,  suffix: "+", label: "Yil tajriba" },
  { value: 98,  suffix: "%", label: "Mijozlar mamnun" },
];

const PARTNERS = [
  { name: "Omron" },
  { name: "Philips" },
  { name: "Siemens" },
  { name: "GE Healthcare" },
  { name: "Medtronic" },
  { name: "B.Braun" },
  { name: "Roche" },
  { name: "Bayer" },
  { name: "Abbott" },
  { name: "Nipro" },
  { name: "3M Health" },
  { name: "Mindray" },
];

const VALUES = [
  {
    title: "Sifat kafolati",
    desc: "Barcha mahsulotlarimiz xalqaro ISO sertifikatlariga ega va qat'iy sifat nazoratidan o'tgan.",
  },
  {
    title: "Ishonchli hamkorlik",
    desc: "550 dan ortiq dorixona va tibbiy muassasalar bilan uzoq muddatli hamkorlik o'rnatganmiz.",
  },
  {
    title: "Tezkor yetkazib berish",
    desc: "Butun O'zbekiston bo'ylab o'z vaqtida va xavfsiz yetkazib berish xizmatini taqdim etamiz.",
  },
];

export default function HaqimzdaPage() {
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
              Biz haqimizda
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
                alt="Ummed jamoasi"
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {/* Rasm yo'q bo'lsa placeholder */}
              <div
                className="absolute inset-0 flex items-center justify-center text-sm font-light"
                style={{
                  backgroundColor: "var(--card-bg, #f4f4f4)",
                  color: "var(--text-muted, #999)",
                }}
              >
                <span>Jamoa rasmi</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ===== ABOUT US qismi: chap label + o'ng statistika + matn ===== */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Chap — label */}
            <div className="lg:w-64 flex-shrink-0">
              <Reveal variant="up">
                <span className="section-label">Biz haqimizda</span>
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
                        style={{ color: "var(--text)" }}
                      >
                        <CountUp end={s.value} />{s.suffix}
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
                  className="text-2xl md:text-3xl font-medium leading-[1.3] mb-8 max-w-2xl"
                  style={{ color: "var(--text)" }}
                >
                  O'zbekistonda tibbiy jihozlar sohasida ishonchli hamkor bo'lgan kompaniya.
                </p>
                <p
                  className="text-base font-light leading-relaxed max-w-2xl"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  Ummed — 2012 yildan buyon O'zbekiston bo'ylab 550 dan ortiq dorixona va tibbiy muassasalarga sifatli tibbiy jihozlar yetkazib berib kelmoqda. Biz xalqaro standartlarga javob beradigan mahsulotlarni raqobatbardosh narxlarda taqdim etamiz va har bir hamkorga individual yondashamiz.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ===== Qadriyatlar ===== */}
        <div>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
            <Reveal variant="up" className="mb-14">
              <span className="section-label">Qadriyatlarimiz</span>
            </Reveal>

            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}
            >
              {VALUES.map((v, i) => (
                <Reveal key={v.title} variant="up" delay={i * 80}>
                  <div
                    className="p-8 md:p-10"
                    style={{
                      borderRight: i < VALUES.length - 1 ? "1px solid var(--border-strong, #e5e5e5)" : "none",
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

        {/* ===== Hamkorlarimiz ===== */}
        <div>
          <div className="py-20">
            <Reveal variant="up" className="mb-12 px-6 lg:px-10 max-w-[1400px] mx-auto">
              <span className="section-label">Hamkorlarimiz</span>
            </Reveal>

            {/* Marquee */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="overflow-hidden">
                <div className="partner-track flex gap-5">
                  {[...PARTNERS, ...PARTNERS].map((p, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: 200,
                        height: 110,
                        backgroundColor: "var(--card-bg, #f7f7f7)",
                      }}
                    >
                      <span
                        className="text-sm font-semibold tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        {p.name}
                      </span>
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
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <h2
                className="text-2xl md:text-3xl font-medium max-w-xl"
                style={{ color: "var(--text)" }}
              >
                Hamkorlik qilishga tayyormisiz?
              </h2>
              <a
                href="/aloqa"
                className="hero-cta inline-flex items-center px-8 py-4 text-sm font-medium transition-all hover:scale-[1.03]"
              >
                Biz bilan bog'laning
              </a>
            </div>
          </Reveal>
        </div>

      </main>

      <SiteFooter />
    </>
  );
}
