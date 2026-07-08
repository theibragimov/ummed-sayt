"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

// Bir xil nomli, faqat variantlari (o'lcham/rang) bilan farqlanadigan mahsulotlarni guruhlash
function groupVariants(list) {
  const result = [];
  const seen = new Set();
  const nameMap = new Map();
  for (const p of list) {
    const variantlar = Array.isArray(p.variantlar) ? p.variantlar : [];
    if (variantlar.length > 0) {
      const key = (p.nom || "").trim().toLowerCase();
      if (!nameMap.has(key)) nameMap.set(key, []);
      nameMap.get(key).push(p);
    }
  }
  for (const p of list) {
    if (seen.has(p.id)) continue;
    const variantlar = Array.isArray(p.variantlar) ? p.variantlar : [];
    if (variantlar.length > 0) {
      const key = (p.nom || "").trim().toLowerCase();
      const group = nameMap.get(key) || [p];
      group.forEach((gp) => seen.add(gp.id));
      if (group.length > 1) {
        result.push({ type: "group", nom: p.nom, group });
      } else {
        result.push({ type: "single", product: p });
      }
    } else {
      seen.add(p.id);
      result.push({ type: "single", product: p });
    }
  }
  return result;
}

// Mahsulot "boyitilgan" hisoblanadi — tavsif yozilgan yoki belgi/hit qo'yilgan bo'lsa
function boyitilganmi(p) {
  return Boolean(p.qisqaTavsif || p.qisqaTavsifRu || p.featured || p.belgi);
}

function StatusBadges({ product, cat }) {
  const isTezOrada = product.belgi === "tez_orada";
  const isYangi = product.belgi === "yangi";
  return (
    <>
      {(product.featured || isYangi) && (
        <span
          className="absolute top-3 left-3 text-[10px] sm:text-xs font-bold px-2.5 py-1 text-white z-10 rounded-md"
          style={{ backgroundColor: product.featured ? "#E8491D" : "#3DB851" }}
        >
          {product.featured ? cat.badges.hit : cat.badges.Yangi}
        </span>
      )}
      {isTezOrada ? (
        <span className="absolute top-3 right-3 text-[10px] sm:text-xs font-medium px-2.5 py-1 text-white z-10 rounded-md" style={{ backgroundColor: "#6b7280" }}>
          {cat.badges.tezOrada}
        </span>
      ) : (
        !product.mavjudligi && (
          <span className="absolute top-3 right-3 text-[10px] sm:text-xs font-medium px-2.5 py-1 text-white z-10 rounded-md" style={{ backgroundColor: "#9ca3af" }}>
            {cat.badges.tugagan}
          </span>
        )
      )}
    </>
  );
}

