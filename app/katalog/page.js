"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

function UmmedBadge() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#E8491D" }}>
      <span className="text-white font-bold text-xs">U</span>
      <span className="text-white font-semibold text-xs tracking-wider">UMMED</span>
    </div>
  );
}

function CategoryHeader({ nom }) {
  return (
    <div className="flex items-center justify-between pb-3 mb-6" style={{ borderBottom: "2px solid #1a1a1a" }}>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>{nom}</h2>
      <UmmedBadge />
    </div>
  );
}

/* Bir qatorli mahsulot satri: rasm chap, karta o'ng */
function ProductRow({ imageUrl, nom, pillLabel, pillColor, desc, isHit, badgeColor }) {
  return (
    <div className="flex flex-row gap-4 sm:gap-6 mb-5 items-start">
      {/* Rasm */}
      <div className="relative flex-shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center"
        style={{ width: 140, height: 140, minWidth: 140, border: "1px solid #e8e8e8" }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={nom} fill style={{ objectFit: "contain" }} className="p-2" sizes="140px" />
        ) : (
          <span className="text-4xl select-none opacity-25">📦</span>
        )}
        {isHit && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full text-white text-[10px] font-bold"
            style={{ backgroundColor: badgeColor || "#00BCD4" }}>
            Хит Продаж
          </span>
        )}
      </div>

      {/* Karta */}
      <div className="flex-1 rounded-xl p-4 sm:p-5 min-h-[140px] flex flex-col justify-start gap-2.5"
        style={{ backgroundColor: "#F5F5F5" }}>
        <span className="inline-block self-start px-3 py-1 rounded-md text-white text-sm font-semibold leading-snug"
          style={{ backgroundColor: pillColor || "#E8491D" }}>
          {pillLabel}
        </span>
        {desc && (
          <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{desc}</p>
        )}
      </div>
    </div>
  );
}

export default function KatalogPage() {
  const { lang } = useLang();
  const [mahsulotlar, setMahsulotlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [activeKat, setActiveKat] = useState(null);

  useEffect(() => {
    fetch("/api/mahsulotlar?hammasi=true")
      .then((r) => r.json())
      .then((data) => {
        setMahsulotlar(Array.isArray(data) ? data.filter((p) => p.kategoriya) : []);
        setYuklanmoqda(false);
      })
      .catch(() => setYuklanmoqda(false));
  }, []);

  const sections = useMemo(() => {
    const byKat = new Map();
    for (const p of mahsulotlar) {
      const kid = p.kategoriyaId || p.kategoriya?.slug;
      if (!byKat.has(kid)) byKat.set(kid, { kategoriya: p.kategoriya, products: [] });
      byKat.get(kid).products.push(p);
    }
    return [...byKat.values()].sort((a, b) => (a.kategoriya?.tartibRaqami ?? 99) - (b.kategoriya?.tartibRaqami ?? 99));
  }, [mahsulotlar]);

  const displayedSections = useMemo(() =>
    activeKat ? sections.filter((s) => s.kategoriya?.slug === activeKat) : sections,
    [sections, activeKat]
  );

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "#fff", minHeight: "60vh" }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-20 sm:pb-28">

          <Reveal variant="up" className="mb-10">
            <span className="section-label">{lang === "ru" ? "КАТАЛОГ" : "KATALOG"}</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight" style={{ color: "#1a1a1a" }}>
              {lang === "ru" ? "Каталог продукции" : "Mahsulotlar katalogi"}
            </h1>
          </Reveal>

          <div className="flex gap-10 lg:gap-16 items-start">

            {/* Chap tomondagi kategoriya menyusi */}
            {!yuklanmoqda && sections.length > 0 && (
              <aside className="hidden md:block flex-shrink-0 sticky top-24" style={{ width: 200 }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#aaa" }}>
                  {lang === "ru" ? "Категории" : "Kategoriyalar"}
                </p>
                <ul className="space-y-0.5">
                  <li>
                    <button onClick={() => setActiveKat(null)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                      style={!activeKat ? { backgroundColor: "#f0f0f0", fontWeight: 600, color: "#1a1a1a" } : { color: "#555" }}>
                      {lang === "ru" ? "Все" : "Hammasi"}
                    </button>
                  </li>
                  {sections.map((s) => {
                    const nom = lang === "ru" ? (s.kategoriya?.nomRu || s.kategoriya?.nom) : s.kategoriya?.nom;
                    const isActive = activeKat === s.kategoriya?.slug;
                    return (
                      <li key={s.kategoriya?.slug}>
                        <button onClick={() => setActiveKat(s.kategoriya?.slug)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                          style={isActive
                            ? { backgroundColor: s.kategoriya?.rangKodi + "18", fontWeight: 600, color: s.kategoriya?.rangKodi || "#E8491D" }
                            : { color: "#555" }}>
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: s.kategoriya?.rangKodi || "#E8491D" }} />
                          {nom}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            )}

            {/* O'ng tomondagi asosiy kontent */}
            <div className="flex-1 min-w-0">
              {yuklanmoqda ? (
                <p className="text-sm py-24 text-center" style={{ color: "#aaa" }}>Yuklanmoqda...</p>
              ) : displayedSections.length === 0 ? (
                <p className="text-sm py-24 text-center" style={{ color: "#aaa" }}>Mahsulotlar topilmadi</p>
              ) : (
                <div className="space-y-14">
                  {displayedSections.map(({ kategoriya, products }) => {
                    const katNom = lang === "ru" ? (kategoriya?.nomRu || kategoriya?.nom) : kategoriya?.nom;
                    const color = kategoriya?.rangKodi || "#E8491D";

                    return (
                      <section key={kategoriya?.slug} id={`kat-${kategoriya?.slug}`}>
                        <CategoryHeader nom={katNom} />

                        {products.map((product) => {
                          const imageUrl = product.asosiyRasmUrl || product.rasmlar?.[0]?.rasmUrl;
                          const nom = lang === "ru" ? (product.nomRu || product.nom) : product.nom;
                          const desc = lang === "ru"
                            ? (product.qisqaTavsifRu || product.qisqaTavsif)
                            : (product.qisqaTavsif || product.qisqaTavsifRu);
                          const variants = Array.isArray(product.variantlar) && product.variantlar.length > 0
                            ? product.variantlar : null;

                          if (variants) {
                            return (
                              <div key={product.id}>
                                {variants.map((v, i) => (
                                  <ProductRow
                                    key={v.id || i}
                                    imageUrl={imageUrl}
                                    nom={v.label}
                                    pillLabel={v.label}
                                    pillColor={v.color || color}
                                    desc={i === 0 ? desc : null}
                                    isHit={v.hit}
                                    badgeColor="#00BCD4"
                                  />
                                ))}
                              </div>
                            );
                          }

                          return (
                            <ProductRow
                              key={product.id}
                              imageUrl={imageUrl}
                              nom={nom}
                              pillLabel={nom}
                              pillColor={color}
                              desc={desc}
                              isHit={product.featured}
                              badgeColor="#00BCD4"
                            />
                          );
                        })}
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
