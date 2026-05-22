"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const NEWS = [
  {
    id: 1,
    date: "15 May, 2025",
    title: "Ummed kompaniyasi yangi tibbiy jihozlar lineyasini taqdim etdi",
    desc: "2025 yilda kompaniyamiz xalqaro sifat standartlariga javob beradigan yangi diagnostika uskunalari bilan assortimentini kengaytirdi.",
    category: "Yangilik",
    img: null,
    color: "#f0f4f8",
  },
  {
    id: 2,
    date: "2 May, 2025",
    title: "O'zbekistonda tibbiy jihozlar bozori: 2025 yil tendensiyalari",
    desc: "Mutaxassislar fikricha, tibbiy uskunalar sohasida raqamlashtirish va zamonaviy texnologiyalar joriy etilishi davom etmoqda.",
    category: "Tahlil",
    img: null,
    color: "#f5f0f8",
  },
  {
    id: 3,
    date: "18 Aprel, 2025",
    title: "550 dan ortiq dorixona bilan hamkorlik: muvaffaqiyat sirlari",
    desc: "Ummed jamoasi butun O'zbekiston bo'ylab o'rnatgan ishonchli hamkorlik tarmog'i haqida batafsil ma'lumot.",
    category: "Hamkorlik",
    img: null,
    color: "#f0f8f2",
  },
  {
    id: 4,
    date: "5 Aprel, 2025",
    title: "ISO sertifikatlash jarayoni: sifat nazoratimiz qanday ishlaydi",
    desc: "Kompaniyamiz mahsulotlari qat'iy xalqaro standartlar asosida tekshiriladi. Ushbu maqolada jarayon batafsil yoritilgan.",
    category: "Sifat",
    img: null,
    color: "#fff8f0",
  },
  {
    id: 5,
    date: "20 Mart, 2025",
    title: "Toshkent tibbiyot ko'rgazmasida Ummed stendi",
    desc: "Mart oyida bo'lib o'tgan xalqaro ko'rgazmada kompaniyamiz eng yangi mahsulotlarini namoyish etdi.",
    category: "Tadbir",
    img: null,
    color: "#f0f4f8",
  },
  {
    id: 6,
    date: "10 Mart, 2025",
    title: "Yangi logistika markazi: yetkazib berish tezlashadi",
    desc: "Ummed O'zbekiston bo'ylab tezkor yetkazib berishni ta'minlash uchun yangi logistika infratuzilmasini ishga tushirdi.",
    category: "Yangilik",
    img: null,
    color: "#f5f0f8",
  },
];

const PLACEHOLDER_ICONS = ["🏥", "📊", "🤝", "✅", "🎪", "🚚"];

export default function YangiliklarPage() {
  const featured = NEWS[0];
  const rest = NEWS.slice(1);

  return (
    <>
      <SiteHeader />

      <main style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-24">

          {/* Sarlavha */}
          <Reveal variant="up" className="mb-14">
            <span className="section-label">Yangiliklar</span>
            <h1
              className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-6"
              style={{ color: "var(--text)" }}
            >
              So'nggi yangiliklar
            </h1>
          </Reveal>

          {/* Featured — katta birinchi yangilik */}
          <Reveal variant="up" delay={80} className="mb-12">
            <Link href={`/yangiliklar/${featured.id}`} className="group block">
              {/* Rasm */}
              <div
                className="w-full overflow-hidden mb-6"
                style={{ height: "clamp(220px, 36vw, 520px)", backgroundColor: featured.color }}
              >
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {PLACEHOLDER_ICONS[0]}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-light mb-3" style={{ color: "var(--text-muted, #888)" }}>
                    {featured.date} &nbsp;·&nbsp; {featured.category}
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-medium leading-[1.2] group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--text)" }}
                  >
                    {featured.title}
                  </h2>
                </div>
                <p
                  className="md:max-w-sm text-sm font-light leading-relaxed md:pt-9"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  {featured.desc}
                </p>
              </div>
            </Link>
          </Reveal>

          {/* Divider */}
          <div className="mb-12" style={{ height: 1, backgroundColor: "var(--border-strong, #e5e5e5)" }} />

          {/* Qolgan yangiliklar — 3 ustunli grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {rest.map((item, idx) => (
              <Reveal key={item.id} variant="up" delay={idx * 60}>
                <Link href={`/yangiliklar/${item.id}`} className="group block">
                  {/* Rasm */}
                  <div
                    className="w-full overflow-hidden mb-5"
                    style={{ height: 240, backgroundColor: item.color }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {PLACEHOLDER_ICONS[idx + 1]}
                    </div>
                  </div>

                  {/* Ma'lumot */}
                  <p className="text-xs font-light mb-2" style={{ color: "var(--text-muted, #888)" }}>
                    {item.date} &nbsp;·&nbsp; {item.category}
                  </p>
                  <h3
                    className="text-lg font-medium leading-snug group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--text)" }}
                  >
                    {item.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