// Boyitilgan mahsulotlar uchun: rasm chapda, rangli pill-sarlavhali tavsif kartasi o'ngda
function HeroRow({ item, lang, cat }) {
  const product = item.type === "group" ? item.group[0] : item.product;
  const nom = lang === "ru" ? (product.nomRu || product.nom) : lang === "en" ? (product.nomEn || product.nom) : product.nom;
  const tavsif = lang === "ru" ? (product.qisqaTavsifRu || product.qisqaTavsif) : product.qisqaTavsif;
  const rangKodi = product.kategoriya?.rangKodi || "#E8491D";

  return (
    <Link href={`/mahsulot/${product.slug}`}
      className="flex flex-col sm:flex-row gap-5 sm:gap-8 p-4 sm:p-6 transition-colors hover:opacity-95"
      style={{ border: "1px solid var(--border-strong, #e5e5e5)", textDecoration: "none" }}>
      <div className="relative flex items-center justify-center overflow-hidden flex-shrink-0 w-full sm:w-48"
        style={{ aspectRatio: "1 / 1", backgroundColor: "var(--card-bg, #f9f9f7)" }}>
        <StatusBadges product={product} cat={cat} />
        {product.asosiyRasmUrl ? (
          <Image src={product.asosiyRasmUrl} alt={nom} fill style={{ objectFit: "contain", background: "#fff" }} />
        ) : (
          <span className="text-6xl select-none">{getCategoryEmoji(product.kategoriya?.slug)}</span>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="inline-block self-start text-xs sm:text-sm font-semibold px-3 py-1.5 mb-3 rounded-full text-white"
          style={{ backgroundColor: rangKodi }}>
          {nom}
        </span>
        {tavsif && (
          <p className="text-sm font-light leading-relaxed" style={{ color: "var(--text-muted, #888)" }}>
            {tavsif}
          </p>
        )}
      </div>
    </Link>
  );
}

// Oddiy (hali tavsif yozilmagan) mahsulotlar uchun ixcham grid karta
function GridCard({ item, lang, cat }) {
  const product = item.type === "group" ? item.group[0] : item.product;
  const nom = lang === "ru" ? (product.nomRu || product.nom) : lang === "en" ? (product.nomEn || product.nom) : product.nom;
  const rangKodi = product.kategoriya?.rangKodi || "#E8491D";
  const katNom = lang === "ru" ? (product.kategoriya?.nomRu || product.kategoriya?.nom) : lang === "en" ? (product.kategoriya?.nomEn || product.kategoriya?.nom) : product.kategoriya?.nom;

  return (
    <Link href={`/mahsulot/${product.slug}`}
      className="flex flex-col overflow-hidden group"
      style={{ backgroundColor: "var(--bg)", borderRight: "1px solid var(--border-strong, #e5e5e5)", borderBottom: "1px solid var(--border-strong, #e5e5e5)", textDecoration: "none" }}>
      <div className="relative flex items-center justify-center overflow-hidden w-full" style={{ aspectRatio: "1 / 1" }}>
        <StatusBadges product={product} cat={cat} />
        {product.asosiyRasmUrl ? (
          <Image src={product.asosiyRasmUrl} alt={nom} fill
            style={{ objectFit: "contain", background: "#fff", transition: "transform 0.4s ease" }}
            className="group-hover:scale-[1.04]" />
        ) : (
          <span className="text-7xl select-none">{getCategoryEmoji(product.kategoriya?.slug)}</span>
        )}
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {katNom && (
          <span className="inline-block self-start text-[9px] sm:text-[10px] font-bold uppercase tracking-wide px-2 py-1 mb-2 rounded-full text-white"
            style={{ backgroundColor: rangKodi }}>
            {katNom}
          </span>
        )}
        <h3 className="text-xs sm:text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
          {nom}
        </h3>
      </div>
    </Link>
  );
}

function CategoryNav({ cat, category, kategoriyalar, lang, search, setCategory, setSearch, count }) {
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
        <p className="mt-2 text-xs font-light" style={{ color: "var(--text-muted, #888)" }}>
          {search || category !== "hammasi"
            ? `${count} ${cat.foundSuffix}`
            : `${cat.availableLabel}: ${count} ${cat.countSuffix}`}
        </p>
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
              <button onClick={() => setCategory(k.slug)} className="w-full flex items-center text-left text-sm font-light px-4 py-2.5 transition-colors"
                style={category === k.slug ? { color: "#E8491D", fontWeight: 500 } : { color: "var(--text)" }}>
                <span className="inline-block w-1.5 h-1.5 mr-2 flex-shrink-0 rounded-full" style={{ backgroundColor: k.rangKodi || "#E8491D" }} />
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

  // Natijalarni kategoriya bo'yicha bo'limlarga ajratish — PDF katalogdagi kabi bo'lim-bo'lim ko'rinish
  const sections = useMemo(() => {
    const byKat = new Map();
    for (const p of filtered) {
      const kid = p.kategoriyaId;
      if (!byKat.has(kid)) byKat.set(kid, []);
      byKat.get(kid).push(p);
    }
    const result = [];
    for (const k of kategoriyalar) {
      const products = byKat.get(k.id);
      if (!products || products.length === 0) continue;
      const curated = groupVariants(products.filter(boyitilganmi));
      const rest = groupVariants(products.filter((p) => !boyitilganmi(p)));
      result.push({ kategoriya: k, count: products.length, curated, rest });
    }
    return result;
  }, [filtered, kategoriyalar]);

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
              <CategoryNav cat={cat} category={category} kategoriyalar={kategoriyalar} lang={lang}
                search={search} setCategory={setCategory} setSearch={setSearch} count={filtered.length} />
            </div>
          )}

          <div className="flex gap-12">
            {/* Kontent — chapda */}
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
                <div className="flex flex-col gap-14">
                  {sections.map(({ kategoriya, count, curated, rest }) => {
                    const katNom = lang === 'ru' ? (kategoriya.nomRu || kategoriya.nom) : lang === 'en' ? (kategoriya.nomEn || kategoriya.nom) : kategoriya.nom;
                    const rangKodi = kategoriya.rangKodi || "#E8491D";
                    return (
                      <section key={kategoriya.id}>
                        <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid var(--border-strong, #e5e5e5)" }}>
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: rangKodi }} />
                          <h2 className="text-lg sm:text-xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
                            {katNom}
                          </h2>
                          <span className="text-xs font-light" style={{ color: "var(--text-muted, #888)" }}>({count})</span>
                        </div>

                        {curated.length > 0 && (
                          <div className="flex flex-col gap-3 mb-3">
                            {curated.map((item) => (
                              <HeroRow key={item.type === "group" ? item.group[0].id : item.product.id} item={item} lang={lang} cat={cat} />
                            ))}
                          </div>
                        )}

                        {rest.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px"
                            style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}>
                            {rest.map((item) => (
                              <GridCard key={item.type === "group" ? item.group[0].id : item.product.id} item={item} lang={lang} cat={cat} />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kategoriya navigatsiyasi — o'ngda */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-28 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                <CategoryNav cat={cat} category={category} kategoriyalar={kategoriyalar} lang={lang}
                  search={search} setCategory={setCategory} setSearch={setSearch} count={filtered.length} />
              </div>
            </aside>
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
