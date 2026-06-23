"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

function FilterPanel({ cat, category, kategoriyalar, lang, search, setCategory, setSearch }) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted, #888)" }}>
          {cat.search}
        </label>
        <input
          type="text"
          placeholder={cat.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 text-sm font-light focus:outline-none transition-colors"
          style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text)" }}
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted, #888)" }}>
          {cat.category}
        </p>
        <ul className="space-y-1">
          <li>
            <button onClick={() => setCategory("hammasi")} className="w-full text-left text-sm font-light px-4 py-2.5 transition-colors"
              style={category === "hammasi" ? { color: "#E8491D", fontWeight: 500 } : { color: "var(--text)" }}>
              {category === "hammasi" && <span className="inline-block w-1.5 h-1.5 mr-2 align-middle" style={{ backgroundColor: "#E8491D" }} />}
              {cat.categories?.hammasi || "Hammasi"}
            </button>
          </li>
          {kategoriyalar.map((k) => (
            <li key={k.id}>
              <button onClick={() => setCategory(k.slug)} className="w-full text-left text-sm font-light px-4 py-2.5 transition-colors"
                style={category === k.slug ? { color: "#E8491D", fontWeight: 500 } : { color: "var(--text)" }}>
                {category === k.slug && <span className="inline-block w-1.5 h-1.5 mr-2 align-middle" style={{ backgroundColor: "#E8491D" }} />}
                {lang === 'ru' ? (k.nomRu || k.nom) : lang === 'en' ? (k.nomEn || k.nom) : k.nom}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {(category !== "hammasi" || search) && (
        <button onClick={() => { setCategory("hammasi"); setSearch(""); }}
          className="w-full text-xs py-2.5 font-light tracking-wide transition-colors"
          style={{ border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text-muted, #888)" }}>
          {cat.reset}
        </button>
      )}
    </div>
  );
}

export default function KatalogPage() {
  const { t, lang } = useLang();
  const cat = t.catalog;

  const [mahsulotlar, setMahsulotlar] = useState([]);
  const [kategoriyalar, setKategoriyalar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [category, setCategory] = useState("hammasi");
  const [search, setSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function yuklash() {
      setYuklanmoqda(true);
      const [mRes, kRes] = await Promise.all([
        fetch("/api/mahsulotlar"),
        fetch("/api/kategoriyalar"),
      ]);
      const [m, k] = await Promise.all([mRes.json(), kRes.json()]);
      // Faqat kategoriyali mahsulotlar
      const faqatKategoriyali = Array.isArray(m) ? m.filter(p => p.kategoriya) : [];
      setMahsulotlar(faqatKategoriyali);
      setKategoriyalar(Array.isArray(k) ? k : []);
      setYuklanmoqda(false);
    }
    yuklash();
  }, []);

  const filtered = useMemo(() => {
    let list = [...mahsulotlar];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => (p.nom || "").toLowerCase().includes(q));
    }
    if (category !== "hammasi") {
      list = list.filter((p) => p.kategoriya?.slug === category);
    }
    return list;
  }, [mahsulotlar, category, search]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-16 sm:pb-24">

          <Reveal variant="up" className="mb-8 sm:mb-14">
            <span className="section-label">{cat.label}</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-4 sm:mt-6" style={{ color: "var(--text)" }}>
              {cat.title}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base font-light" style={{ color: "var(--text-muted, #888)" }}>
              {filtered.length} {cat.countSuffix}
            </p>
          </Reveal>

          <div className="md:hidden mb-6">
            <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="text-sm font-medium px-5 py-2.5 transition-colors"
              style={{ border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text)" }}>
              {mobileFilterOpen ? cat.filterClose : cat.filterOpen}
            </button>
          </div>

          {mobileFilterOpen && (
            <div className="md:hidden p-6 mb-8" style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}>
              <FilterPanel cat={cat} category={category} kategoriyalar={kategoriyalar} lang={lang}
                search={search} setCategory={setCategory} setSearch={setSearch} />
            </div>
          )}

          <div className="flex gap-12">
            <aside className="hidden md:block w-56 flex-shrink-0">
              <div className="sticky top-28">
                <FilterPanel cat={cat} category={category} kategoriyalar={kategoriyalar} lang={lang}
                  search={search} setCategory={setCategory} setSearch={setSearch} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {yuklanmoqda ? (
                <div className="flex items-center justify-center py-24" style={{ color: "var(--text-muted, #888)" }}>
                  <p className="text-sm font-light">Yuklanmoqda...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24" style={{ color: "var(--text-muted, #888)" }}>
                  <p className="text-lg font-medium">{cat.notFound}</p>
                  <p className="text-sm font-light mt-2">{cat.notFoundHint}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-px"
                  style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}>
                  {filtered.map((product) => {
                    const nom = lang === 'ru' ? (product.nomRu || product.nom) : lang === 'en' ? (product.nomEn || product.nom) : product.nom;
                    const variantlar = Array.isArray(product.variantlar) ? product.variantlar : [];
                    return (
                      <Link key={product.id} href={`/mahsulot/${product.slug}`}
                        className="flex flex-col overflow-hidden group"
                        style={{
                          backgroundColor: "var(--bg)",
                          borderRight: "1px solid var(--border-strong, #e5e5e5)",
                          borderBottom: "1px solid var(--border-strong, #e5e5e5)",
                          textDecoration: "none",
                        }}>
                        {/* Rasm */}
                        <div className="relative flex items-center justify-center overflow-hidden w-full"
                          style={{ aspectRatio: "1 / 1" }}>
                          {!product.mavjudligi && (
                            <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 text-white z-10"
                              style={{ backgroundColor: "#9ca3af" }}>
                              Tugagan
                            </span>
                          )}
                          {product.asosiyRasmUrl ? (
                            <Image src={product.asosiyRasmUrl} alt={nom} fill
                              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                              className="group-hover:scale-[1.04]" />
                          ) : (
                            <span className="text-7xl select-none">{getCategoryEmoji(product.kategoriya?.slug)}</span>
                          )}
                        </div>

                        {/* Ma'lumot */}
                        <div className="p-3 sm:p-5 flex flex-col flex-1">
                          <h3 className="text-xs sm:text-sm font-medium leading-snug mb-2 line-clamp-2"
                            style={{ color: "var(--text)" }}>
                            {nom}
                          </h3>

                          {/* Variantlar */}
                          {variantlar.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {variantlar.slice(0, 4).map((v, i) => (
                                <span key={i}
                                  className="text-[10px] sm:text-xs font-medium px-2 py-0.5"
                                  style={{ border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text-muted, #888)" }}>
                                  {v.xususiyatlar.map(x => x.qiymat).join(' / ')}
                                </span>
                              ))}
                              {variantlar.length > 4 && (
                                <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5"
                                  style={{ color: "var(--text-muted, #888)" }}>
                                  +{variantlar.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-auto">
                            <span className="inline-block text-[10px] sm:text-xs font-medium px-3 py-1.5 transition-opacity group-hover:opacity-80"
                              style={{ background: "#E8491D", color: "#fff", borderRadius: "50px" }}>
                              {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'View' : "Ko'rish"}
                            </span>
                          </div>
                        </div>
                      </Link>
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

function getCategoryEmoji(slug) {
  const map = { diagnostika: "🩺", "nafas-jihozlari": "💨", "yurak-jihozlari": "❤️", "tibbiy-mebel": "🛏️", sterilizatsiya: "🧪" };
  return map[slug] || "🏥";
}
