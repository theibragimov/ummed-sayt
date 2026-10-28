"use client";

import { useState } from "react";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { TXT, FAQ, CERTS } from "@/components/easydrip-content";

// Mahsulot rasmlari (oq fonli qadoq suratlari) — public/images/easydrip/
const IMG = {
  "4": "/images/easydrip/easydrip-plus-4mm.png",
  "5": "/images/easydrip/easydrip-plus-5mm.png",
  "6": "/images/easydrip/easydrip-plus-6mm.png",
};
const SKU_IMG = { "02-3204": IMG["4"], "02-3105": IMG["5"], "02-3106": IMG["6"] };

// Haqiqiy mijoz fikrlari: { ism: "...", rol: "...", matn: { uz, ru, en } }
// Bo'sh bo'lsa — 3 ta bo'sh joy ko'rinadi.
const REVIEWS = [];

const ORANGE = "#E8491D";
const GREEN = "#3DB851";
const TILE = { backgroundColor: "var(--bg)" };

// Kulrang sahifa foni ustida yumaloq oq kataklar (ref: minimal mahsulot sahifasi)
function Frame({ children, className = "", grid = "" }) {
  if (grid) return <div className={`grid gap-3 ${grid} ${className}`}>{children}</div>;
  return <div className={`rounded-3xl overflow-hidden ${className}`} style={TILE}>{children}</div>;
}

function Cell({ children, className = "" }) {
  return <div className={`rounded-3xl p-6 sm:p-8 ${className}`} style={TILE}>{children}</div>;
}

// Rasm har doim oq fonda — suratning o'z oq foni bilan qo'shilib ketadi
function Photo({ src, alt, className = "", priority = false, sizes = "(max-width: 1024px) 100vw, 50vw" }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-contain p-4 sm:p-8" />
    </div>
  );
}

// Matndagi **so'z** qismlarini qalin qilib chiqaradi
const BOLD = { color: "var(--text)", fontWeight: 700 };
function rich(str, style = BOLD) {
  return str.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} style={style}>{part}</strong> : part));
}

// "01 — Mahsulot" → ["01", "Mahsulot"]
function splitLabel(label = "") {
  const m = label.match(/^(\d+)\s*—\s*(.*)$/);
  return m ? [m[1], m[2]] : ["", label];
}

function Heading({ label, title, as: Tag = "h2", className = "" }) {
  return (
    <Reveal variant="up" className={`mb-6 sm:mb-10 ${className}`}>
      {label && <span className="section-label">{label}</span>}
      <Tag className="text-2xl sm:text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight mt-3 sm:mt-5 max-w-[900px]"
        style={{ color: "var(--text)" }}>
        {title}
      </Tag>
    </Reveal>
  );
}

