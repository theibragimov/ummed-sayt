"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

/* ── Kategoriya sarlavhasi ── */
function SectionHeader({ nom }) {
  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 text-gray-900 dark:text-white">
        {nom}
      </h2>
      <div className="h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

/* ── Mahsulot rasmi qutisi (hit badge ichida) ── */
function ImgBox({ url, alt, isHit, hitColor, wide }) {
  return (
    <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 self-stretch border border-gray-200 dark:border-gray-700"
      style={{ width: wide ? 560 : 280, minWidth: wide ? 560 : 280, minHeight: 240 }}>
      {url ? (
        <Image src={url} alt={alt} fill style={{ objectFit: "contain" }} className="p-4" sizes="280px" />
      ) : (
        <span className="text-5xl opacity-20 select-none">📦</span>
      )}
      {isHit && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: hitColor || "#00BCD4" }}>
          Хит Продаж
        </span>
      )}
    </div>
  );
}

/* ── Tavsif kartasi (o'ng tomon) ── */
function DescCard({ pillLabel, pillColor, desc }) {
  return (
    <div className="flex-1 rounded-2xl p-7 sm:p-9 flex flex-col gap-4 justify-start bg-gray-100 dark:bg-gray-800"
      style={{ minHeight: 240 }}>
      <span className="inline-block self-start px-4 py-2 rounded-xl text-white text-sm font-medium leading-snug"
        style={{ backgroundColor: pillColor || "#E8491D" }}>
        {pillLabel}
      </span>
      {desc && (
        <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {desc}
        </p>
      )}
    </div>
  );
}

/* ── Oddiy qator: [rasm] chap, [karta] o'ng ── */
function HeroRow({ imageUrl, alt, pillLabel, pillColor, desc, isHit, hitColor, wide }) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-8">
      <ImgBox url={imageUrl} alt={alt} isHit={isHit} hitColor={hitColor} wide={wide} />
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
            <ImgBox url={imageUrl} alt={v.label} isHit={v.hit} hitColor="#00BCD4" />
            <div className="mt-3 py-2.5 px-4 rounded-xl text-center text-white text-sm font-bold"
              style={{ backgroundColor: v.color || "#E8491D" }}>
              {v.label}
            </div>
          </div>
        ))}
      </div>
      {desc && (
        <div className="rounded-2xl p-6 sm:p-8 bg-gray-100 dark:bg-gray-800">
          <span className="inline-block px-4 py-1.5 rounded-xl text-white text-sm font-bold mb-3"
            style={{ backgroundColor: "#2d3748" }}>
            {nom}
          </span>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">{desc}</p>
        </div>
      )}
    </div>
  );
}

/* ── 4×N grid layout (Makon Mirzo uslubi) ── */
function ProductGrid({ products, lang, color }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => {
        const url = product.asosiyRasmUrl || product.rasmlar?.[0]?.rasmUrl;
        const nom = lang === "ru" ? (product.nomRu || product.nom) : lang === "en" ? (product.nomEn || product.nom) : product.nom;
        const pillColor = (product.brend && product.brend.startsWith('#')) ? product.brend : color;
        return (
          <div key={product.id} className="flex flex-col gap-3">
            <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
              style={{ aspectRatio: '1/1' }}>
              {url ? (
                <Image src={url} alt={nom} fill style={{ objectFit: "contain" }} className="p-3" sizes="280px" />
              ) : (
                <span className="text-4xl opacity-20 select-none">📦</span>
              )}
              {product.featured && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap"
                  style={{ backgroundColor: "#00BCD4" }}>Хит Продаж</span>
              )}
            </div>
            <div className="px-3 py-2 rounded-xl text-center text-white text-xs sm:text-sm font-medium leading-snug"
              style={{ backgroundColor: pillColor }}>
              {nom}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Kategoriya navigatsiyasi (yuqorida, anchor) ── */
function CategoryNav({ sections, activeKat, setActiveKat, lang }) {
  return (
    <div className="flex flex-wrap gap-2 mb-12">
      <button onClick={() => setActiveKat(null)}
        className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        style={!activeKat ? { backgroundColor: "#111", color: "#fff" } : { backgroundColor: "var(--nav-bg, #f0f0f0)", color: "var(--nav-color, #444)" }}>
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
              : { backgroundColor: "var(--nav-bg, #f0f0f0)", color: "var(--nav-color, #444)" }}>
            {nom}
          </button>
        );
      })}
    </div>
  );
}

