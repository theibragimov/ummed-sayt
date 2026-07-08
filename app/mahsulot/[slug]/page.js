"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

export default function MahsulotDetailPage({ params }) {
  const { lang } = useLang();
  const ru = lang === "ru";
  const en = lang === "en";
  const L = (uz, ru_t, en_t) => ru ? ru_t : en && en_t ? en_t : uz;
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [tanlanganRasm, setTanlanganRasm] = useState(0);

  useEffect(() => {
    setTanlanganRasm(0);
    fetch(`/api/mahsulotlar/${slug}`)
      .then(async (r) => {
        if (!r.ok) { setNotFoundState(true); return; }
        setProduct(await r.json());
      })
      .catch(() => setNotFoundState(true));
  }, [slug]);

  if (notFoundState) notFound();

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "var(--bg)" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#E8491D] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-light" style={{ color: "var(--text-muted, #888)" }}>
              {L("Yuklanmoqda...", "Загрузка...", "Loading...")}
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const nom = ru ? (product.nomRu || product.nom) : en ? (product.nomEn || product.nom) : product.nom;
  const kategoriyaNom = ru
    ? (product.kategoriya?.nomRu || product.kategoriya?.nom || "")
    : en ? (product.kategoriya?.nomEn || product.kategoriya?.nom || "")
    : (product.kategoriya?.nom || "");

  const variantlar = Array.isArray(product.variantlar) ? product.variantlar : [];
  const rasmlar = product.rasmlar || [];
  const joriyRasm = rasmlar[tanlanganRasm]?.rasmUrl || product.asosiyRasmUrl;

  // Variantlarni xususiyat bo'yicha guruhlash
  const variantGuruhlar = {}
  for (const v of variantlar) {
    for (const x of v.xususiyatlar) {
      if (!variantGuruhlar[x.nom]) variantGuruhlar[x.nom] = new Set()
      variantGuruhlar[x.nom].add(x.qiymat)
    }
  }

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "var(--bg)" }}>

        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap" style={{ color: "var(--text-muted, #888)" }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">
              {L("Bosh sahifa", "Главная", "Home")}
            </Link>
            <span>/</span>
            <Link href="/katalog" className="hover:opacity-70 transition-opacity">
              {L("Katalog", "Каталог", "Catalog")}
            </Link>
            {kategoriyaNom && (
              <>
                <span>/</span>
                <span style={{ color: "var(--text-muted, #888)" }}>{kategoriyaNom}</span>
              </>
            )}
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{nom}</span>
          </nav>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Chap: Rasm */}
            <div>
              <div className="w-full flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: "1 / 1", position: "relative", backgroundColor: "var(--card-bg, #f9f9f7)" }}>
                {joriyRasm ? (
                  <Image src={joriyRasm} alt={nom} fill style={{ objectFit: "contain" }} />
                ) : (
                  <span className="text-[120px] select-none">{getCategoryEmoji(product.kategoriya?.slug)}</span>
                )}
              </div>

              {/* Thumbnail rasmlar */}
              {rasmlar.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {rasmlar.map((r, i) => (
                    <button key={i} onClick={() => setTanlanganRasm(i)}
                      className="flex-shrink-0 w-16 h-16 overflow-hidden transition-opacity"
                      style={{
                        position: "relative",
                        border: tanlanganRasm === i ? "2px solid #E8491D" : "2px solid transparent",
                        opacity: tanlanganRasm === i ? 1 : 0.6,
                      }}>
                      <Image src={r.rasmUrl} alt="" fill style={{ objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* O'ng: Ma'lumot */}
            <div className="flex flex-col">
              {/* Kategoriya label + belgilar */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {kategoriyaNom && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: product.kategoriya?.rangKodi || "#E8491D" }}>
                    {kategoriyaNom}
                  </span>
                )}
                {product.featured && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white" style={{ backgroundColor: "#E8491D" }}>
                    {L("Хит Продаж", "Хит Продаж", "Bestseller")}
                  </span>
                )}
                {product.belgi === 'yangi' && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white" style={{ backgroundColor: "#3DB851" }}>
                    {L("Yangi", "Новый", "New")}
                  </span>
                )}
                {product.belgi === 'tez_orada' && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white" style={{ backgroundColor: "#6b7280" }}>
                    {L("Tez orada", "Скоро", "Coming soon")}
                  </span>
                )}
              </div>

              {/* Nom */}
              <h1 className="text-2xl md:text-3xl font-medium leading-[1.1] tracking-tight mb-4"
                style={{ color: "var(--text)" }}>
                {nom}
              </h1>

              {/* Model/kod */}
              {product.modelRaqami && (
                <p className="text-sm font-light mb-3" style={{ color: "var(--text-muted, #888)" }}>
                  {L("Kod", "Код", "Code")}: <strong style={{ color: "var(--text)" }}>{product.modelRaqami}</strong>
                </p>
              )}

              {/* Mavjudlik */}
              <div className="py-4 my-4" style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)", borderBottom: "1px solid var(--border-strong, #e5e5e5)" }}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.mavjudligi ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="text-sm font-light" style={{ color: product.mavjudligi ? "#16a34a" : "#9ca3af" }}>
                    {product.mavjudligi
                      ? L("Mavjud", "В наличии", "In Stock")
                      : product.belgi === 'tez_orada'
                      ? L("Tez orada", "Скоро", "Coming soon")
                      : L("Tugagan", "Нет в наличии", "Out of Stock")}
                  </span>
                </div>
              </div>

              {/* Tavsif */}
              {(() => {
                const qisqa = ru ? (product.qisqaTavsifRu || product.qisqaTavsif) : product.qisqaTavsif;
                const toliq = ru ? (product.toliqTavsifRu || product.toliqTavsif) : product.toliqTavsif;
                if (!qisqa && !toliq) return null;
                return (
                  <div className="mb-6">
                    {qisqa && (
                      <p className="text-sm font-medium leading-relaxed mb-3" style={{ color: "var(--text)" }}>
                        {qisqa}
                      </p>
                    )}
                    {toliq && (
                      <div className="text-sm font-light leading-relaxed prose-sm max-w-none"
                        style={{ color: "var(--text-muted, #888)" }}
                        dangerouslySetInnerHTML={{ __html: toliq }} />
                    )}
                  </div>
                );
              })()}

              {/* Variantlar (modifikatsiyalar) */}
              {Object.keys(variantGuruhlar).length > 0 && (
                <div className="mb-6 space-y-4">
                  {Object.entries(variantGuruhlar).map(([nom, qiymatlar]) => (
                    <div key={nom}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                        style={{ color: "var(--text-muted, #888)" }}>
                        {nom}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[...qiymatlar].map((q) => (
                          <span key={q}
                            className="text-sm font-medium px-3 py-1.5"
                            style={{ border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text)" }}>
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bog'lanish tugmasi */}
              <div className="mt-auto pt-4 flex flex-col gap-3">
                <a href="https://t.me/ummeduzbot" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#E8491D" }}>
                  {L("Narx va mavjudlikni so'rash", "Узнать цену и наличие", "Ask for Price & Availability")}
                </a>
                <Link href="/aloqa"
                  className="inline-flex items-center justify-center w-full py-3 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ border: "1px solid var(--border-strong, #e5e5e5)", color: "var(--text)" }}>
                  {L("Bog'lanish", "Связаться с нами", "Contact Us")}
                </Link>
              </div>
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
