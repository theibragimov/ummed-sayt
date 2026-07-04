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
  const L = (uz, ru, en) => (lang === "ru" ? ru : lang === "en" && en ? en : uz);

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
    if (!form.name.trim()) e.name = L("Ism familiya kiritilmadi", "Введите имя", "Name is required");
    if (!form.phone.trim()) e.phone = L("Telefon raqam kiritilmadi", "Введите телефон", "Phone is required");
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
        <section style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-12 pb-6 sm:pt-16 sm:pb-8 flex flex-col items-center text-center">
            <Reveal variant="up" className="flex flex-col items-center">
              <span className="section-label">
                {L("Hamkorlar uchun", "Для партнёров", "For Partners")}
              </span>
              <h1
                className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-[52px] font-medium leading-[1.1] tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {L("Buyurtma rasmiylashtirish", "Оформление заказа", "Place an Order")}
              </h1>
              <p
                className="mt-4 text-sm sm:text-base font-light leading-relaxed max-w-xl"
                style={{ color: "var(--text-muted, #888)" }}
              >
                {L(
                  "Biz sizning vaqt va qulayligingizni qadrlaymiz — buyurtmani tez va oson rasmiylashtirish uchun Telegram botimizga o'ting.",
                  "Мы ценим ваше время — перейдите в наш Telegram бот для быстрого и удобного оформления заказа.",
                  "We value your time — go to our Telegram bot to place an order quickly and easily.",
                )}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3DB851" }} />
                <span className="text-sm font-medium" style={{ color: "#3DB851" }}>
                  {L("2 mln so'mdan yuqori buyurtmalarga bepul yetkazib berish", "Бесплатная доставка при заказе от 2 млн сум", "Free delivery for orders over 2M UZS")}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── ASOSIY KONTENT ─── */}
        <section style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-10 pt-2 pb-10 sm:pt-4 sm:pb-14">

            {/* ── Asosiy ekran ── */}
            {step === "main" && (
              <div className="flex flex-col items-center gap-5">

                {/* Telegram Bot — asosiy CTA */}
                <Reveal variant="up" className="w-full flex flex-col items-center text-center gap-4">
                  <a
                    href={TELEGRAM_BOT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 text-[16px] px-8 py-4 sm:text-[21px] sm:px-[72px] sm:py-6"
                    style={{
                      backgroundColor: "#E8491D",
                      color: "#fff",
                      boxShadow: "0 4px 24px rgba(232,73,29,0.35)",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#c73a16";
                      e.currentTarget.style.boxShadow = "0 8px 36px rgba(232,73,29,0.55)";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "#E8491D";
                      e.currentTarget.style.boxShadow = "0 4px 24px rgba(232,73,29,0.35)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                    </svg>
                    {L("Telegram botga o'tish", "Перейти в Telegram бот", "Go to Telegram Bot")}
                  </a>
                </Reveal>


                {/* Info kartalar — vektor ikonkali */}
                <Reveal variant="up" delay={150} className="w-full grid grid-cols-3 gap-3 mt-2">
                  {[
                    {
                      icon: (
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#E8491D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                      ),
                      title: L("Ish vaqti", "Время работы", "Working Hours"),
                      desc: L("Du–Sha, 09:00–18:00", "Пн–Сб, 09:00–18:00", "Mon–Sat, 09:00–18:00"),
                    },
                    {
                      icon: (
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#E8491D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                      ),
                      title: L("Telefon", "Телефон", "Phone"),
                      desc: "+998 77 550-40-40",
                      href: "tel:+998775504040",
                    },
                    {
                      icon: (
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#E8491D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                      ),
                      title: L("Yetkazish", "Доставка", "Delivery"),
                      desc: L("2 mln+ — bepul", "От 2 млн — бесплатно", "2M+ UZS — free"),
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="flex flex-col items-center text-center p-3 sm:p-7 rounded-xl sm:rounded-2xl gap-2 sm:gap-3"
                      style={{ border: "1px solid var(--border-strong, #e5e5e5)", backgroundColor: "var(--bg)" }}
                    >
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(232,73,29,0.08)" }}>
                        {card.icon}
                      </div>
                      <p className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted, #888)" }}>
                        {card.title}
                      </p>
                      {card.href ? (
                        <a href={card.href} className="text-[11px] sm:text-sm font-medium transition-opacity hover:opacity-60 leading-tight" style={{ color: "var(--text)" }}>
                          {card.desc}
                        </a>
                      ) : (
                        <p className="text-[11px] sm:text-sm font-medium leading-tight" style={{ color: "var(--text)" }}>{card.desc}</p>
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
                    {L("Orqaga", "Назад", "Back")}
                  </button>

                  {/* Tanlangan tur badge */}
                  <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5"
                    style={{ border: "1px solid rgba(232,73,29,0.3)", backgroundColor: "rgba(232,73,29,0.06)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E8491D" }} />
                    <span className="text-xs font-semibold" style={{ color: "#E8491D" }}>{payType}</span>
                  </div>

                  <p className="text-xs font-medium uppercase tracking-widest mb-8"
                    style={{ color: "var(--text-muted, #888)" }}>
                    {L("Ma'lumotlaringizni kiriting", "Введите ваши данные", "Enter Your Details")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted, #888)" }}>
                        {L("Ism familiya", "Имя и фамилия", "Full Name")} *
                      </label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        placeholder={L("Masalan: Abdullayev Jasur", "Например: Иванов Иван", "E.g.: John Smith")}
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
                        {L("Telefon raqam", "Номер телефона", "Phone Number")} *
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
                        {L("Kompaniya / Dorixona nomi", "Компания / Аптека", "Company / Pharmacy")}{" "}
                        <span style={{ color: "var(--text-muted, #aaa)", textTransform: "none", fontWeight: 400 }}>
                          ({L("ixtiyoriy", "необязательно", "optional")})
                        </span>
                      </label>
                      <input
                        name="company" value={form.company} onChange={handleChange}
                        placeholder={L("Masalan: Salomatlik dorixonasi", "Например: Аптека Здоровье", "E.g.: Health Pharmacy")}
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
                        {L("Izoh", "Комментарий", "Comment")}{" "}
                        <span style={{ color: "var(--text-muted, #aaa)", textTransform: "none", fontWeight: 400 }}>
                          ({L("ixtiyoriy", "необязательно", "optional")})
                        </span>
                      </label>
                      <textarea
                        name="note" value={form.note} onChange={handleChange}
                        rows={4}
                        placeholder={L("Buyurtma haqida qo'shimcha ma'lumot...", "Дополнительная информация о заказе...", "Additional information about the order...")}
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
                          {L("Yuborilmoqda...", "Отправка...", "Sending...")}
                        </>
                      ) : (
                        <>
                          {L("Buyurtmani yuborish", "Отправить заказ", "Submit Order")}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-xs font-light" style={{ color: "var(--text-muted, #aaa)" }}>
                      {L("Ma'lumotlaringiz xavfsiz saqlanadi", "Ваши данные в безопасности", "Your data is kept secure")}
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
                    {L("Keyingi qadamlar", "Следующие шаги", "Next Steps")}
                  </p>

                  {[
                    {
                      num: "01",
                      title: L("Ariza yuborish", "Отправка заявки", "Submit Request"),
                      desc: L("Formani to'ldiring va yuboring", "Заполните и отправьте форму", "Fill in and submit the form"),
                    },
                    {
                      num: "02",
                      title: L("Menejer bog'lanadi", "Звонок менеджера", "Manager Calls You"),
                      desc: L("30 daqiqa ichida telefon qilamiz", "Позвоним в течение 30 минут", "We'll call within 30 minutes"),
                    },
                    {
                      num: "03",
                      title: L("Narx va shartlar", "Цена и условия", "Price & Terms"),
                      desc: L("To'lov turi va narxni muhokama qilamiz", "Обсудим цену и условия оплаты", "We'll discuss pricing and payment terms"),
                    },
                    {
                      num: "04",
                      title: L("Yetkazib berish", "Доставка", "Delivery"),
                      desc: L("1–3 ish kuni ichida yetkazib beramiz", "Доставим в течение 1–3 рабочих дней", "Delivered within 1–3 business days"),
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
                    {L("Buyurtma qabul qilindi!", "Заказ принят!", "Order Received!")}
                  </h2>
                  <p className="text-base font-light leading-relaxed mb-2 max-w-md"
                    style={{ color: "var(--text-muted, #888)" }}>
                    {L(
                      "Menejerimiz siz bilan 30 daqiqa ichida bog'lanadi.",
                      "Наш менеджер свяжется с вами в течение 30 минут.",
                      "Our manager will contact you within 30 minutes.",
                    )}
                  </p>
                  <p className="text-sm font-light mb-10 max-w-sm"
                    style={{ color: "var(--text-muted, #aaa)" }}>
                    {L("Tezroq javob olish uchun Telegram orqali murojaat qiling.", "Для более быстрого ответа напишите в Telegram.", "For a faster response, reach us on Telegram.")}
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
                      {L("Telegram menejer", "Telegram менеджер", "Telegram Manager")}
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
                      {L("Yangi buyurtma", "Новый заказ", "New Order")}
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