/* ── Animatsiyali ro'yxat ── */
function FadeList({ children, triggerKey }) {
  const [visible, setVisible] = useState(false);
  const prev = useRef(triggerKey);

  useEffect(() => {
    if (prev.current !== triggerKey) {
      setVisible(false);
      const t = setTimeout(() => { setVisible(true); prev.current = triggerKey; }, 50);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [triggerKey]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    }}>
      {children}
    </div>
  );
}

/* ── Scroll animatsiyasi ── */
function ScrollReveal({ children }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShow(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
    }}>
      {children}
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
      <main className="bg-white dark:bg-gray-900" style={{ fontFamily: "var(--font-sans)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-24">

          <Reveal variant="up" className="mb-10">
            <span className="section-label mb-3">{lang === "ru" ? "Каталог" : "Katalog"}</span>
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-6 text-gray-900 dark:text-white">
              {lang === "ru" ? "Продукция" : "Mahsulotlar"}
            </h1>
          </Reveal>

          {!yuklanmoqda && sections.length > 1 && (
            <CategoryNav sections={sections} activeKat={activeKat} setActiveKat={setActiveKat} lang={lang} />
          )}

          {yuklanmoqda ? (
            <p className="text-center py-24 text-sm text-gray-400">Yuklanmoqda...</p>
          ) : displayed.length === 0 ? (
            <p className="text-center py-24 text-sm text-gray-400">Mahsulotlar topilmadi</p>
          ) : (
            <FadeList triggerKey={activeKat}>
              <div className="space-y-16 sm:space-y-20">
                {displayed.map(({ kategoriya, products }) => {
                  const katNom = lang === "ru" ? (kategoriya?.nomRu || kategoriya?.nom) : lang === "en" ? (kategoriya?.nomEn || kategoriya?.nom) : kategoriya?.nom;
                  const color = kategoriya?.rangKodi || "#E8491D";
                  const wideImg = ['kalopriyomniklar', 'pastalar', 'reabilitatsiya', 'ginekologik-mahsulotlar'].includes(kategoriya?.slug);
                  const isGrid = kategoriya?.slug === 'ortopediya';

                  return (
                    <ScrollReveal key={kategoriya?.slug}>
                      <section>
                        <SectionHeader nom={katNom} />

                        {isGrid ? (
                          <ProductGrid products={products} lang={lang} color={color} />
                        ) : products.map((product) => {
                          const url = product.asosiyRasmUrl || product.rasmlar?.[0]?.rasmUrl;
                          const nom = lang === "ru" ? (product.nomRu || product.nom) : lang === "en" ? (product.nomEn || product.nom) : product.nom;
                          const desc = lang === "ru"
                            ? (product.qisqaTavsifRu || product.qisqaTavsif)
                            : lang === "en"
                            ? (product.qisqaTavsifEn || product.qisqaTavsif)
                            : (product.qisqaTavsif || product.qisqaTavsifRu);
                          const pillColor = (product.brend && product.brend.startsWith('#'))
                            ? product.brend : color;
                          const variants = Array.isArray(product.variantlar) && product.variantlar.length > 0
                            ? product.variantlar : null;

                          if (variants) {
                            const isGridVariant = variants.some((v) => v.grid);
                            if (isGridVariant) {
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
                                    wide={wideImg}
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
                              pillColor={pillColor}
                              desc={desc}
                              isHit={product.featured}
                              hitColor="#00BCD4"
                              wide={wideImg}
                            />
                          );
                        })}
                      </section>
                    </ScrollReveal>
                  );
                })}
              </div>
            </FadeList>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
