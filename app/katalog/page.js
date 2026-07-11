"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

/* ─── UMMED badge (har bir kategoriya sarlavhasining o'ng tomonida) ─── */
function UmmedBadge() {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: "#E8491D" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" opacity="0.9" />
        <text x="12" y="16" textAnchor="middle" fill="#E8491D" fontSize="11" fontWeight="bold" fontFamily="sans-serif">U</text>
      </svg>
      <span className="text-white font-semibold text-xs tracking-wider">UMMED</span>
    </div>
  );
}

/* ─── Kategoriya bo'limi sarlavhasi ─── */
function CategoryHeader({ nom }) {
  return (
    <div
      className="flex items-center justify-between pb-3 mb-8"
      style={{ borderBottom: "2px solid #1a1a1a" }}
    >
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
        style={{ color: "#1a1a1a" }}
      >
        {nom}
      </h2>
      <UmmedBadge />
    </div>
  );
}

/* ─── Mahsulot rasmi (placeholder yoki haqiqiy) ─── */
function ProductImage({ product, nom, size }) {
  const dim = size === "sm" ? 112 : size === "lg" ? 224 : 176;
  const url = product.asosiyRasmUrl || (product.rasmlar?.[0]?.rasmUrl);
  return (
    <div
      className="relative flex-shrink-0 flex items-center justify-center rounded-2xl overflow-hidden bg-white"
      style={{ width: dim, height: dim, minWidth: dim, border: "1px solid #e8e8e8" }}
    >
      {url ? (
        <Image src={url} alt={nom} fill style={{ objectFit: "contain" }} className="p-3" sizes="224px" />
      ) : (
        <span className="text-5xl select-none opacity-30">📦</span>
      )}
    </div>
  );
}

