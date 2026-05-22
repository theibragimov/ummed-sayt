"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function AloqaPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Ism kiritilmadi";
    if (!form.phone.trim()) e.phone = "Telefon kiritilmadi";
    if (!form.message.trim()) e.message = "Xabar kiritilmadi";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  }

  return (
    <>
      <SiteHeader />

      <main style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-24">

          {/* Sarlavha */}
          <Reveal variant="up" className="mb-16">
            <span className="section-label">Aloqa</span>
            <h1
              className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-6"
              style={{ color: "var(--text)" }}
            >
              Biz bilan bog'laning
            </h1>
            <p
              className="mt-4 text-base font-light max-w-xl"
              style={{ color: "var(--text-muted, #888)" }}
            >
              Savol, taklif yoki ulgurji buyurtma uchun murojaat qiling — menejerimiz tez orada javob beradi.
            </p>
          </Reveal>

          {/* Asosiy grid: forma + ma'lumotlar */}
          <div
            className="flex flex-col lg:flex-row"
            style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}
          >
            {/* Chap — Forma */}
            <Reveal variant="up" className="flex-1 p-8 lg:p-12">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-8"
                style={{ color: "var(--text-muted, #888)" }}
              >
                Xabar yuborish
              </p>

              {sent ? (
                <div className="flex flex-col py-12">
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-6"
                    style={{ backgroundColor: "#3DB851" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-medium mb-3"
                    style={{ color: "var(--text)" }}
                  >
                    Xabaringiz yuborildi
                  </h3>
                  <p
                    className="text-sm font-light leading-relaxed mb-8"
                    style={{ color: "var(--text-muted, #888)" }}
                  >
                    Menejerimiz ish vaqti ichida siz bilan bog'lanadi.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", phone: "", message: "" }); }}
                    className="self-start text-sm font-medium px-6 py-3 transition-colors"
                    style={{
                      border: "1px solid var(--border-strong, #e5e5e5)",
                      color: "var(--text)",
                    }}
                  >
                    Yana xabar yuborish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-muted, #888)" }}
                    >
                      Ism Familiya
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Masalan: Abdullayev Jasur"
                      className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                      style={{
                        backgroundColor: "var(--bg)",
                        border: errors.name ? "1px solid #E8491D" : "1px solid var(--border-strong, #e5e5e5)",
                        color: "var(--text)",
                        fontFamily: "inherit",
                      }}
                    />
                    {errors.name && <p className="text-xs mt-1.5" style={{ color: "#E8491D" }}>{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-muted, #888)" }}
                    >
                      Telefon raqam
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+998 90 000-00-00"
                      className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                      style={{
                        backgroundColor: "var(--bg)",
                        border: errors.phone ? "1px solid #E8491D" : "1px solid var(--border-strong, #e5e5e5)",
                        color: "var(--text)",
                        fontFamily: "inherit",
                      }}
                    />
                    {errors.phone && <p className="text-xs mt-1.5" style={{ color: "#E8491D" }}>{errors.phone}</p>}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-muted, #888)" }}
                    >
                      Xabar
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Savol, taklif yoki buyurtma haqida yozing..."
                      className="w-full px-4 py-3 text-sm font-light focus:outline-none resize-none"
                      style={{
                        backgroundColor: "var(--bg)",
                        border: errors.message ? "1px solid #E8491D" : "1px solid var(--border-strong, #e5e5e5)",
                        color: "var(--text)",
                        fontFamily: "inherit",
                      }}
                    />
                    {errors.message && <p className="text-xs mt-1.5" style={{ color: "#E8491D" }}>{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="hero-cta inline-flex items-center gap-2 px-8 py-4 text-sm font-medium transition-all hover:scale-[1.03] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Yuborilmoqda...
                      </>
                    ) : "Xabar yuborish"}
                  </button>
                </form>
              )}
            </Reveal>

            {/* O'ng — aloqa ma'lumotlari */}
            <Reveal
              variant="up"
              delay={120}
              className="lg:w-80 xl:w-96 flex-shrink-0 p-8 lg:p-12 flex flex-col gap-10"
              style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)" }}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted, #888)" }}>
                  Telefon
                </p>
                <a href="tel:+998901234567" className="text-lg font-medium transition-opacity hover:opacity-60" style={{ color: "var(--text)" }}>
                  +998 90 123-45-67
                </a>
                <p className="text-sm font-light mt-1" style={{ color: "var(--text-muted, #888)" }}>Du–Sha, 09:00–18:00</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted, #888)" }}>
                  Elektron pochta
                </p>
                <a href="mailto:info@ummed.uz" className="text-lg font-medium transition-opacity hover:opacity-60" style={{ color: "var(--text)" }}>
                  info@ummed.uz
                </a>
                <p className="text-sm font-light mt-1" style={{ color: "var(--text-muted, #888)" }}>24 soat ichida javob</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted, #888)" }}>
                  Manzil
                </p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>Toshkent, Chilonzor</p>
                <p className="text-sm font-light mt-1" style={{ color: "var(--text-muted, #888)" }}>Bunyodkor ko'chasi, 12</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted, #888)" }}>
                  Ijtimoiy tarmoqlar
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Telegram",  href: "https://t.me/ummed_tibbiy" },
                    { label: "Instagram", href: "https://instagram.com/ummed.tibbiy" },
                    { label: "YouTube",   href: "https://youtube.com/@ummed" },
                    { label: "Facebook",  href: "https://facebook.com/ummedtibbiy" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-light transition-opacity hover:opacity-50 group"
                      style={{ color: "var(--text)" }}
                    >
                      {s.label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <path d="M7 17L17 7M9 7h8v8"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Xarita */}
          <Reveal variant="up" delay={160}>
            <div
              className="w-full overflow-hidden"
              style={{
                height: "clamp(240px, 36vw, 460px)",
                border: "1px solid var(--border-strong, #e5e5e5)",
                borderTop: "none",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.8!2d69.2385!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMTguMyJF!5e0!3m2!1suz!2suz!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ummed ofisi"
              />
            </div>
          </Reveal>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
