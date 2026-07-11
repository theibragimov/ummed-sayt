"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

/* ── Kategoriya sarlavhasi ── */
function SectionHeader({ nom }) {
  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3" style={{ color: "#111" }}>
        {nom}
      </h2>
      <div style={{ height: 1, backgroundColor: "#ccc" }} />
    </div>
  );
}

/* ── Mahsulot rasmi qutisi ── */
function ImgBox({ url, alt }) {
  return (
    <div className="relative flex items-center justify-center bg-white rounded-2xl overflow-hidden flex-shrink-0"
      style={{ width: 280, height: 240, minWidth: 280, border: "1px solid #e5e5e5" }}>
      {url ? (
        <Image src={url} alt={alt} fill style={{ objectFit: "contain" }} className="p-4" sizes="280px" />
      ) : (
        <span className="text-5xl opacity-20 select-none">📦</span>
      )}
    </div>
  );
}

/* ── Hit badge ── */
function HitBadge({ color = "#00BCD4" }) {
  return (
    <div className="flex justify-center mt-3">
      <span className="px-5 py-1.5 rounded-full text-white text-xs font-bold"
        style={{ backgroundColor: color }}>
        Хит Продаж
      </span>
    </div>
  );
}

/* ── Tavsif kartasi (o'ng tomon) ── */
function DescCard({ pillLabel, pillColor, desc }) {
  return (
    <div className="flex-1 rounded-2xl p-7 sm:p-9 flex flex-col gap-4 justify-start"
      style={{ backgroundColor: "#F2F2F2", minHeight: 240 }}>
      <span className="inline-block self-start px-4 py-2 rounded-xl text-white text-sm font-bold leading-snug"
        style={{ backgroundColor: pillColor || "#E8491D" }}>
        {pillLabel}
      </span>
      {desc && (
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#444" }}>
          {desc}
        </p>
      )}
    </div>
  );
}

/* ── Oddiy qator: [rasm + hit] chap, [karta] o'ng ── */
function HeroRow({ imageUrl, alt, pillLabel, pillColor, desc, isHit, hitColor }) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-8">
      <div className="flex-shrink-0">
        <ImgBox url={imageUrl} alt={alt} size={200} />
        {isHit && <HitBadge color={hitColor} />}
      </div>
      <DescCard pillLabel={pillLabel} pillColor={pillColor} desc={desc} />
    </div>
  );
}

/* ── 2×2 grid (ignalar uslubi) + pastda tavsif kartasi ── */
function GridVariants({ imageUrl, variants, desc, nom }) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-5 sm:gap-6 mb-6">
        {variants.map((v, i) => (
          <div key={v.id || i} className="flex flex-col">
            <ImgBox url={imageUrl} alt={v.label} size={undefined} />
            {v.hit && <HitBadge color="#00BCD4" />}
            <div className="mt-3 py-2.5 px-4 rounded-xl text-center text-white text-sm font-bold"
              style={{ backgroundColor: v.color || "#E8491D" }}>
              {v.label}
            </div>
          </div>
        ))}
      </div>
      {desc && (
        <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "#F2F2F2" }}>
          <span className="inline-block px-4 py-1.5 rounded-xl text-white text-sm font-bold mb-3"
            style={{ backgroundColor: "#2d3748" }}>
            {nom}
          </span>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#444" }}>{desc}</p>
        </div>
      )}
    </div>
  );
}