// Navbatma-navbat: rasm | raqam + sarlavha + matn
function Row({ id, label, title, img, alt, reverse = false, children }) {
  const [num, name] = splitLabel(label);
  return (
    <section id={id} className={`scroll-mt-24 grid gap-3 ${reverse ? "lg:grid-cols-[1fr_1.15fr]" : "lg:grid-cols-[1.15fr_1fr]"}`}>
      <Photo src={img} alt={alt} className={`aspect-square sm:aspect-[4/3] lg:aspect-square lg:sticky lg:top-24 lg:self-start ${reverse ? "lg:order-2" : ""}`} />
      <div className="rounded-3xl p-6 sm:p-10 lg:p-14 flex flex-col justify-center" style={TILE}>
        <Reveal variant="up">
          <span className="block text-5xl sm:text-6xl font-light tracking-tight tabular-nums" style={{ color: "var(--text)" }}>{num}</span>
          <span className="block mt-4 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: ORANGE }}>{name}</span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-medium leading-[1.1] tracking-tight" style={{ color: "var(--text)" }}>{title}</h2>
        </Reveal>
        <div className="mt-6 sm:mt-8">{children}</div>
      </div>
    </section>
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
  const LINE = "1px solid var(--border-strong, #e5e5e5)";
  const inputCls = "w-full rounded-xl px-4 py-3.5 text-[15px] outline-none bg-transparent transition-colors focus:border-[#E8491D]";
  const inputStyle = { border: LINE, color: "var(--text)" };
  const pillDark = "inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.03]";
  const pillLight = "inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium transition-opacity hover:opacity-70 shadow-[0_2px_14px_rgba(0,0,0,0.06)]";

  return (
    <>
      <SiteHeader />
      <style>{`.ed-page{--ed-page:#EFEFED}html[data-theme="dark"] .ed-page{--ed-page:#0f0f0f}`}</style>
      <main className="ed-page" style={{ backgroundColor: "var(--ed-page)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 pb-16 sm:pb-24 space-y-3">

          {/* ── Hero: chapda katta sarlavha (qora + kulrang), o'ngda mahsulot surati ── */}
          <section className="grid lg:grid-cols-[1fr_1.05fr] gap-3">
            <div className="rounded-3xl p-6 sm:p-10 lg:p-14 flex flex-col justify-center" style={TILE}>
              <span className="section-label">{t.hero.kicker}</span>
              <h1 className="mt-6 sm:mt-8 tracking-tight">
                <span className="block text-[44px] sm:text-7xl lg:text-[64px] xl:text-[84px] font-semibold leading-[0.95]" style={text}>{t.hero.brand}</span>
                <span className="block text-[26px] sm:text-4xl lg:text-[34px] xl:text-[42px] font-medium leading-[1.1] mt-3 sm:mt-4" style={muted}>{t.hero.title}</span>
              </h1>
              <p className="mt-6 sm:mt-8 text-xl sm:text-2xl leading-snug tracking-tight" style={text}>
                {rich(t.hero.sub, { color: ORANGE, fontWeight: 700 })}
              </p>
              <p className="mt-4 text-[15px] sm:text-base leading-relaxed max-w-[540px]" style={muted}>{rich(t.hero.lead)}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#buyurtma" className={pillDark} style={{ background: ORANGE }}>
                  {t.hero.cta1} <span aria-hidden>↗</span>
                </a>
                <a href="https://t.me/ummeduz" target="_blank" rel="noopener noreferrer" className={pillLight}
                  style={{ ...text, border: LINE }}>
                  {t.hero.cta2} <span aria-hidden>↗</span>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {t.hero.chips.map((c) => (
                  <span key={c} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ ...text, border: LINE }}>{c}</span>
                ))}
              </div>
            </div>
            <Photo src={IMG["4"]} alt="Easy Drip Plus 32G × 4 mm — insulin shprits-ruchkalari uchun ignalar, 100 dona"
              priority className="aspect-square lg:aspect-auto lg:min-h-[560px]" />
          </section>

          {/* ── 01 Mahsulot ── */}
          <Row id="mahsulot" label={t.about.label} title={t.about.title} img={IMG["6"]} alt="Easy Drip Plus 31G × 6 mm qadog'i">
            <div className="space-y-4">
              {t.about.body.map((p) => (
                <p key={p} className="text-[15px] sm:text-base leading-relaxed" style={muted}>{rich(p)}</p>
              ))}
            </div>
            <dl className="mt-8 grid sm:grid-cols-3 gap-4 pt-6" style={{ borderTop: LINE }}>
              {t.about.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={muted}>{k}</dt>
                  <dd className="text-sm font-semibold mt-1.5 leading-snug" style={text}>{v}</dd>
                </div>
              ))}
            </dl>
          </Row>

          {/* ── 02 Muammo va yechim ── */}
          <Row id="muammo" label={t.problem.label} title={t.problem.title} img={IMG["5"]} alt="Easy Drip Plus 31G × 5 mm qadog'i" reverse>
            <ul className="space-y-6">
              {t.problem.items.map(([title, prob, sol]) => (
                <li key={title} className="pt-5 first:pt-0" style={{ borderTop: LINE }}>
                  <h3 className="text-lg font-semibold tracking-tight" style={text}>{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed" style={muted}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] mr-2" style={{ color: ORANGE }}>{t.problem.colProblem}</span>
                    {rich(prob)}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed" style={text}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] mr-2" style={{ color: GREEN }}>{t.problem.colSolution}</span>
                    {rich(sol)}
                  </p>
                </li>
              ))}
            </ul>
          </Row>

          {/* ── 03 Xususiyatlar ── */}
          <Row id="yechim" label={t.features.label} title={t.features.title} img={IMG["4"]} alt="Easy Drip Plus 32G × 4 mm, Hextra Tech asosi">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {t.features.items.map(([title, body], i) => (
                <div key={title}>
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={i === 0 ? { background: ORANGE, color: "#fff" } : { border: LINE, ...text }}>
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold mt-3 mb-1.5" style={text}>{title}</h3>
                  <p className="text-[15px] leading-relaxed" style={muted}>{rich(body)}</p>
                </div>
              ))}
            </div>
          </Row>

          {/* ── 04 O'lchamlar: mahsulot kartochkalari ── */}
          <section id="olchamlar" className="scroll-mt-24 pt-14 sm:pt-20">
            <Heading label={t.sizes.label} title={t.sizes.title} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {t.sizes.rows.map(([g, len, who, sku], i) => (
                <div key={sku} className="rounded-3xl overflow-hidden flex flex-col" style={TILE}>
                  <div className="relative">
                    <Photo src={SKU_IMG[sku] || IMG["4"]} alt={`Easy Drip Plus ${g} × ${len}`} className="aspect-square !rounded-none"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    {i === 0 && (
                      <span className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white" style={{ backgroundColor: ORANGE }}>TOP</span>
                    )}
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-3xl sm:text-4xl font-semibold tracking-tight" style={text}>{len}</p>
                      <p className="text-base font-semibold" style={{ color: ORANGE }}>{g}</p>
                    </div>
                    <p className="text-[15px] leading-relaxed mt-3 flex-1" style={muted}>{rich(who)}</p>
                    <p className="text-xs mt-5 pt-4" style={{ borderTop: LINE, ...muted }}>
                      {t.sizes.sku}: <span className="font-semibold" style={text}>{sku}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={muted}>{t.sizes.note} {t.sizes.pack}</p>
          </section>

          {/* ── Nega EasyDrip: 3 ta sotuv argumenti ── */}
          <section className="pt-14 sm:pt-20">
            <Heading title={t.args.title} />
            <Frame grid="md:grid-cols-3">
              {t.args.items.map(([title, body, slogan], i) => (
                <Cell key={title} className="flex flex-col">
                  <span className="text-5xl font-light tracking-tight" style={{ color: i === 0 ? ORANGE : "var(--text)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-semibold tracking-tight mt-5 mb-2" style={text}>{title}</h3>
                  <p className="text-[15px] leading-relaxed flex-1" style={muted}>{rich(body)}</p>
                  <p className="text-sm font-semibold mt-6 pt-4" style={{ borderTop: LINE, color: ORANGE }}>“{slogan}”</p>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── 05 Bilish muhim: igna nimani qilmaydi ── */}
          <section className="pt-14 sm:pt-20">
            <Heading label={t.honest.label} title={t.honest.title} />
            <Frame grid="lg:grid-cols-[1fr_2fr]">
              <Cell className="flex flex-col justify-between gap-6">
                <p className="text-base sm:text-lg leading-relaxed" style={text}>{t.honest.lead}</p>
                <p className="text-sm leading-relaxed" style={muted}>{t.honest.note}</p>
              </Cell>
              <Cell className="!py-2">
                {t.honest.items.map(([title, body], i) => (
                  <div key={title} className="py-5 grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-1 sm:gap-6 items-baseline"
                    style={i ? { borderTop: LINE } : undefined}>
                    <h3 className="text-base font-semibold flex items-baseline gap-3" style={text}>
                      <span className="text-sm flex-shrink-0" style={{ color: ORANGE }}>✕</span>{title}
                    </h3>
                    <p className="text-[15px] leading-relaxed pl-6 sm:pl-0" style={muted}>{rich(body)}</p>
                  </div>
                ))}
              </Cell>
            </Frame>
          </section>

          {/* ── Kim uchun ── */}
          <section className="pt-14 sm:pt-20">
            <Heading title={t.audience.title} />
            <Frame grid="md:grid-cols-3">
              {t.audience.items.map(([title, body]) => (
                <Cell key={title}>
                  <h3 className="text-lg font-semibold" style={text}>{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed" style={muted}>{rich(body)}</p>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── 06 Sertifikatlar ── */}
          <section className="pt-14 sm:pt-20">
            <Heading label={t.certs.label} title={t.certs.title} />
            <Frame grid="lg:grid-cols-[1fr_2fr]">
              <Cell className="flex flex-col justify-between gap-6">
                <p className="text-[15px] leading-relaxed" style={muted}>{t.certs.lead}</p>
                <Image src="/partners/sandstone.png" alt="Sandstone Medical" width={160} height={60} className="object-contain h-12 w-auto" style={{ width: "auto" }} />
              </Cell>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CERTS.map(([name, sub]) => (
                  <Cell key={name}>
                    <p className="text-xl sm:text-2xl font-semibold tracking-tight" style={text}>{name}</p>
                    <p className="text-xs mt-1" style={muted}>{sub}</p>
                  </Cell>
                ))}
              </div>
            </Frame>
          </section>

          {/* ── 07 Fikrlar ── */}
          <section className="pt-14 sm:pt-20">
            <Heading label={t.reviews.label} title={t.reviews.title} />
            <Frame grid="md:grid-cols-3">
              {(REVIEWS.length ? REVIEWS : [null, null, null]).map((r, i) => (
                <Cell key={i} className="flex flex-col min-h-[220px]">
                  <span className="text-4xl font-medium leading-none" style={{ color: ORANGE }}>“</span>
                  <blockquote className="text-base leading-relaxed mt-3 flex-1" style={r ? text : muted}>
                    {r ? (r.matn[lang] || r.matn.uz) : t.reviews.placeholder}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--ed-page)" }} />
                    {r && (
                      <span>
                        <span className="block text-sm font-semibold" style={text}>{r.ism}</span>
                        <span className="block text-xs" style={muted}>{r.rol}</span>
                      </span>
                    )}
                  </figcaption>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── Qo'llash: 4 qadam ── */}
          <section className="pt-14 sm:pt-20">
            <Heading title={t.steps.title} />
            <Frame grid="sm:grid-cols-2 lg:grid-cols-4">
              {t.steps.items.map(([title, body], i) => (
                <Cell key={title}>
                  <span className="text-5xl font-light tracking-tight" style={{ color: i === 3 ? GREEN : "var(--text)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-semibold mt-5 mb-2" style={text}>{title}</h3>
                  <p className="text-[15px] leading-relaxed" style={muted}>{rich(body)}</p>
                </Cell>
              ))}
            </Frame>
          </section>

          {/* ── 08 FAQ ── */}
          <section id="savollar" className="scroll-mt-24 pt-14 sm:pt-20 grid lg:grid-cols-[1fr_2fr] gap-3 lg:gap-12">
            <Heading label={t.faq.label} title={t.faq.title} />
            <div className="space-y-3">
              {faq.map(([q, a], i) => (
                <div key={q} className="rounded-2xl" style={TILE}>
                  <button type="button" onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-6 px-5 sm:px-7 py-5 text-left">
                    <span className="text-base font-semibold" style={text}>{q}</span>
                    <span className="text-2xl leading-none flex-shrink-0 transition-transform" style={{ color: ORANGE, transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {open === i && <p className="px-5 sm:px-7 pb-6 -mt-1 text-[15px] leading-relaxed" style={muted}>{rich(a)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* ── Buyurtma: banner + forma ── */}
          <section id="buyurtma" className="scroll-mt-24 pt-14 sm:pt-20 space-y-3">
            <div className="rounded-3xl p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6" style={TILE}>
              <div>
                <span className="section-label">{t.order.label}</span>
                <h2 className="mt-4 text-3xl sm:text-5xl font-medium leading-[1.05] tracking-tight max-w-[760px]" style={text}>{t.order.title}</h2>
              </div>
              <a href="tel:+998775504040" className={`${pillLight} self-start lg:self-auto`} style={{ ...text, border: LINE }}>
                +998 77 550-40-40 <span aria-hidden>↗</span>
              </a>
            </div>
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3">
              <form onSubmit={submit} className="rounded-3xl p-6 sm:p-8 lg:p-12 space-y-4" style={TILE}>
                <input required value={form.ism} onChange={(e) => setForm({ ...form, ism: e.target.value })}
                  placeholder={t.order.name} className={inputCls} style={inputStyle} />
                <input required type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                  placeholder={t.order.phone} className={inputCls} style={inputStyle} />
                <textarea rows={4} value={form.xabar} onChange={(e) => setForm({ ...form, xabar: e.target.value })}
                  placeholder={t.order.org} className={inputCls} style={inputStyle} />
                <button type="submit" disabled={status === "sending"}
                  className={`${pillDark} w-full sm:w-auto disabled:opacity-60`} style={{ background: ORANGE }}>
                  {status === "sending" ? t.order.sending : t.order.submit} <span aria-hidden>↗</span>
                </button>
                {status === "ok" && <p className="text-sm" style={{ color: GREEN }}>{t.order.ok}</p>}
                {status === "err" && <p className="text-sm" style={{ color: ORANGE }}>{t.order.err}</p>}
              </form>
              <div className="rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-col justify-between gap-8" style={TILE}>
                <div>
                  <p className="text-[15px] leading-relaxed" style={muted}>{rich(t.order.lead)}</p>
                  <ul className="mt-6 space-y-3">
                    {t.order.perks.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-[15px] font-semibold" style={text}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ backgroundColor: GREEN }}>✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={muted}>{t.order.call}</p>
                  <a href="tel:+998775504040" className="block text-2xl sm:text-3xl font-semibold tracking-tight mt-2 hover:opacity-70" style={text}>+998 77 550-40-40</a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
