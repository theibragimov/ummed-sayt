"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function formatPrice(narx) {
  if (!narx) return "Narxni so'rang";
  return narx.toLocaleString("uz-UZ") + " so'm";
}

export default function MahsulotDetailPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [form, setForm] = useState({ ism: "", telefon: "", xabar: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/mahsulotlar/${slug}`)
      .then(async (r) => {
        if (!r.ok) { setNotFoundState(true); return; }
        setProduct(await r.json());
      })
      .catch(() => setNotFoundState(true));
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahsulot: product?.nom }),
      });
      setSent(true);
    } catch (_) {}
    setSending(false);
  }

  if (notFoundState) notFound();

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "var(--bg)" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#E8491D] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-light" style={{ color: "var(--text-muted, #888)" }}>Yuklanmoqda...</p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const turiLabel = product.turi === "ummed-brend" ? "Ummed Brendi" : product.turi === "distribyutor" ? "Distribyutor" : "Katalog";
  const backHref = product.turi === "ummed-brend" || product.turi === "distribyutor" ? "/" : "/katalog";

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "var(--bg)" }}>

        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap" style={{ color: "var(--text-muted, #888)" }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">Bosh sahifa</Link>
            <span>/</span>
            <Link href={backHref} className="hover:opacity-70 transition-opacity">{turiLabel}</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{product.nom}</span>
          </nav>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Chap: Rasm */}
            <div>
              <div
                className="w-full flex items-center justify-center overflow-hidden"
                style={{
                  aspectRatio: "1 / 1",
                  backgroundColor: "var(--card-bg, #f8f8f6)",
                  borderRadius: "2px",
                  position: "relative",
                }}
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
                    alt={product.nom}
                    fill
                    style={{ objectFit: "contain", padding: "32px" }}
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
                    <div key={i} className="w-16 h-16 overflow-hidden border border-gray-100"
                      style={{ backgroundColor: "var(--card-bg, #f8f8f6)", position: "relative" }}>
                      <Image src={r.rasmUrl} alt="" fill style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* O'ng: Ma'lumot + Form */}
            <div className="flex flex-col">
              {/* Kategoriya */}
              <span className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#E8491D" }}>
                {product.kategoriya?.nom || turiLabel}
              </span>

              <h1 className="text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mb-4"
                style={{ color: "var(--text)" }}>
                {product.nom}
              </h1>

              {product.brend && (
                <p className="text-sm font-light mb-2" style={{ color: "var(--text-muted, #888)" }}>
                  Brend: <strong style={{ color: "var(--text)" }}>{product.brend}</strong>
                  {product.modelRaqami && <> · Model: <strong style={{ color: "var(--text)" }}>{product.modelRaqami}</strong></>}
                </p>
              )}

              {/* Narx */}
              <div className="py-5 my-5" style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)", borderBottom: "1px solid var(--border-strong, #e5e5e5)" }}>
                <span className="text-3xl font-semibold" style={{ color: "#E8491D" }}>
                  {formatPrice(product.narx)}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${product.mavjudligi ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="text-sm font-light" style={{ color: product.mavjudligi ? "#16a34a" : "#9ca3af" }}>
                    {product.mavjudligi ? "Mavjud" : "Tugagan"}
                  </span>
                </div>
              </div>

              {/* Qisqa tavsif */}
              {product.qisqaTavsif && (
                <p className="text-base font-light leading-relaxed mb-6" style={{ color: "var(--text-muted, #888)" }}>
                  {product.qisqaTavsif}
                </p>
              )}

              {/* To'liq tavsif */}
              {product.toliqTavsif && (
                <div className="prose prose-sm max-w-none mb-8 font-light leading-relaxed"
                  style={{ color: "var(--text)" }}
                  dangerouslySetInnerHTML={{ __html: product.toliqTavsif }} />
              )}

              {/* Forma */}
              <div className="mt-auto">
                <div className="p-6" style={{ background: "var(--card-bg, #f8f8f6)" }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                    Buyurtma berish yoki narx so'rash
                  </h3>
                  {sent ? (
                    <div className="text-center py-4">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm font-medium" style={{ color: "#16a34a" }}>So'rovingiz qabul qilindi!</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted, #888)" }}>Tez orada bog'lanamiz</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        required value={form.ism}
                        onChange={e => setForm(f => ({ ...f, ism: e.target.value }))}
                        placeholder="Ismingiz *"
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                        style={{ border: "1px solid var(--border-strong, #e5e5e5)", background: "var(--bg)", color: "var(--text)" }}
                      />
                      <input
                        required value={form.telefon} type="tel"
                        onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))}
                        placeholder="Telefon raqamingiz *"
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                        style={{ border: "1px solid var(--border-strong, #e5e5e5)", background: "var(--bg)", color: "var(--text)" }}
                      />
                      <textarea
                        value={form.xabar} rows={2}
                        onChange={e => setForm(f => ({ ...f, xabar: e.target.value }))}
                        placeholder="Qo'shimcha xabar (ixtiyoriy)"
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none resize-none"
                        style={{ border: "1px solid var(--border-strong, #e5e5e5)", background: "var(--bg)", color: "var(--text)" }}
                      />
                      <button type="submit" disabled={sending}
                        className="w-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ background: "#E8491D" }}>
                        {sending ? "Yuborilmoqda..." : "Buyurtma berish"}
                      </button>
                    </form>
                  )}
                </div>
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