/* ─── Hero qator: rasm chap + tavsif kartasi o'ng (Figma 1-sahifa uslubi) ─── */
function HeroProductRow({ product, lang, color, isHit }) {
  const nom = lang === "ru" ? (product.nomRu || product.nom) : product.nom;
  const desc =
    lang === "ru"
      ? product.qisqaTavsifRu || product.qisqaTavsif
      : product.qisqaTavsif || product.qisqaTavsifRu;

  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-7">
      {/* Chap: rasm + hit badge */}
      <div className="relative flex-shrink-0 self-start">
        <ProductImage product={product} nom={nom} size="md" />
        {isHit && (
          <span
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-white text-xs font-bold z-10"
            style={{ backgroundColor: "#00BCD4" }}
          >
            Хит Продаж
          </span>
        )}
      </div>

      {/* O'ng: tavsif kartasi */}
      <div
        className="flex-1 rounded-2xl p-5 sm:p-7 min-h-[120px] flex flex-col justify-start gap-3"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <span
          className="inline-block self-start px-4 py-1.5 rounded-lg text-white text-sm font-semibold leading-tight"
          style={{ backgroundColor: color || "#E8491D" }}
        >
          {nom}
        </span>
        {desc && (
          <p className="text-sm leading-relaxed" style={{ color: "#444" }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Variant grid: 2 ustunli panjara (Figma 2-sahifa — igna uslubi) ─── */
function VariantProductGrid({ product, lang, variants }) {
  const nom = lang === "ru" ? (product.nomRu || product.nom) : product.nom;
  const desc =
    lang === "ru"
      ? product.qisqaTavsifRu || product.qisqaTavsif
      : product.qisqaTavsif || product.qisqaTavsifRu;
  const url = product.asosiyRasmUrl || product.rasmlar?.[0]?.rasmUrl;

  return (
    <div className="mb-7">
      {/* 2x2 grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
        {variants.map((v, i) => (
          <div key={v.id || i} className="flex flex-col items-center gap-3">
            <div
              className="relative w-full flex items-center justify-center rounded-2xl bg-white overflow-hidden"
              style={{ aspectRatio: "1/1", border: "1px solid #e8e8e8" }}
            >
              {url ? (
                <Image src={url} alt={v.label} fill style={{ objectFit: "contain" }} className="p-4" sizes="300px" />
              ) : (
                <span className="text-5xl select-none opacity-30">📦</span>
              )}
              {v.hit && (
                <span
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: "#00BCD4" }}
                >
                  Хит Продаж
                </span>
              )}
            </div>
            <span
              className="w-full text-center px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ backgroundColor: v.color || "#E8491D" }}
            >
              {v.label}
            </span>
          </div>
        ))}
      </div>

      {/* Pastdagi tavsif kartasi */}
      {desc && (
        <div className="rounded-2xl p-5 sm:p-7" style={{ backgroundColor: "#F5F5F5" }}>
          <span
            className="inline-block px-4 py-1.5 rounded-lg text-white text-xs font-semibold mb-3"
            style={{ backgroundColor: "#2d3748" }}
          >
            {nom}
          </span>
          <p className="text-sm leading-relaxed" style={{ color: "#444" }}>
            {desc}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Oddiy karta (tavsif yoki variant yo'q mahsulotlar) ─── */
function SimpleProductCard({ product, lang, color }) {
  const nom = lang === "ru" ? (product.nomRu || product.nom) : product.nom;
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-7">
      <div className="flex-shrink-0 self-start">
        <ProductImage product={product} nom={nom} size="md" />
      </div>
      <div
        className="flex-1 rounded-2xl p-5 sm:p-7 flex items-start"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <span
          className="inline-block self-start px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: color || "#E8491D" }}
        >
          {nom}
        </span>
      </div>
    </div>
  );
}

/* ─── Asosiy sahifa ─── */
export default function KatalogPage() {
  const { t, lang } = useLang();
  const [mahsulotlar, setMahsulotlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [activeKat, setActiveKat] = useState(null);

  useEffect(() => {
    fetch("/api/mahsulotlar?hammasi=true")
      .then((r) => r.json())
      .then((data) => {
        const filtered = Array.isArray(data) ? data.filter((p) => p.kategoriya) : [];
        setMahsulotlar(filtered);
        setYuklanmoqda(false);
      })
      .catch(() => setYuklanmoqda(false));
  }, []);

  /* Kategoriyalar bo'yicha guruhlash, tartibRaqami bo'yicha saralash */
  const sections = useMemo(() => {
    const byKat = new Map();
    for (const p of mahsulotlar) {
      const kid = p.kategoriyaId || p.kategoriya?.slug;
      if (!byKat.has(kid)) {
        byKat.set(kid, { kategoriya: p.kategoriya, products: [] });
      }
      byKat.get(kid).products.push(p);
    }
    return [...byKat.values()].sort((a, b) => {
      const at = a.kategoriya?.tartibRaqami ?? 99;
      const bt = b.kategoriya?.tartibRaqami ?? 99;
      return at - bt;
    });
  }, [mahsulotlar]);

  const displayedSections = useMemo(() => {
    if (!activeKat) return sections;
    return sections.filter((s) => s.kategoriya?.slug === activeKat);
  }, [sections, activeKat]);

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "#fff", minHeight: "60vh" }}>
        <div className="max-w-[960px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-20 sm:pb-28">

          {/* Sahifa sarlavhasi */}
          <Reveal variant="up" className="mb-10 sm:mb-12">
            <span className="section-label">
              {lang === "ru" ? "КАТАЛОГ" : "KATALOG"}
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight"
              style={{ color: "#1a1a1a" }}
            >
              {lang === "ru" ? "Каталог продукции" : "Mahsulotlar katalogi"}
            </h1>
          </Reveal>

          {/* Kategoriya filtri (tablar) */}
          {!yuklanmoqda && sections.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={() => setActiveKat(null)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={
                  !activeKat
                    ? { backgroundColor: "#1a1a1a", color: "#fff" }
                    : { backgroundColor: "#f0f0f0", color: "#444" }
                }
              >
                {lang === "ru" ? "Все" : "Hammasi"}
              </button>
              {sections.map((s) => {
                const katNom =
                  lang === "ru"
                    ? s.kategoriya?.nomRu || s.kategoriya?.nom
                    : s.kategoriya?.nom;
                const isActive = activeKat === s.kategoriya?.slug;
                return (
                  <button
                    key={s.kategoriya?.slug}
                    onClick={() => setActiveKat(s.kategoriya?.slug)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={
                      isActive
                        ? { backgroundColor: s.kategoriya?.rangKodi || "#E8491D", color: "#fff" }
                        : { backgroundColor: "#f0f0f0", color: "#444" }
                    }
                  >
                    {katNom}
                  </button>
                );
              })}
            </div>
          )}

          {/* Kontent */}
          {yuklanmoqda ? (
            <div className="flex items-center justify-center py-24" style={{ color: "#aaa" }}>
              <p className="text-sm">Yuklanmoqda...</p>
            </div>
          ) : displayedSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24" style={{ color: "#aaa" }}>
              <p className="text-base font-medium">Mahsulotlar topilmadi</p>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-20">
              {displayedSections.map(({ kategoriya, products }) => {
                const katNom =
                  lang === "ru"
                    ? kategoriya?.nomRu || kategoriya?.nom
                    : kategoriya?.nom;
                const color = kategoriya?.rangKodi || "#E8491D";

                return (
                  <section key={kategoriya?.slug} id={`kat-${kategoriya?.slug}`}>
                    <CategoryHeader nom={katNom} />

                    {products.map((product) => {
                      const variants =
                        Array.isArray(product.variantlar) && product.variantlar.length > 0
                          ? product.variantlar
                          : null;
                      const hasDesc =
                        lang === "ru"
                          ? !!(product.qisqaTavsifRu || product.qisqaTavsif)
                          : !!product.qisqaTavsif;

                      if (variants) {
                        return (
                          <VariantProductGrid
                            key={product.id}
                            product={product}
                            lang={lang}
                            variants={variants}
                          />
                        );
                      }
                      if (hasDesc) {
                        return (
                          <HeroProductRow
                            key={product.id}
                            product={product}
                            lang={lang}
                            color={color}
                            isHit={product.featured}
                          />
                        );
                      }
                      return (
                        <SimpleProductCard
                          key={product.id}
                          product={product}
                          lang={lang}
                          color={color}
                        />
                      );
                    })}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
