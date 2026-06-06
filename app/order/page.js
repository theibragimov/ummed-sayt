"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

const TELEGRAM_BOT = "https://t.me/ummeduz_bot";
const TELEGRAM_MANAGER = "https://t.me/ummeduz";

export default function OrderPage() {
  const { lang } = useLang();
  const L = (uz, ru) => (lang === "ru" ? ru : uz);

  const [step, setStep] = useState("main");
  const [payType, setPayType] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", company: "", note: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = L("Ism familiya kiritilmadi", "Введите имя");
    if (!form.phone.trim()) e.phone = L("Telefon raqam kiritilmadi", "Введите телефон");
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const xabar = `🛒 Buyurtma (${payType})\n👤 ${form.name}\n📞 ${form.phone}${form.company ? `\n🏢 ${form.company}` : ""}${form.note ? `\n📝 ${form.note}` : ""}`;
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ism: form.name, telefon: form.phone, xabar }),
      });
      setStep("sent");
    } catch {
      setStep("sent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />

      <main style={{ backgroundColor: "var(--bg)" }}>

        {/* ─── HERO ─── */}
        <section style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border-strong, #e5e5e5)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-20">
            <Reveal variant="up">
              <span className="section-label">
                {L("Hamkorlar uchun", "Для партнёров")}
              </span>
              <h1
                className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-[52px] font-medium leading-[1.1] tracking-tight"
                style={{ color: "var(--text)", maxWidth: 640 }}
              >
                {L("Buyurtma rasmiylashtirish", "Оформление заказа")}
              </h1>
              <p
                className="mt-4 text-sm sm:text-base font-light leading-relaxed"
                style={{ color: "var(--text-muted, #888)", maxWidth: 560 }}
              >
                {L(
                  "Biz sizning vaqt va qulayligingizni qadrlaymiz — buyurtmani tez va oson rasmiylashtirish uchun Telegram botimizga o'ting.",
                  "Мы ценим ваше время — перейдите в наш Telegram бот для быстрого и удобного оформления заказа.",
                )}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3DB851" }} />
                <span className="text-sm font-medium" style={{ color: "#3DB851" }}>
                  {L("2 mln so'mdan yuqori buyurtmalarga bepul yetkazib berish", "Бесплатная доставка при заказе от 2 млн сум")}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── ASOSIY KONTENT ─── */}
        <section style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-20">

            {/* ── Asosiy ekran ── */}
            {step === "main" && (
              <div className="flex flex-col items-center gap-12">

                {/* Telegram Bot — asosiy CTA */}
                <Reveal variant="up" className="w-full flex flex-col items-center text-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted, #888)" }}>
                      {L("Tezkor buyurtma", "Быстрый заказ")}
                    </span>
                    <p className="text-base font-light max-w-md" style={{ color: "var(--text-muted, #888)" }}>
                      {L(
                        "Telegram botimiz orqali bir necha daqiqada buyurtma bering",
                        "Оформите заказ через наш Telegram бот за несколько минут",
                      )}
                    </p>
                  </div>
                  <a
                    href={TELEGRAM_BOT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-[15px] font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: "#E8491D",
                      color: "#fff",
                      boxShadow: "0 4px 24px rgba(232,73,29,0.35)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#c73a16";
                      e.currentTarget.style.boxShadow = "0 6px 32px rgba(232,73,29,0.5)";
                      e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "#E8491D";
                      e.currentTarget.style.boxShadow = "0 4px 24px rgba(232,73,29,0.35)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                    </svg>
                    {L("Telegram botga o'tish", "Перейти в Telegram бот")}
                  </a>
                </Reveal>

                {/* Divider */}
                <div className="w-full flex items-center gap-4 max-w-2xl">
                  <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-strong, #e5e5e5)" }} />
                  <span className="text-xs font-light px-2" style={{ color: "var(--text-muted, #aaa)" }}>
                    {L("yoki to'lov turini tanlang", "или выберите тип оплаты")}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-strong, #e5e5e5)" }} />
                </div>

                {/* To'lov tugmalari */}
                <Reveal variant="up" delay={100} className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Bo'lib to'lash */}
                  <button
                    onClick={() => { setPayType(L("Bo'lib to'lash (НДС siz)", "Рассрочка (без НДС)")); setStep("form"); }}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 w-full sm:w-auto"
                    style={{
                      backgroundColor: "#E8491D",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: "0 4px 20px rgba(232,73,29,0.3)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#c73a16";
                      e.currentTarget.style.boxShadow = "0 6px 28px rgba(232,73,29,0.5)";
                      e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "#E8491D";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,73,29,0.3)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    {L("Bo'lib to'lash", "Рассрочка")}
                  </button>

                  {/* 100% to'lov */}
                  <button
                    onClick={() => { setPayType(L("100% to'lov (НДС siz)", "100% оплата (без НДС)")); setStep("form"); }}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 w-full sm:w-auto"
                    style={{
                      backgroundColor: "#E8491D",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: "0 4px 20px rgba(232,73,29,0.3)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#c73a16";
                      e.currentTarget.style.boxShadow = "0 6px 28px rgba(232,73,29,0.5)";
                      e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "#E8491D";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,73,29,0.3)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    {L("100% to'lov", "100% оплата")}
                  </button>
                </Reveal>

                {/* Info kartalar */}
                <Reveal variant="up" delay={150} className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {[
                    { icon: "🕐", title: L("Ish vaqti", "Время работы"), desc: L("Du–Sha, 09:00–18:00", "Пн–Сб, 09:00–18:00") },
                    { icon: "📞", title: L("Telefon", "Телефон"), desc: "+998 77 550-40-40", href: "tel:+998775504040" },
                    { icon: "🚚", title: L("Yetkazish", "Доставка"), desc: L("2 mln+ — bepul", "От 2 млн — бесплатно") },
                    { icon: "✅", title: L("Kafolat", "Гарантия"), desc: L("Sertifikatlangan", "Сертифицировано") },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl gap-2"
                      style={{ border: "1px solid var(--border-strong, #e5e5e5)", backgroundColor: "var(--bg)" }}
                    >
                      <span className="text-2xl">{card.icon}</span>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted, #888)" }}>
                        {card.title}
                      </p>
                      {card.href ? (
                        <a href={card.href} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: "var(--text)" }}>
                          {card.desc}
                        </a>
                      ) : (
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{card.desc}</p>
                      )}
                    </div>
                  ))}
                </Reveal>
              </div>
            )}

            {/* ── Forma ── */}
            {step === "form" && (
              <div className="flex flex-col lg:flex-row gap-0"
                style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}>

                {/* Chap — Forma */}
                <Reveal variant="up" className="flex-1 p-6 sm:p-10 lg:p-12">
                  <button
                    onClick={() => setStep("main")}
                    className="flex items-center gap-2 text-sm font-light mb-8 transition-opacity hover:opacity-60"
                    style={{ background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted, #888)", fontFamily: "inherit", padding: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    {L("Orqaga", "Назад")}
                  </button>

                  {/* Tanlangan tur badge */}
                  <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5"
                    style={{ border: "1px solid rgba(232,73,29,0.3)", backgroundColor: "rgba(232,73,29,0.06)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E8491D" }} />
                    <span className="text-xs font-semibold" style={{ color: "#E8491D" }}>{payType}</span>
                  </div>

                  <p className="text-xs font-medium uppercase tracking-widest mb-8"
                    style={{ color: "var(--text-muted, #888)" }}>
                    {L("Ma'lumotlaringizni kiriting", "Введите ваши данные")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted, #888)" }}>
                        {L("Ism familiya", "Имя и фамилия")} *
                      </label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        placeholder={L("Masalan: Abdullayev Jasur", "Например: Иванов Иван")}
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                        style={{
                          backgroundColor: "var(--bg)",
                          border: errors.name ? "1px solid #E8491D" : "1px solid var(--border-strong, #e5e5e5)",
                          color: "var(--text)", fontFamily: "inherit",
                        }}
                      />
                      {errors.name && <p className="text-xs mt-1.5" style={{ color: "#E8491D" }}>{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted, #888)" }}>
                        {L("Telefon raqam", "Номер телефона")} *
                      </label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        type="tel" placeholder="+998 90 000-00-00"
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                        style={{
                          backgroundColor: "var(--bg)",
                          border: errors.phone ? "1px solid #E8491D" : "1px solid var(--border-strong, #e5e5e5)",
                          color: "var(--text)", fontFamily: "inherit",
                        }}
                      />
                      {errors.phone && <p className="text-xs mt-1.5" style={{ color: "#E8491D" }}>{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted, #888)" }}>
                        {L("Kompaniya / Dorixona nomi", "Компания / Аптека")}{" "}
                        <span style={{ color: "var(--text-muted, #aaa)", textTransform: "none", fontWeight: 400 }}>
                          ({L("ixtiyoriy", "необязательно")})
                        </span>
                      </label>
                      <input
                        name="company" value={form.company} onChange={handleChange}
                        placeholder={L("Masalan: Salomatlik dorixonasi", "Например: Аптека Здоровье")}
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none"
                        style={{
                          backgroundColor: "var(--bg)",
                          border: "1px solid var(--border-strong, #e5e5e5)",
                          color: "var(--text)", fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted, #888)" }}>
                        {L("Izoh", "Комментарий")}{" "}
                        <span style={{ color: "var(--text-muted, #aaa)", textTransform: "none", fontWeight: 400 }}>
                          ({L("ixtiyoriy", "необязательно")})
                        </span>
                      </label>
                      <textarea
                        name="note" value={form.note} onChange={handleChange}
                        rows={4}
                        placeholder={L("Buyurtma haqida qo'shimcha ma'lumot...", "Дополнительная информация о заказе...")}
                        className="w-full px-4 py-3 text-sm font-light focus:outline-none resize-none"
                        style={{
                          backgroundColor: "var(--bg)",
                          border: "1px solid var(--border-strong, #e5e5e5)",
                          color: "var(--text)", fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-60"
                      style={{ backgroundColor: "#E8491D", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(232,73,29,0.3)" }}
                      onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = "#c73a16"; e.currentTarget.style.transform = "scale(1.04)"; }}}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#E8491D"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                            <path fill="rgba(255,255,255,0.9)" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          {L("Yuborilmoqda...", "Отправка...")}
                        </>
                      ) : (
                        <>
                          {L("Buyurtmani yuborish", "Отправить заказ")}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-xs font-light" style={{ color: "var(--text-muted, #aaa)" }}>
                      {L("Ma'lumotlaringiz xavfsiz saqlanadi", "Ваши данные в безопасности")}
                    </p>
                  </form>
                </Reveal>

                {/* O'ng — Nima bo'ladi keyin */}
                <Reveal
                  variant="up"
                  delay={100}
                  className="lg:w-80 xl:w-96 flex-shrink-0 p-6 sm:p-10 lg:p-12 flex flex-col gap-8"
                  style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)" }}
                >
                  <p className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "var(--text-muted, #888)" }}>
                    {L("Keyingi qadamlar", "Следующие шаги")}
                  </p>

                  {[
                    {
                      num: "01",
                      title: L("Ariza yuborish", "Отправка заявки"),
                      desc: L("Formani to'ldiring va yuboring", "Заполните и отправьте форму"),
                    },
                    {
                      num: "02",
                      title: L("Menejer bog'lanadi", "Звонок менеджера"),
                      desc: L("30 daqiqa ichida telefon qilamiz", "Позвоним в течение 30 минут"),
                    },
                    {
                      num: "03",
                      title: L("Narx va shartlar", "Цена и условия"),
                      desc: L("To'lov turi va narxni muhokama qilamiz", "Обсудим цену и условия оплаты"),
                    },
                    {
                      num: "04",
                      title: L("Yetkazib berish", "Доставка"),
                      desc: L("1–3 ish kuni ichida yetkazib beramiz", "Доставим в течение 1–3 рабочих дней"),
                    },
                  ].map((s, i) => (
                    <div key={s.num} className="flex gap-4">
                      <div className="flex-shrink-0 text-xs font-bold tracking-wider mt-0.5"
                        style={{ color: "#E8491D", minWidth: 24 }}>
                        {s.num}
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
                          {s.title}
                        </div>
                        <div className="text-xs font-light leading-relaxed" style={{ color: "var(--text-muted, #888)" }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </Reveal>
              </div>
            )}

            {/* ── Muvaffaqiyat ── */}
            {step === "sent" && (
              <div style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}>
                <Reveal variant="up" className="p-10 sm:p-16 lg:p-20 flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 flex items-center justify-center mb-8"
                    style={{ backgroundColor: "#3DB851" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-4"
                    style={{ color: "var(--text)" }}>
                    {L("Buyurtma qabul qilindi!", "Заказ принят!")}
                  </h2>
                  <p className="text-base font-light leading-relaxed mb-2 max-w-md"
                    style={{ color: "var(--text-muted, #888)" }}>
                    {L(
                      "Menejerimiz siz bilan 30 daqiqa ichida bog'lanadi.",
                      "Наш менеджер свяжется с вами в течение 30 минут.",
                    )}
                  </p>
                  <p className="text-sm font-light mb-10 max-w-sm"
                    style={{ color: "var(--text-muted, #aaa)" }}>
                    {L("Tezroq javob olish uchun Telegram orqali murojaat qiling.", "Для более быстрого ответа напишите в Telegram.")}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={TELEGRAM_MANAGER}
                      target="_blank" rel="noopener noreferrer"
                      className="hero-cta inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                      </svg>
                      {L("Telegram menejer", "Telegram менеджер")}
                    </a>
                    <button
                      onClick={() => { setStep("main"); setForm({ name: "", phone: "", company: "", note: "" }); setPayType(""); }}
                      className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium transition-opacity hover:opacity-60"
                      style={{
                        border: "1px solid var(--border-strong, #e5e5e5)",
                        color: "var(--text)", background: "none",
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {L("Yangi buyurtma", "Новый заказ")}
                    </button>
                  </div>
                </Reveal>
              </div>
            )}

          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
