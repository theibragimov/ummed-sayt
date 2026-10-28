"use client";

import { useState } from "react";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { TXT, FAQ, CERTS } from "@/components/easydrip-content";

// Rasmlar: faylni public/images/easydrip/ ga qo'ying va yo'lini shu yerga yozing.
// null bo'lsa — sahifada "Rasm uchun joy" ko'rinadi.
const IMAGES = {
  hero: null,      // masalan: "/images/easydrip/hero.png" (mahsulot qutisi + igna)
  product: null,   // EasyDrip Plus qadog'i va igna
  solution: null,  // igna yaqindan (macro), Hextra Tech asosi
  pharmacy: null,  // dorixona javonida mahsulot
};

// Haqiqiy mijoz fikrlari: { ism: "...", rol: "...", matn: { uz, ru, en } }
// Bo'sh bo'lsa — 3 ta bo'sh joy ko'rinadi.
const REVIEWS = [];

const ORANGE = "#E8491D";
const GREEN = "#3DB851";
const FRAME = "1px solid var(--border-frame, #ccc)";

// Ramka: tashqi chegara + ichki kataklar orasida 1px chiziq (gap-px + fon rangi)
function Frame({ children, className = "", grid = "" }) {
  return (
    <div className={`rounded-3xl overflow-hidden ${className}`} style={{ border: FRAME }}>
      {grid ? (
        <div className={`grid gap-px ${grid}`} style={{ backgroundColor: "var(--border-frame, #ccc)" }}>{children}</div>
      ) : children}
    </div>
  );
}

function Cell({ children, className = "" }) {
  return <div className={`p-6 sm:p-8 ${className}`} style={{ backgroundColor: "var(--bg)" }}>{children}</div>;
}

// stretch: katta ekranda yonidagi matn balandligiga moslashadi (nisbat faqat mobilda)
function ImageSlot({ src, alt, label, ratio = "4 / 3", stretch = false, className = "" }) {
  return (
    <div className={`relative w-full overflow-hidden aspect-[var(--r)] ${stretch ? "lg:aspect-auto lg:h-full lg:min-h-[320px]" : ""} ${className}`}
      style={{ "--r": ratio, backgroundColor: "var(--bg-card-outer, #f6f5f3)" }}>
      {src ? (
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4"
          style={{ color: "var(--text-muted, #888)" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" />
          </svg>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em]">{label}</span>
          <span className="text-[11px] font-light">{alt}</span>
        </div>
      )}
    </div>
  );
}

// Matndagi **so'z** qismlarini qalin qilib chiqaradi
const BOLD = { color: "var(--text)", fontWeight: 600 };
function rich(str, style = BOLD) {
  return str.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} style={style}>{part}</strong> : part));
}

function Heading({ label, title, as: Tag = "h2", className = "" }) {
  return (
    <Reveal variant="up" className={`mb-6 sm:mb-10 ${className}`}>
      {label && <span className="section-label">{label}</span>}
      <Tag className="text-xl sm:text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mt-2 sm:mt-5 max-w-[900px]"
        style={{ color: "var(--text)" }}>
        {title}
      </Tag>
    </Reveal>
  );
}