/* ── Kategoriya navigatsiyasi (yuqorida, anchor) ── */
function CategoryNav({ sections, activeKat, setActiveKat, lang }) {
  return (
    <div className="flex flex-wrap gap-2 mb-12">
      <button onClick={() => setActiveKat(null)}
        className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        style={!activeKat ? { backgroundColor: "#111", color: "#fff" } : { backgroundColor: "#f0f0f0", color: "#444" }}>
        {lang === "ru" ? "Все" : "Hammasi"}
      </button>
      {sections.map((s) => {
        const nom = lang === "ru" ? (s.kategoriya?.nomRu || s.kategoriya?.nom) : s.kategoriya?.nom;
        const active = activeKat === s.kategoriya?.slug;
        return (
          <button key={s.kategoriya?.slug}
            onClick={() => setActiveKat(s.kategoriya?.slug)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={active
              ? { backgroundColor: s.kategoriya?.rangKodi || "#E8491D", color: "#fff" }
              : { backgroundColor: "#f0f0f0", color: "#444" }}>
            {nom}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════ ASOSIY SAHIFA ══════════════════ */
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
    const map = new Map();
    for (const p of mahsulotlar) {
      const k = p.kategoriyaId || p.kategoriya?.slug;
      if (!map.has(k)) map.set(k, { kategoriya: p.kategoriya, products: [] });
      map.get(k).products.push(p);
    }
    return [...map.values()].sort((a, b) =>
      (a.kategoriya?.tartibRaqami ?? 99) - (b.kategoriya?.tartibRaqami ?? 99)
    );
  }, [mahsulotlar]);

  const displayed = useMemo(() =>
    activeKat ? sections.filter((s) => s.kategoriya?.slug === activeKat) : sections,
    [sections, activeKat]
  );

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "#fff", fontFamily: "var(--font-sans)" }}>
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-24">

          <Reveal variant="up" className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#111" }}>
              {lang === "ru" ? "Продукция" : "Mahsulotlar"}
            </h1>
          </Reveal>

          {!yuklanmoqda && sections.length > 1 && (
            <CategoryNav sections={sections} activeKat={activeKat} setActiveKat={setActiveKat} lang={lang} />
          )}

          {yuklanmoqda ? (
            <p className="text-center py-24 text-sm" style={{ color: "#aaa" }}>Yuklanmoqda...</p>
          ) : displayed.length === 0 ? (
            <p className="text-center py-24 text-sm" style={{ color: "#aaa" }}>Mahsulotlar topilmadi</p>
          ) : (
            <div className="space-y-16 sm:space-y-20">
              {displayed.map(({ kategoriya, products }) => {
                const katNom = lang === "ru" ? (kategoriya?.nomRu || kategoriya?.nom) : kategoriya?.nom;
                const color = kategoriya?.rangKodi || "#E8491D";

                return (
                  <section key={kategoriya?.slug}>
                    <SectionHeader nom={katNom} />

                    {products.map((product) => {
                      const url = product.asosiyRasmUrl || product.rasmlar?.[0]?.rasmUrl;
                      const nom = lang === "ru" ? (product.nomRu || product.nom) : product.nom;
                      const desc = lang === "ru"
                        ? (product.qisqaTavsifRu || product.qisqaTavsif)
                        : (product.qisqaTavsif || product.qisqaTavsifRu);
                      const variants = Array.isArray(product.variantlar) && product.variantlar.length > 0
                        ? product.variantlar : null;

                      if (variants) {
                        const isGrid = variants.some((v) => v.grid);
                        if (isGrid) {
                          return (
                            <GridVariants
                              key={product.id}
                              imageUrl={url}
                              variants={variants}
                              desc={desc}
                              nom={nom}
                            />
                          );
                        }
                        // Hero qatorlar (har bir variant alohida qator)
                        return (
                          <div key={product.id}>
                            {variants.map((v, i) => (
                              <HeroRow
                                key={v.id || i}
                                imageUrl={url}
                                alt={v.label}
                                pillLabel={v.label}
                                pillColor={v.color || color}
                                desc={i === 0 ? desc : null}
                                isHit={v.hit}
                                hitColor="#00BCD4"
                              />
                            ))}
                          </div>
                        );
                      }

                      return (
                        <HeroRow
                          key={product.id}
                          imageUrl={url}
                          alt={nom}
                          pillLabel={nom}
                          pillColor={color}
                          desc={desc}
                          isHit={product.featured}
                          hitColor="#00BCD4"
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
