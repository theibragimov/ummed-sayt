"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

function formatPrice(narx) {
  if (!narx) return "Narxni so'rang";
  return narx.toLocaleString("uz-UZ") + " so'm";
}

function tavsifHtml(matn) {
  if (!matn) return '';
  // Agar HTML teglari bo'lsa, shundayligicha qaytarish
  if (/<[a-z][\s\S]*>/i.test(matn)) return matn;
  // Oddiy tekst: ikki yangi qator = paragraf, bir yangi qator = <br>
  return matn
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

function ContactForm({ productName, pt }) {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahsulot: productName }),
      });
    } catch (_) {}
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{pt.successTitle}</h3>
        <p className="text-sm text-gray-500">{pt.successDesc}</p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", phone: "", comment: "" }); }}
          className="mt-5 text-sm font-medium hover:underline"
          style={{ color: "#E8491D" }}
        >
          {pt.successAgain}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {pt.formName} <span style={{ color: "#E8491D" }}>*</span>
        </label>
        <input
          name="name" value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required placeholder={pt.formName}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {pt.formPhone} <span style={{ color: "#E8491D" }}>*</span>
        </label>
        <input
          name="phone" value={form.phone} type="tel"
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          required placeholder="+998 90 000-00-00"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{pt.formComment}</label>
        <textarea
          name="comment" value={form.comment} rows={3}
          onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          placeholder={`"${productName}" ${pt.formCommentPlaceholder}`}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "#E8491D" }}
      >
        {loading ? pt.formSending : pt.formSubmit}
      </button>
      <p className="text-xs text-gray-400 text-center">{pt.formPrivacy}</p>
    </form>
  );
}