export default function EasyDripLanding() {
  const { lang } = useLang();
  const t = TXT[lang] || TXT.uz;
  const faq = FAQ[lang] || FAQ.uz;
  const [open, setOpen] = useState(0);
  const [form, setForm] = useState({ ism: "", telefon: "", xabar: "" });
  const [status, setStatus] = useState("idle");

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahsulot: "EasyDrip Plus (landing /easydripplus)" }),
      });
      if (!r.ok) throw new Error();
      setStatus("ok");
      setForm({ ism: "", telefon: "", xabar: "" });
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { event_label: "easydripplus" });
      }
    } catch {
      setStatus("err");
    }
  }

  const muted = { color: "var(--text-muted, #888)" };
  const text = { color: "var(--text)" };
  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm font-light outline-none bg-transparent transition-colors focus:border-[#E8491D]";
  const inputStyle = { border: FRAME, color: "var(--text)" };

  return (
    <>
      <SiteHeader />
      <main style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-16 sm:pb-24 space-y-16 sm:space-y-28">

          {/* ── Hero: tepada keng sarlavha, pastda matn + rasm, eng pastda chiplar ── */}
          <Frame>
            <div className="p-6 sm:p-10 lg:p-14">
              <span className="section-label">{t.hero.kicker}</span>
              <h1 className="mt-6 sm:mt-10 tracking-tight" style={text}>
                <span className="block text-[44px] sm:text-7xl lg:text-[112px] font-bold leading-[0.95]" style={{ color: ORANGE }}>{t.hero.brand}</span>
                <span className="block text-[24px] sm:text-4xl lg:text-[48px] font-semibold leading-[1.12] mt-3 sm:mt-5 max-w-[1050px]">{t.hero.title}</span>
              </h1>
            </div>
            <div className="grid lg:grid-cols-2" style={{ borderTop: FRAME }}>
              <div className="p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
                <p className="text-xl sm:text-2xl lg:text-[30px] font-light leading-snug tracking-tight" style={text}>
                  {rich(t.hero.sub, { color: ORANGE, fontWeight: 700 })}
                </p>
                <p className="mt-5 sm:mt-6 text-base sm:text-lg font-light leading-relaxed max-w-[560px]" style={muted}>{rich(t.hero.lead)}</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="#buyurtma" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.03]" style={{ background: ORANGE }}>
                    {t.hero.cta1} →
                  </a>
                  <a href="https://t.me/ummeduz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium transition-opacity hover:opacity-70" style={{ border: "1px solid var(--border-strong, #e5e5e5)", ...text }}>
                    {t.hero.cta2}
                  </a>
                </div>
              </div>
              <div className="lg:border-l" style={{ borderColor: "var(--border-frame, #ccc)" }}>
                <ImageSlot src={IMAGES.hero} alt="EasyDrip Plus pen needles" label={t.imgSlot} ratio="4 / 3" stretch />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)", borderTop: FRAME }}>
              {t.hero.chips.map((c) => (
                <div key={c} className="px-6 py-4 sm:py-5 text-sm font-medium text-center" style={{ backgroundColor: "var(--bg)", ...text }}>{c}</div>
              ))}
            </div>
          </Frame>

          {/* ── 01 Mahsulot: rasm + matn + 3 fakt ── */}
          <section id="mahsulot" className="scroll-mt-24">
            <Heading label={t.about.label} title={t.about.title} />
            <Frame grid="lg:grid-cols-[1fr_1.3fr]">
              <div style={{ backgroundColor: "var(--bg)" }}>
                <ImageSlot src={IMAGES.product} alt="EasyDrip Plus pen needles box" label={t.imgSlot} ratio="4 / 3" stretch />
              </div>
              <div className="flex flex-col gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                <Cell className="space-y-4 flex-1">
                  {t.about.body.map((p) => (
                    <p key={p} className="text-base sm:text-lg font-light leading-relaxed" style={muted}>{rich(p)}</p>
                  ))}
                </Cell>
                <div className="grid sm:grid-cols-3 gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                  {t.about.facts.map(([k, v]) => (
                    <Cell key={k} className="!py-5">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={muted}>{k}</p>
                      <p className="text-sm font-medium mt-2 leading-snug" style={text}>{v}</p>
                    </Cell>
                  ))}
                </div>
              </div>
            </Frame>
          </section>

          {/* ── 02 Muammo va yechim: 3 ustunli jadval-ramka ── */}
          <section id="muammo" className="scroll-mt-24">
            <Heading label={t.problem.label} title={t.problem.title} />
            <Frame grid="grid-cols-1">
              <div className="hidden md:grid grid-cols-[0.8fr_1fr_1fr] gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                <div style={{ backgroundColor: "var(--bg)" }} />
                <div className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ backgroundColor: "var(--bg)", color: ORANGE }}>{t.problem.colProblem}</div>
                <div className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ backgroundColor: "var(--bg)", color: GREEN }}>{t.problem.colSolution}</div>
              </div>
              {t.problem.items.map(([title, prob, sol], i) => (
                <div key={title} className="grid md:grid-cols-[0.8fr_1fr_1fr] gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                  <Cell>
                    <span className="text-xs font-medium tabular-nums" style={{ color: ORANGE }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg sm:text-xl font-medium tracking-tight mt-2" style={text}>{title}</h3>
                  </Cell>
                  <Cell>
                    <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: ORANGE }}>{t.problem.colProblem}</p>
                    <p className="text-sm font-light leading-relaxed" style={muted}>{rich(prob)}</p>
                  </Cell>
                  <Cell>
                    <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: GREEN }}>{t.problem.colSolution}</p>
                    <p className="text-sm font-light leading-relaxed" style={text}>{rich(sol)}</p>
                  </Cell>
                </div>
              ))}
            </Frame>
          </section>

          {/* ── 03 Xususiyatlar: 2×2 kataklar + rasm ── */}
          <section id="yechim" className="scroll-mt-24">
            <Heading label={t.features.label} title={t.features.title} />
            <Frame grid="lg:grid-cols-[2fr_1fr]">
              <div className="grid sm:grid-cols-2 gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                {t.features.items.map(([title, body], i) => (
                  <Cell key={title}>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                      style={i === 0 ? { background: ORANGE, color: "#fff" } : { border: FRAME, ...text }}>
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-medium mt-4 mb-2" style={text}>{title}</h3>
                    <p className="text-sm font-light leading-relaxed" style={muted}>{rich(body)}</p>
                  </Cell>
                ))}
              </div>
              <div style={{ backgroundColor: "var(--bg)" }}>
                <ImageSlot src={IMAGES.solution} alt="Hextra Tech needle hub close-up" label={t.imgSlot} ratio="4 / 3" stretch />
              </div>
            </Frame>
          </section>

          {/* ── Nega EasyDrip: 3 ta sotuv argumenti ── */}
          <section>
            <Heading title={t.args.title} />
            <Frame grid="md:grid-cols-3">
              {t.args.items.map(([title, body, slogan], i) => (
                <Cell key={title} className="flex flex-col">
                  <span className="text-5xl font-medium tracking-tight" style={{ color: i === 0 ? ORANGE : "var(--border-strong, #e5e5e5)" }}>{i + 1}</span>
                  <h3 className="text-xl font-medium tracking-tight mt-4 mb-2" style={text}>{title}</h3>
                  <p className="text-sm font-light leading-relaxed flex-1" style={muted}>{rich(body)}</p>
                  <p className="text-sm font-medium mt-6 pt-4" style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)", color: ORANGE }}>“{slogan}”</p>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── 04 O'lchamlar: 3 ustunli spetsifikatsiya ramkasi ── */}
          <section id="olchamlar" className="scroll-mt-24">
            <Heading label={t.sizes.label} title={t.sizes.title} />
            <Frame grid="md:grid-cols-3">
              {t.sizes.rows.map(([g, len, who, sku], i) => (
                <Cell key={sku} className="relative">
                  {i === 0 && (
                    <span className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white" style={{ backgroundColor: ORANGE }}>TOP</span>
                  )}
                  <p className="text-sm font-medium" style={{ color: ORANGE }}>{g}</p>
                  <p className="text-5xl sm:text-6xl font-medium tracking-tight mt-2" style={text}>{len}</p>
                  <p className="text-sm font-light leading-relaxed mt-5 min-h-[40px]" style={muted}>{rich(who)}</p>
                  <p className="text-xs font-light mt-5 pt-4" style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)", ...muted }}>
                    {t.sizes.sku}: <span className="font-medium" style={text}>{sku}</span>
                  </p>
                </Cell>
              ))}
            </Frame>
            <p className="mt-4 text-sm font-light" style={muted}>{t.sizes.note} {t.sizes.pack}</p>
          </section>

          {/* ── 05 Bilish muhim: igna nimani qilmaydi ── */}
          <section>
            <Heading label={t.honest.label} title={t.honest.title} />
            <Frame grid="lg:grid-cols-[1fr_2fr]">
              <Cell className="flex flex-col justify-between gap-6">
                <p className="text-base font-light leading-relaxed" style={text}>{t.honest.lead}</p>
                <p className="text-xs font-light leading-relaxed" style={muted}>{t.honest.note}</p>
              </Cell>
              <div className="flex flex-col gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                {t.honest.items.map(([title, body]) => (
                  <Cell key={title} className="!py-5 grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-1 sm:gap-6 items-baseline">
                    <h3 className="text-base font-medium flex items-baseline gap-3" style={text}>
                      <span className="text-sm flex-shrink-0" style={{ color: ORANGE }}>✕</span>{title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed pl-6 sm:pl-0" style={muted}>{rich(body)}</p>
                  </Cell>
                ))}
              </div>
            </Frame>
          </section>

          {/* ── Kim uchun ── */}
          <section>
            <Heading title={t.audience.title} />
            <Frame grid="lg:grid-cols-[1fr_1.4fr]">
              <div style={{ backgroundColor: "var(--bg)" }}>
                <ImageSlot src={IMAGES.pharmacy} alt="EasyDrip Plus in pharmacy" label={t.imgSlot} ratio="4 / 3" stretch />
              </div>
              <div className="flex flex-col gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                {t.audience.items.map(([title, body]) => (
                  <Cell key={title} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-6">
                    <h3 className="text-lg font-medium" style={text}>{title}</h3>
                    <p className="text-sm font-light leading-relaxed" style={muted}>{rich(body)}</p>
                  </Cell>
                ))}
              </div>
            </Frame>
          </section>

          {/* ── 04 Sertifikatlar ── */}
          <section>
            <Heading label={t.certs.label} title={t.certs.title} />
            <Frame grid="lg:grid-cols-[1fr_2fr]">
              <Cell className="flex flex-col justify-between gap-6">
                <p className="text-sm font-light leading-relaxed" style={muted}>{t.certs.lead}</p>
                <Image src="/partners/sandstone.png" alt="Sandstone Medical" width={160} height={60} className="object-contain h-12 w-auto" style={{ width: "auto" }} />
              </Cell>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px" style={{ backgroundColor: "var(--border-frame, #ccc)" }}>
                {CERTS.map(([name, sub]) => (
                  <Cell key={name}>
                    <p className="text-xl sm:text-2xl font-medium tracking-tight" style={text}>{name}</p>
                    <p className="text-xs font-light mt-1" style={muted}>{sub}</p>
                  </Cell>
                ))}
              </div>
            </Frame>
          </section>

          {/* ── 05 Fikrlar ── */}
          <section>
            <Heading label={t.reviews.label} title={t.reviews.title} />
            <Frame grid="md:grid-cols-3">
              {(REVIEWS.length ? REVIEWS : [null, null, null]).map((r, i) => (
                <Cell key={i} className="flex flex-col min-h-[230px]">
                  <span className="text-4xl font-medium leading-none" style={{ color: ORANGE }}>“</span>
                  <blockquote className="text-base font-light leading-relaxed mt-3 flex-1" style={r ? text : muted}>
                    {r ? (r.matn[lang] || r.matn.uz) : t.reviews.placeholder}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--bg-card-outer, #f6f5f3)", border: FRAME }} />
                    {r && (
                      <span>
                        <span className="block text-sm font-medium" style={text}>{r.ism}</span>
                        <span className="block text-xs font-light" style={muted}>{r.rol}</span>
                      </span>
                    )}
                  </figcaption>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── Qo'llash: 4 qadam ── */}
          <section>
            <Heading title={t.steps.title} />
            <Frame grid="sm:grid-cols-2 lg:grid-cols-4">
              {t.steps.items.map(([title, body], i) => (
                <Cell key={title}>
                  <span className="text-5xl font-medium tracking-tight" style={{ color: i === 3 ? GREEN : "var(--border-strong, #e5e5e5)" }}>{i + 1}</span>
                  <h3 className="text-lg font-medium mt-4 mb-2" style={text}>{title}</h3>
                  <p className="text-sm font-light leading-relaxed" style={muted}>{rich(body)}</p>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── 06 FAQ ── */}
          <section id="savollar" className="scroll-mt-24 grid lg:grid-cols-[1fr_2fr] gap-6 lg:gap-12">
            <Heading label={t.faq.label} title={t.faq.title} />
            <Frame grid="grid-cols-1">
              {faq.map(([q, a], i) => (
                <div key={q} style={{ backgroundColor: "var(--bg)" }}>
                  <button type="button" onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-6 px-6 sm:px-8 py-5 text-left">
                    <span className="text-base font-medium" style={text}>{q}</span>
                    <span className="text-xl flex-shrink-0 transition-transform" style={{ color: ORANGE, transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {open === i && <p className="px-6 sm:px-8 pb-6 -mt-1 text-sm font-light leading-relaxed" style={muted}>{rich(a)}</p>}
                </div>
              ))}
            </Frame>
          </section>

          {/* ── Buyurtma: Aloqa sahifasidagi kabi ramka ── */}
          <section id="buyurtma" className="scroll-mt-24">
            <Heading label={t.order.label} title={t.order.title} />
            <Frame>
              <div className="flex flex-col lg:flex-row">
                <form onSubmit={submit} className="flex-1 p-6 sm:p-8 lg:p-12 space-y-4">
                  <input required value={form.ism} onChange={(e) => setForm({ ...form, ism: e.target.value })}
                    placeholder={t.order.name} className={inputCls} style={inputStyle} />
                  <input required type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                    placeholder={t.order.phone} className={inputCls} style={inputStyle} />
                  <textarea rows={4} value={form.xabar} onChange={(e) => setForm({ ...form, xabar: e.target.value })}
                    placeholder={t.order.org} className={inputCls} style={inputStyle} />
                  <button type="submit" disabled={status === "sending"}
                    className="w-full sm:w-auto px-10 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60" style={{ background: ORANGE }}>
                    {status === "sending" ? t.order.sending : t.order.submit}
                  </button>
                  {status === "ok" && <p className="text-sm" style={{ color: GREEN }}>{t.order.ok}</p>}
                  {status === "err" && <p className="text-sm" style={{ color: ORANGE }}>{t.order.err}</p>}
                </form>
                <div className="lg:w-[42%] p-6 sm:p-8 lg:p-12 flex flex-col justify-between gap-8 border-t lg:border-t-0 lg:border-l" style={{ borderColor: "var(--border-frame, #ccc)" }}>
                  <div>
                    <p className="text-sm font-light leading-relaxed" style={muted}>{rich(t.order.lead)}</p>
                    <ul className="mt-6 space-y-3">
                      {t.order.perks.map((p) => (
                        <li key={p} className="flex items-center gap-3 text-sm font-medium" style={text}>
                          <span className="w-5 h-5 flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ backgroundColor: GREEN }}>✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest" style={muted}>{t.order.call}</p>
                    <a href="tel:+998775504040" className="block text-2xl sm:text-3xl font-medium tracking-tight mt-2 hover:opacity-70" style={text}>+998 77 550-40-40</a>
                  </div>
                </div>
              </div>
            </Frame>
          </section>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
