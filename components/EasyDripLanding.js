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
const LINE = "1px solid var(--border-strong, #e5e5e5)";
const text = { color: "var(--text)" };
// Kulrang matn sayt default'idan to'qroq — o'qish oson bo'lsin
const muted = { color: "var(--ed-muted)" };

// Ramkasiz ustunlar: har biri ustida ingichka chiziq
function Cols({ children, className = "" }) {
  return <div className={`grid gap-x-10 gap-y-10 ${className}`}>{children}</div>;
}
function Col({ children, className = "" }) {
  return <div className={`pt-6 ${className}`} style={{ borderTop: LINE }}>{children}</div>;
}

// Suratlar oq fonli — oq sahifada ramkasiz qo'shilib ketadi
function Photo({ src, alt, className = "", priority = false, sizes = "(max-width: 1024px) 100vw, 50vw" }) {
  return (
    <div className={`relative overflow-hidden ed-photo ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-contain" />
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

const BODY = "text-[17px] sm:text-lg leading-[1.7]";
const H3 = "text-xl sm:text-[22px] font-semibold tracking-tight";

function Heading({ label, title, as: Tag = "h2", className = "" }) {
  return (
    <Reveal variant="up" className={`mb-10 sm:mb-14 ${className}`}>
      {label && <span className="section-label">{label}</span>}
      <Tag className="text-3xl sm:text-5xl font-semibold leading-[1.08] tracking-tight mt-4 sm:mt-5 max-w-[900px]" style={text}>
        {title}
      </Tag>
    </Reveal>
  );
}

// Navbatma-navbat: surat | raqam + sarlavha + matn
function Row({ id, label, title, img, alt, reverse = false, children }) {
  const [num, name] = splitLabel(label);
  return (
    <section id={id} className="scroll-mt-24 grid lg:grid-cols-2 gap-8 lg:gap-20 lg:items-start">
      <Photo src={img} alt={alt} className={`aspect-square max-w-[560px] w-full mx-auto lg:sticky lg:top-28 ${reverse ? "lg:order-2" : ""}`} />
      <div className="lg:py-10">
        <Reveal variant="up">
          <span className="block text-6xl sm:text-7xl font-light tracking-tight tabular-nums" style={text}>{num}</span>
          <span className="block mt-5 text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: ORANGE }}>{name}</span>
          <h2 className="mt-3 text-3xl sm:text-[44px] font-semibold leading-[1.1] tracking-tight" style={text}>{title}</h2>
        </Reveal>
        <div className="mt-8 sm:mt-10">{children}</div>
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

  const inputCls = "w-full rounded-xl px-4 py-4 text-base outline-none bg-transparent transition-colors focus:border-[#E8491D]";
  const inputStyle = { border: LINE, color: "var(--text)" };
  const pillDark = "inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.03]";
  const pillLight = "inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-medium transition-opacity hover:opacity-70";
  const nav = t.nav.items.map(([label, href]) => ({ label, href }));

  return (
    <>
      <SiteHeader nav={nav} cta={{ label: t.nav.cta, href: "#buyurtma" }} />
      <style>{`.ed-page{--ed-muted:#55555b}html[data-theme="dark"] .ed-page{--ed-muted:#b9b9be}html[data-theme="dark"] .ed-photo{border-radius:24px;background:#fff}`}</style>
      <main className="ed-page" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-14 pb-20 sm:pb-28 space-y-24 sm:space-y-36">

          {/* ── Hero: chapda sarlavha (qora + kulrang), o'ngda mahsulot surati ── */}
          <section className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-center">
            <div>
              <span className="section-label">{t.hero.kicker}</span>
              <h1 className="mt-6 sm:mt-8 tracking-tight">
                <span className="block text-[40px] sm:text-6xl lg:text-[56px] xl:text-[68px] font-semibold leading-[1]" style={text}>{t.hero.brand}</span>
                <span className="block text-[24px] sm:text-[34px] lg:text-[30px] xl:text-[36px] font-medium leading-[1.15] mt-3 sm:mt-4" style={{ color: "#8d8d93" }}>{t.hero.title}</span>
              </h1>
              <p className="mt-7 sm:mt-9 text-[22px] sm:text-[26px] leading-snug tracking-tight" style={text}>
                {rich(t.hero.sub, { color: ORANGE, fontWeight: 700 })}
              </p>
              <p className={`mt-5 ${BODY} max-w-[560px]`} style={muted}>{rich(t.hero.lead)}</p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <a href="#buyurtma" className={pillDark} style={{ background: ORANGE }}>
                  {t.hero.cta1} <span aria-hidden>↗</span>
                </a>
                <a href="https://t.me/ummeduz" target="_blank" rel="noopener noreferrer" className={pillLight}
                  style={{ ...text, border: LINE }}>
                  {t.hero.cta2} <span aria-hidden>↗</span>
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
                {t.hero.chips.map((c) => (
                  <span key={c} className="text-[15px] font-semibold" style={text}>
                    <span className="mr-2" style={{ color: ORANGE }}>●</span>{c}
                  </span>
                ))}
              </div>
            </div>
            <Photo src={IMG["4"]} alt="Easy Drip Plus 32G × 4 mm — insulin shprits-ruchkalari uchun ignalar, 100 dona"
              priority className="aspect-square w-full max-w-[620px] mx-auto" />
          </section>

          {/* ── 01 Mahsulot ── */}
          <Row id="mahsulot" label={t.about.label} title={t.about.title} img={IMG["6"]} alt="Easy Drip Plus 31G × 6 mm qadog'i">
            <div className="space-y-5">
              {t.about.body.map((p) => (
                <p key={p} className={BODY} style={muted}>{rich(p)}</p>
              ))}
            </div>
            <dl className="mt-10 grid sm:grid-cols-3 gap-6 pt-7" style={{ borderTop: LINE }}>
              {t.about.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em]" style={muted}>{k}</dt>
                  <dd className="text-base font-semibold mt-2 leading-snug" style={text}>{v}</dd>
                </div>
              ))}
            </dl>
          </Row>

          {/* ── 02 Muammo va yechim ── */}
          <Row id="muammo" label={t.problem.label} title={t.problem.title} img={IMG["5"]} alt="Easy Drip Plus 31G × 5 mm qadog'i" reverse>
            <ul className="space-y-8">
              {t.problem.items.map(([title, prob, sol]) => (
                <li key={title} className="pt-7 first:pt-0 first:!border-t-0" style={{ borderTop: LINE }}>
                  <h3 className={H3} style={text}>{title}</h3>
                  <p className={`mt-3 ${BODY}`} style={muted}>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] mb-1" style={{ color: ORANGE }}>{t.problem.colProblem}</span>
                    {rich(prob)}
                  </p>
                  <p className={`mt-3 ${BODY}`} style={text}>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] mb-1" style={{ color: GREEN }}>{t.problem.colSolution}</span>
                    {rich(sol)}
                  </p>
                </li>
              ))}
            </ul>
          </Row>

          {/* ── 03 Xususiyatlar ── */}
          <Row id="yechim" label={t.features.label} title={t.features.title} img={IMG["4"]} alt="Easy Drip Plus 32G × 4 mm, Hextra Tech asosi">
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-9">
              {t.features.items.map(([title, body], i) => (
                <div key={title}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold"
                    style={i === 0 ? { background: ORANGE, color: "#fff" } : { border: LINE, ...text }}>
                    {i + 1}
                  </span>
                  <h3 className={`${H3} mt-4 mb-2`} style={text}>{title}</h3>
                  <p className={BODY} style={muted}>{rich(body)}</p>
                </div>
              ))}
            </div>
          </Row>

          {/* ── 04 O'lchamlar: rasm + ma'lumot, ramkasiz ── */}
          <section id="olchamlar" className="scroll-mt-24">
            <Heading label={t.sizes.label} title={t.sizes.title} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {t.sizes.rows.map(([g, len, who, sku], i) => (
                <div key={sku} className="flex flex-col">
                  <div className="relative">
                    <Photo src={SKU_IMG[sku] || IMG["4"]} alt={`Easy Drip Plus ${g} × ${len}`} className="aspect-square"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    {i === 0 && (
                      <span className="absolute top-3 right-3 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white" style={{ backgroundColor: ORANGE }}>TOP</span>
                    )}
                  </div>
                  <div className="mt-4 pt-5 flex-1 flex flex-col" style={{ borderTop: LINE }}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-4xl font-semibold tracking-tight" style={text}>{len}</p>
                      <p className="text-lg font-bold" style={{ color: ORANGE }}>{g}</p>
                    </div>
                    <p className={`${BODY} mt-3 flex-1`} style={muted}>{rich(who)}</p>
                    <p className="text-[15px] mt-4" style={muted}>
                      {t.sizes.sku}: <span className="font-semibold" style={text}>{sku}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-base" style={muted}>{t.sizes.note} {t.sizes.pack}</p>
          </section>

          {/* ── Nega EasyDrip: 3 ta sotuv argumenti ── */}
          <section>
            <Heading title={t.args.title} />
            <Cols className="md:grid-cols-3">
              {t.args.items.map(([title, body, slogan], i) => (
                <Col key={title} className="flex flex-col">
                  <span className="text-5xl font-light tracking-tight" style={{ color: i === 0 ? ORANGE : "var(--text)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={`${H3} mt-5 mb-3`} style={text}>{title}</h3>
                  <p className={`${BODY} flex-1`} style={muted}>{rich(body)}</p>
                  <p className="text-[17px] font-semibold mt-5" style={{ color: ORANGE }}>“{slogan}”</p>
                </Col>
              ))}
            </Cols>
          </section>

          {/* ── 05 Bilish muhim: igna nimani qilmaydi ── */}
          <section>
            <Heading label={t.honest.label} title={t.honest.title} />
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
              <div className="space-y-6">
                <p className="text-lg sm:text-xl leading-[1.6]" style={text}>{t.honest.lead}</p>
                <p className="text-[15px] leading-relaxed" style={muted}>{t.honest.note}</p>
              </div>
              <div>
                {t.honest.items.map(([title, body]) => (
                  <div key={title} className="py-6 grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-2 sm:gap-8 items-baseline"
                    style={{ borderTop: LINE }}>
                    <h3 className="text-lg font-semibold flex items-baseline gap-3" style={text}>
                      <span className="flex-shrink-0" style={{ color: ORANGE }}>✕</span>{title}
                    </h3>
                    <p className={`${BODY} pl-7 sm:pl-0`} style={muted}>{rich(body)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Kim uchun ── */}
          <section>
            <Heading title={t.audience.title} />
            <Cols className="md:grid-cols-3">
              {t.audience.items.map(([title, body]) => (
                <Col key={title}>
                  <h3 className={H3} style={text}>{title}</h3>
                  <p className={`mt-3 ${BODY}`} style={muted}>{rich(body)}</p>
                </Col>
              ))}
            </Cols>
          </section>

          {/* ── 06 Sertifikatlar ── */}
          <section>
            <Heading label={t.certs.label} title={t.certs.title} />
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
              <div className="flex flex-col gap-8">
                <p className={BODY} style={muted}>{t.certs.lead}</p>
                <Image src="/partners/sandstone.png" alt="Sandstone Medical" width={160} height={60} className="object-contain h-12 w-auto" style={{ width: "auto" }} />
              </div>
              <Cols className="grid-cols-2 sm:grid-cols-3 !gap-y-8">
                {CERTS.map(([name, sub]) => (
                  <Col key={name}>
                    <p className="text-2xl sm:text-3xl font-semibold tracking-tight" style={text}>{name}</p>
                    <p className="text-[15px] mt-1" style={muted}>{sub}</p>
                  </Col>
                ))}
              </Cols>
            </div>
          </section>

          {/* ── 07 Fikrlar ── */}
          <section>
            <Heading label={t.reviews.label} title={t.reviews.title} />
            <Cols className="md:grid-cols-3">
              {(REVIEWS.length ? REVIEWS : [null, null, null]).map((r, i) => (
                <Col key={i} className="flex flex-col">
                  <span className="text-5xl font-medium leading-none" style={{ color: ORANGE }}>“</span>
                  <blockquote className={`${BODY} mt-3 flex-1`} style={r ? text : muted}>
                    {r ? (r.matn[lang] || r.matn.uz) : t.reviews.placeholder}
                  </blockquote>
                  {r && (
                    <figcaption className="mt-6">
                      <span className="block text-base font-semibold" style={text}>{r.ism}</span>
                      <span className="block text-sm" style={muted}>{r.rol}</span>
                    </figcaption>
                  )}
                </Col>
              ))}
            </Cols>
          </section>

          {/* ── Qo'llash: 4 qadam ── */}
          <section>
            <Heading title={t.steps.title} />
            <Cols className="sm:grid-cols-2 lg:grid-cols-4">
              {t.steps.items.map(([title, body], i) => (
                <Col key={title}>
                  <span className="text-5xl font-light tracking-tight" style={{ color: i === 3 ? GREEN : "var(--text)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={`${H3} mt-5 mb-2`} style={text}>{title}</h3>
                  <p className={BODY} style={muted}>{rich(body)}</p>
                </Col>
              ))}
            </Cols>
          </section>

          {/* ── 08 FAQ ── */}
          <section id="savollar" className="scroll-mt-24 grid lg:grid-cols-[1fr_1.8fr] gap-4 lg:gap-16">
            <Heading label={t.faq.label} title={t.faq.title} />
            <div style={{ borderBottom: LINE }}>
              {faq.map(([q, a], i) => (
                <div key={q} style={{ borderTop: LINE }}>
                  <button type="button" onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left">
                    <span className="text-lg sm:text-xl font-semibold tracking-tight" style={text}>{q}</span>
                    <span className="text-3xl leading-none flex-shrink-0 transition-transform" style={{ color: ORANGE, transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {open === i && <p className={`pb-7 -mt-1 ${BODY}`} style={muted}>{rich(a)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* ── Buyurtma ── */}
          <section id="buyurtma" className="scroll-mt-24">
            <Heading label={t.order.label} title={t.order.title} />
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
              <form onSubmit={submit} className="space-y-4">
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
                {status === "ok" && <p className="text-base" style={{ color: GREEN }}>{t.order.ok}</p>}
                {status === "err" && <p className="text-base" style={{ color: ORANGE }}>{t.order.err}</p>}
              </form>
              <div className="flex flex-col justify-between gap-10">
                <div>
                  <p className={BODY} style={muted}>{rich(t.order.lead)}</p>
                  <ul className="mt-7 space-y-4">
                    {t.order.perks.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-[17px] font-semibold" style={text}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: GREEN }}>✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-7" style={{ borderTop: LINE }}>
                  <p className="text-sm font-bold uppercase tracking-widest" style={muted}>{t.order.call}</p>
                  <a href="tel:+998775504040" className="block text-3xl sm:text-4xl font-semibold tracking-tight mt-2 hover:opacity-70" style={text}>+998 77 550-40-40</a>
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