export default function ProductPage({ params }) {
  const { id: slug } = use(params);
  const { t, lang } = useLang();
  const pt = t.product;

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [notFoundState, setNotFoundState] = useState(false);
  const [activeTab, setActiveTab] = useState("tavsif");

  useEffect(() => {
    fetch(`/api/mahsulotlar/${slug}`)
      .then(async (r) => {
        if (!r.ok) { setNotFoundState(true); return; }
        const data = await r.json();
        setProduct(data);
        // O'xshash mahsulotlarni yuklash
        if (data.kategoriya?.slug) {
          fetch(`/api/mahsulotlar?kategoriya=${data.kategoriya.slug}&limit=3`)
            .then((r2) => r2.json())
            .then((list) => {
              setSimilar((Array.isArray(list) ? list : []).filter((p) => p.id !== data.id).slice(0, 3));
            });
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
          <p className="text-sm text-gray-400">Yuklanmoqda...</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const specsRaw = product.texnikXususiyatlar;
  const specs = Array.isArray(specsRaw) ? specsRaw : [];
  const ru = lang === 'ru';
  const displayNom = (ru && product.nomRu) ? product.nomRu : product.nom;
  const displayQisqa = (ru && product.qisqaTavsifRu) ? product.qisqaTavsifRu : product.qisqaTavsif;
  const fullDesc = (ru && product.toliqTavsifRu) ? product.toliqTavsifRu : (product.toliqTavsif || product.qisqaTavsif || "");

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-gray-600 transition-colors">{pt.breadcrumbHome}</Link>
            <span>/</span>
            <Link href="/katalog" className="hover:text-gray-600 transition-colors">{pt.breadcrumbCatalog}</Link>
            <span>/</span>
            <span className="font-medium text-gray-700 truncate max-w-[200px]">{displayNom}</span>
          </nav>
        </div>

        {/* Asosiy blok */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Chap: Rasm + Tabs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div
                  className="relative flex items-center justify-center py-16 leading-none overflow-hidden"
                  style={{ backgroundColor: "#FFF5F3", minHeight: 280 }}
                >
                  {product.badge && (
                    <span
                      className="absolute top-5 left-5 text-xs font-bold px-3 py-1.5 rounded-full text-white z-10"
                      style={{
                        backgroundColor:
                          product.badge === "Yangi" ? "#3DB851" :
                          product.badge === "Ommabop" ? "#E8491D" : "#6366f1",
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {!product.mavjudligi && (
                    <span className="absolute top-5 right-5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-400 text-white z-10">
                      {pt.outOfStock}
                    </span>
                  )}
                  {product.asosiyRasmUrl ? (
                    <Image
                      src={product.asosiyRasmUrl}
                      alt={product.nom}
                      width={400}
                      height={300}
                      style={{ objectFit: "contain", maxHeight: 300 }}
                    />
                  ) : (
                    <span className="text-[140px] select-none">
                      {getCategoryEmoji(product.kategoriya?.slug)}
                    </span>
                  )}
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-100">
                  <div className="flex">
                    {[
                      { key: "tavsif", label: pt.tabDesc },
                      ...(specs.length > 0 ? [{ key: "specs", label: pt.tabSpecs }] : []),
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-colors`}
                        style={
                          activeTab === tab.key
                            ? { borderColor: "#E8491D", color: "#E8491D" }
                            : { borderColor: "transparent", color: "#6b7280" }
                        }
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {activeTab === "tavsif" ? (
                      fullDesc
                        ? <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: tavsifHtml(fullDesc) }} />
                        : <span className="text-gray-400 italic">Tavsif mavjud emas</span>
                    ) : (
                      <table className="w-full text-sm">
                        <tbody>
                          {specs.map((s, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="py-2.5 px-3 font-medium text-gray-500 w-1/2 rounded-l-lg">{s.label}</td>
                              <td className="py-2.5 px-3 text-gray-800 font-semibold rounded-r-lg">{s.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* O'ng: Narx + Form */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {lang === 'ru' ? (product.kategoriya?.nomRu || product.kategoriya?.nom || "") : (product.kategoriya?.nom || "")}
                </span>
                <h1 className="text-2xl font-extrabold text-gray-800 mt-2 mb-4 leading-snug">
                  {displayNom}
                </h1>

                <div className="flex items-end gap-3 mb-5">
                  <span className="text-3xl font-extrabold" style={{ color: "#E8491D" }}>
                    {formatPrice(product.narx)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-5">{displayQisqa}</p>

                <div className="flex items-center gap-2 mb-5">
                  <span className={`w-2.5 h-2.5 rounded-full ${product.mavjudligi ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className={`text-sm font-medium ${product.mavjudligi ? "text-green-600" : "text-gray-400"}`}>
                    {product.mavjudligi ? pt.inStock : pt.outOfStock}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-4">
                  <span>🚚 {pt.delivery}</span>
                  <span>·</span>
                  <span>🛡️ {pt.warranty}</span>
                </div>
              </div>

              {/* Narx so'rash formasi */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-800 mb-1">{pt.requestTitle}</h2>
                <p className="text-xs text-gray-400 mb-5">{pt.requestDesc}</p>
                <ContactForm productName={product.nom} pt={pt} />
              </div>
            </div>
          </div>
        </div>

        {/* O'xshash mahsulotlar */}
        {similar.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <Reveal variant="up" as="h2" className="text-xl font-extrabold text-gray-800 mb-6">
              {pt.similar}
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((p, idx) => (
                <Link
                  key={p.id}
                  href={`/katalog/${p.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div
                    className="flex items-center justify-center h-36 overflow-hidden"
                    style={{ backgroundColor: "#FFF5F3" }}
                  >
                    {p.asosiyRasmUrl ? (
                      <Image src={p.asosiyRasmUrl} alt={p.nom} width={150} height={120} style={{ objectFit: "cover" }} />
                    ) : (
                      <span className="text-6xl">{getCategoryEmoji(p.kategoriya?.slug)}</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">{lang === 'ru' ? (p.kategoriya?.nomRu || p.kategoriya?.nom) : p.kategoriya?.nom}</span>
                    <h3 className="text-sm font-bold text-gray-800 mb-1 leading-snug group-hover:text-[#E8491D] transition-colors">
                      {(ru && p.nomRu) ? p.nomRu : p.nom}
                    </h3>
                    <p className="text-xs text-gray-400 flex-1 mb-3 leading-relaxed">{(ru && p.qisqaTavsifRu) ? p.qisqaTavsifRu : p.qisqaTavsif}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold" style={{ color: "#E8491D" }}>
                        {formatPrice(p.narx)}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: "#3DB851" }}>
                        {pt.detailBtn}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}

function getCategoryEmoji(slug) {
  const map = {
    diagnostika: "🩺",
    "nafas-jihozlari": "💨",
    "yurak-jihozlari": "❤️",
    "tibbiy-mebel": "🛏️",
    sterilizatsiya: "🧪",
  };
  return map[slug] || "🏥";
}
