"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { getProduct, getSimilar, formatPrice, PRODUCTS } from "@/lib/products";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function ContactForm({ productName }) {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Arizangiz qabul qilindi!
        </h3>
        <p className="text-sm text-gray-500">
          Menejerimiz tez orada siz bilan bog'lanadi.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", phone: "", comment: "" }); }}
          className="mt-5 text-sm font-medium hover:underline"
          style={{ color: "#E8491D" }}
        >
          Yana so'rash
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ismingiz <span style={{ color: "#E8491D" }}>*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Ism Familiya"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
          style={{ "--tw-ring-color": "#E8491D" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon <span style={{ color: "#E8491D" }}>*</span>
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="+998 90 000-00-00"
          type="tel"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
          style={{ "--tw-ring-color": "#E8491D" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Izoh
        </label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={3}
          placeholder={`"${productName}" haqida savol yoki miqdor...`}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
          style={{ "--tw-ring-color": "#E8491D" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "#E8491D" }}
      >
        {loading ? "Yuborilmoqda..." : "Narx so'rash →"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Ma'lumotlaringiz faqat aloqa uchun ishlatiladi
      </p>
    </form>
  );
}

export default function ProductPage({ params }) {
  const { id } = use(params);
  const product = getProduct(id);

  if (!product) notFound();

  const similar = getSimilar(product);
  const [activeTab, setActiveTab] = useState("tavsif");

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-gray-600 transition-colors">Bosh sahifa</Link>
            <span>/</span>
            <Link href="/katalog" className="hover:text-gray-600 transition-colors">Katalog</Link>
            <span>/</span>
            <span className="font-medium text-gray-700 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Asosiy blok */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Chap: Rasm + Tabs */}
            <div className="lg:col-span-2 space-y-6 anim-fade-left" style={{ animationDelay: "100ms" }}>

              {/* Rasm */}
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div
                  className="relative flex items-center justify-center py-16 text-[140px] leading-none"
                  style={{ backgroundColor: "#FFF5F3" }}
                >
                  {product.badge && (
                    <span
                      className="absolute top-5 left-5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                      style={{
                        backgroundColor:
                          product.badge === "Yangi" ? "#3DB851" :
                          product.badge === "Ommabop" ? "#E8491D" : "#6366f1",
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-5 right-5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-400 text-white">
                      Sotib bo'lindi
                    </span>
                  )}
                  <span className="select-none">{product.img}</span>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-100">
                  <div className="flex">
                    {[
                      { key: "tavsif", label: "Tavsif" },
                      { key: "specs", label: "Texnik ma'lumot" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                          activeTab === tab.key
                            ? "border-[#E8491D] text-[#E8491D]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        style={activeTab === tab.key ? { borderColor: "#E8491D", color: "#E8491D" } : {}}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {activeTab === "tavsif" ? (
                      <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                        {product.fullDesc}
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <tbody>
                          {product.specs.map((s, i) => (
                            <tr
                              key={s.label}
                              className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            >
                              <td className="py-2.5 px-3 font-medium text-gray-500 w-1/2 rounded-l-lg">
                                {s.label}
                              </td>
                              <td className="py-2.5 px-3 text-gray-800 font-semibold rounded-r-lg">
                                {s.value}
                              </td>
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
            <div className="space-y-5 anim-fade-right" style={{ animationDelay: "250ms" }}>

              {/* Narx kartasi */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {product.categoryLabel}
                </span>
                <h1 className="text-2xl font-extrabold text-gray-800 mt-2 mb-4 leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-end gap-3 mb-5">
                  <span
                    className="text-3xl font-extrabold"
                    style={{ color: "#E8491D" }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-base text-gray-400 line-through mb-1">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                {product.oldPrice && (
                  <div
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full text-white mb-5"
                    style={{ backgroundColor: "#3DB851" }}
                  >
                    💰 {Math.round((1 - product.price / product.oldPrice) * 100)}% chegirma
                  </div>
                )}

                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {product.desc}
                </p>

                <div className="flex items-center gap-2 mb-5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-gray-400"}`}>
                    {product.inStock ? "Mavjud" : "Sotib bo'lindi"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-4">
                  <span>🚚 Tezkor yetkazib berish</span>
                  <span>·</span>
                  <span>🛡️ Kafolat bor</span>
                </div>
              </div>

              {/* Narx so'rash formasi */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-800 mb-1">
                  Narx so'rash
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  Ulgurji narx yoki qo'shimcha ma'lumot uchun
                </p>
                <ContactForm productName={product.name} />
              </div>
            </div>
          </div>
        </div>

        {/* O'xshash mahsulotlar */}
        {similar.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <Reveal variant="up" as="h2" className="text-xl font-extrabold text-gray-800 mb-6">
              O'xshash mahsulotlar
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((p, idx) => (
                <Link
                  key={p.id}
                  href={`/katalog/${p.id}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col anim-fade-up"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                >
                  <div
                    className="flex items-center justify-center h-36 text-6xl"
                    style={{ backgroundColor: "#FFF5F3" }}
                  >
                    {p.img}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      {p.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 mb-1 leading-snug group-hover:text-[#E8491D] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-400 flex-1 mb-3 leading-relaxed">
                      {p.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold" style={{ color: "#E8491D" }}>
                        {formatPrice(p.price)}
                      </span>
                      <span
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                        style={{ backgroundColor: "#3DB851" }}
                      >
                        Batafsil →
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
