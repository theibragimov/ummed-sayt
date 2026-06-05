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
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [boshqalar, setBoshqalar] = useState([]);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetch(`/api/mahsulotlar/${slug}`)
      .then(async (r) => {
        if (!r.ok) { setNotFoundState(true); return; }
        const data = await r.json();
        setProduct(data);
        // Shu tur bo'yicha boshqa mahsulotlarni yuklash
        if (data.turi) {
          fetch(`/api/mahsulotlar?turi=${data.turi}`)
            .then(r2 => r2.json())
            .then(all => setBoshqalar(Array.isArray(all) ? all.filter(m => m.slug !== slug) : []))
            .catch(() => {});
        }
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
              {ru ? "Загрузка..." : "Yuklanmoqda..."}
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  // Til bo'yicha matnlar
  const nom = (ru && product.nomRu) ? product.nomRu : product.nom;
  const qisqaTavsif = (ru && product.qisqaTavsifRu) ? product.qisqaTavsifRu : product.qisqaTavsif;
  const toliqTavsif = (ru && product.toliqTavsifRu) ? product.toliqTavsifRu : product.toliqTavsif;
  const kategoriyaNom = ru
    ? (product.kategoriya?.nomRu || product.kategoriya?.nom || "")
    : (product.kategoriya?.nom || "");

  const turiLabel = ru
    ? (product.turi === "ummed-brend" ? "Бренд Ummed" : product.turi === "distribyutor" ? "Дистрибьютор" : "Каталог")
    : (product.turi === "ummed-brend" ? "Ummed Brendi" : product.turi === "distribyutor" ? "Distribyutor" : "Katalog");

  const backHref = product.turi === "ummed-brend" || product.turi === "distribyutor" ? "/" : "/katalog";

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "var(--bg)" }}>

        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap" style={{ color: "var(--text-muted, #888)" }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">
              {ru ? "Главная" : "Bosh sahifa"}
            </Link>
            <span>/</span>
            <Link href={backHref} className="hover:opacity-70 transition-opacity">{turiLabel}</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{nom}</span>
          </nav>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Chap: Rasm — ramkasiz */}
            <div>
              <div
                className="w-full flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: "1 / 1", position: "relative" }}
              >
                {product.badge && (
                  <span className="absolute top-5 left-5 z-10 text-xs font-semibold px-3 py-1 text-white"
                    style={{ backgroundColor: product.badge === "Yangi" ? "#3DB851" : "#E8491D" }}>
                    {product.badge}
                  </span>
                )}
                {product.asosiyRasmUrl ? (
                  <Image
                    src={product.asosiyRasmUrl}
                    alt={nom}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <span className="text-[120px] select-none">
                    {getCategoryEmoji(product.kategoriya?.slug)}
                  </span>
                )}
              </div>

              {/* Qo'shimcha rasmlar */}
              {product.rasmlar?.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {product.rasmlar.map((r, i) => (
                    <div key={i} className="w-16 h-16 overflow-hidden"
                      style={{ position: "relative" }}>
                      <Image src={r.rasmUrl} alt="" fill style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* O'ng: Ma'lumot */}
            <div className="flex flex-col">
              {/* Kategoriya label */}
              <span className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#E8491D" }}>
                {kategoriyaNom || turiLabel}
              </span>

              {/* Nom */}
              <h1 className="text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mb-4"
                style={{ color: "var(--text)" }}>
                {nom}
              </h1>

              {/* Brend */}
              {product.brend && (
                <p className="text-sm font-light mb-2" style={{ color: "var(--text-muted, #888)" }}>
                  {ru ? "Бренд" : "Brend"}: <strong style={{ color: "var(--text)" }}>{product.brend}</strong>
                  {product.modelRaqami && (
                    <> · {ru ? "Модель" : "Model"}: <strong style={{ color: "var(--text)" }}>{product.modelRaqami}</strong></>
                  )}
                </p>
              )}

              {/* Mavjudlik */}
              <div className="py-5 my-5" style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)", borderBottom: "1px solid var(--border-strong, #e5e5e5)" }}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.mavjudligi ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="text-sm font-light" style={{ color: product.mavjudligi ? "#16a34a" : "#9ca3af" }}>
                    {product.mavjudligi
                      ? (ru ? "В наличии" : "Mavjud")
                      : (ru ? "Нет в наличии" : "Tugagan")}
                  </span>
                </div>
              </div>

              {/* Qisqa tavsif */}
              {qisqaTavsif && (
                <div className="prose prose-sm max-w-none text-base font-light leading-relaxed mb-6"
                  style={{ color: "var(--text-muted, #888)" }}
                  dangerouslySetInnerHTML={{ __html: tavsifHtml(qisqaTavsif) }} />
              )}

              {/* To'liq tavsif */}
              {toliqTavsif && (
                <div className="prose prose-sm max-w-none mb-8 font-light leading-relaxed"
                  style={{ color: "var(--text)" }}
                  dangerouslySetInnerHTML={{ __html: tavsifHtml(toliqTavsif) }} />
              )}

              {/* Bog'lanish tugmasi */}
              <div className="mt-auto pt-4">
                <Link
                  href="/aloqa"
                  className="inline-flex items-center justify-center w-full py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#E8491D" }}
                >
                  {ru ? "Связаться с нами" : "Bog'lanish"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Boshqa mahsulotlar */}
        {boshqalar.length > 0 && (
          <div style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)" }}>
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-10" style={{ color: "var(--text)" }}>
                {ru ? "Другие продукты дистрибьютора" : "Boshqa distribyutor mahsulotlarimiz"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {boshqalar.map((m) => {
                  const mNom = (ru && m.nomRu) ? m.nomRu : m.nom;
                  const mTavsif = (ru && m.qisqaTavsifRu) ? m.qisqaTavsifRu : m.qisqaTavsif;
                  return (
                    <Link key={m.id} href={`/mahsulot/${m.slug}`} className="group block">
                      {/* Rasm */}
                      <div className="relative w-full overflow-hidden mb-5"
                        style={{ height: 260 }}>
                        {m.asosiyRasmUrl ? (
                          <Image
                            src={m.asosiyRasmUrl}
                            alt={mNom}
                            fill
                            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                            className="group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-7xl"
                            style={{ backgroundColor: "var(--card-bg, #f8f8f6)" }}>
                            {getCategoryEmoji(m.kategoriya?.slug)}
                          </div>
                        )}
                      </div>
                      {/* Matn */}
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#E8491D" }}>
                          {ru ? (m.kategoriya?.nomRu || m.kategoriya?.nom || "") : (m.kategoriya?.nom || "")}
                        </span>
                        <h3 className="text-lg font-medium leading-snug mt-1 group-hover:opacity-70 transition-opacity"
                          style={{ color: "var(--text)" }}>
                          {mNom}
                        </h3>
                        {mTavsif && (
                          <p className="text-sm font-light leading-relaxed mt-2 line-clamp-2"
                            style={{ color: "var(--text-muted, #888)" }}>
                            {mTavsif}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
      <SiteFooter />
    </>
  );
}

function tavsifHtml(matn) {
  if (!matn) return '';
  if (/<[a-z][\s\S]*>/i.test(matn)) return matn;
  return matn
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

function getCategoryEmoji(slug) {
  const map = { diagnostika: "🩺", "nafas-jihozlari": "💨", "yurak-jihozlari": "❤️", "tibbiy-mebel": "🛏️", sterilizatsiya: "🧪" };
  return map[slug] || "🏥";
}
