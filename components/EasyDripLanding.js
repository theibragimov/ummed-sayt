"use client";

import { useState } from "react";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { TXT, FAQ, CERTS } from "@/components/easydrip-content";

// Mahsulot rasmlari — foni olib tashlangan (shaffof PNG) qadoq suratlari
const IMG = {
  "4": "/images/easydrip/easydrip-plus-4mm-cut.png",
  "5": "/images/easydrip/easydrip-plus-5mm-cut.png",
  "6": "/images/easydrip/easydrip-plus-6mm-cut.png",
  "8": "/images/easydrip/easydrip-plus-8mm-cut.png",
};
const SKU_IMG = { "02-3204": IMG["4"], "02-3105": IMG["5"], "02-3106": IMG["6"], "02-3108": IMG["8"] };

// Mavzuga mos real suratlar (Nano Banana, asl qadoq va igna suratlari asosida)
const PH = (n) => `/images/easydrip/photo/${n}.jpg`;
// Xususiyatlar kartochkalari tartibida: igna uchi, Hextra asos, teriga tegadigan yuza, qopqoqlar
const FEATURE_IMG = ["needle-macro", "hub-top", "skin-contact-v2", "caps-real"];
const HERO_IMG = "hero-4k-v2";
// O'lcham kartochkalari uchun bir xil studiya suratlari
// Oq studiya fonidagi, bir xil holatdagi qadoq suratlari
// Qadoq ranglari: kartochka yozuvi va gradienti shu rangda
const SIZE_COLOR = { "02-3204": "#22A447", "02-3105": "#7A2E9A", "02-3106": "#EE7A1A", "02-3108": "#1E9E9B" };
const SIZE_IMG = { "02-3204": PH("size-4-studio-v2"), "02-3105": PH("size-5-studio-v2"), "02-3106": PH("size-6-studio-v2"), "02-3108": PH("size-8-studio-v2") };
// Muammo (qizil ramka) va yechim (yashil ramka) suratlari — t.problem.items tartibida
const PROBLEM_IMG = [["problem-pain-v2", "needle-macro"], ["problem-bent", "hub-top"], ["depth-bad-v4", "depth-good-v4"], ["problem-caps-v2", "caps-real"]];
const RED = "#E5383B";

// Haqiqiy mijoz fikrlari: { ism: "...", rol: "...", matn: { uz, ru, en } }
// Bo'sh bo'lsa — 3 ta bo'sh joy ko'rinadi.
const REVIEWS = [];

const ORANGE = "#E8491D";
const GREEN = "#3DB851";
const TILE = { backgroundColor: "var(--ed-tile)" };
const text = { color: "var(--text)" };
// Kulrang matn sayt default'idan to'qroq — o'qish oson bo'lsin
const muted = { color: "var(--ed-muted)" };

const BODY = "text-[17px] sm:text-lg leading-[1.65]";
const H3 = "text-xl sm:text-[22px] font-semibold tracking-tight";

// Yumshoq kulrang, ramkasiz katak (ref: Orbita do'kon dizayni)
function Tile({ children, className = "", style }) {
  return <div className={`rounded-[28px] p-6 sm:p-8 ${className}`} style={{ ...TILE, ...style }}>{children}</div>;
}

// Matndagi **so'z** qismlarini qalin qilib chiqaradi
const BOLD = { color: "var(--text)", fontWeight: 700 };
function rich(str, style = BOLD) {
  return str.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} style={style}>{part}</strong> : part));
}

function Heading({ title, className = "" }) {
  return (
    <Reveal variant="up" className={`mb-6 sm:mb-8 px-1 ${className}`}>
      <h2 className="text-[30px] sm:text-[44px] font-semibold leading-[1.1] tracking-tight max-w-[960px] lg:max-w-none" style={text}>{rich(title, { color: ORANGE, fontWeight: 600 })}</h2>
    </Reveal>
  );
}

const ICONS = [
  <path key="a" d="M12 3l7 3v6c0 4.2-3 7.6-7 9-4-1.4-7-4.8-7-9V6l7-3zM9 12l2 2 4-4" />,
  <path key="b" d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z" />,
  <path key="c" d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />,
];

// "Farqi" kartochkalari: olti qirrali asos, chuqurlik, qopqoq, yumshoq kiritish (pat)
const DIFF_ICONS = [
  <><path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z" /><circle cx="12" cy="12" r="2.6" /></>,
  <><path d="M12 3v10.5M9.5 3h5M4 15h16M4 19.5h16" /><path d="M10.2 11.7L12 13.5l1.8-1.8" /></>,
  <><path d="M9 10l1.2-6h3.6L15 10M8 10h8l1 11H7z" /><path d="M10 14h4M10 17.5h4" /></>,
  <><path d="M20.2 3.8a6 6 0 00-8.5 0L5 10.5V19h8.5l6.7-6.7a6 6 0 000-8.5zM16 8L3 21M17.5 15H9" /></>,
];

// Sichqoncha ustida surat yaqinlashadi va kursor turgan joyni kattalashtiradi (.group ichida)
const trackCursor = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
};
const ZOOM_CLS = "absolute inset-0 motion-reduce:group-hover:scale-100";
const ZOOM_STYLE = { transformOrigin: "var(--mx, 50%) var(--my, 50%)", transition: "scale 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), transform-origin 0.3s ease-out" };

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

  const inputCls = "w-full rounded-2xl px-5 py-4 text-base outline-none transition-shadow focus:shadow-[0_0_0_2px_#E8491D]";
  const inputStyle = { backgroundColor: "var(--bg)", color: "var(--text)" };
  const pill = "inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 hover:scale-[1.03]";
  const nav = t.nav.items.map(([label, href]) => ({ label, href }));
  const [s4, s5, s6, s8] = t.sizes.rows;

  // O'lcham kartochkasi: oq studiya surati, aniq ramka, tepada nom; sichqoncha ustida yaqinlashadi
  const SizeTile = ({ row }) => {
    const [g, len, , sku] = row;
    return (
      <div className="group relative rounded-[28px] overflow-hidden aspect-square p-6 sm:p-7 bg-white" style={{ boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.09)" }} onMouseMove={trackCursor}>
        <div className={`${ZOOM_CLS} group-hover:scale-[1.8]`} style={ZOOM_STYLE}>
          <Image src={SIZE_IMG[sku]} alt={`Easy Drip Plus ${g} × ${len}`} fill sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 25vw" className="object-cover" />
        </div>
        <span className="absolute inset-x-0 top-0 h-[40%] pointer-events-none" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${SIZE_COLOR[sku]} 14%, #fff) 0%, color-mix(in srgb, ${SIZE_COLOR[sku]} 6%, rgba(255,255,255,0.6)) 55%, rgba(255,255,255,0) 100%)` }} />
        <p className="relative text-[28px] sm:text-[32px] font-semibold tracking-tight leading-none" style={{ color: SIZE_COLOR[sku] }}>
          {len} · {g}
        </p>
      </div>
    );
  };

  return (
    <>
      <SiteHeader nav={nav} cta={{ label: t.nav.cta, href: "#buyurtma" }} />
      <style>{`.ed-page{--ed-muted:#55555b;--ed-tile:#F1F2F5}html[data-theme="dark"] .ed-page{--ed-muted:#b9b9be;--ed-tile:#222225}@keyframes edUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}@keyframes edZoom{from{transform:scale(1.1)}to{transform:scale(1)}}.ed-up{animation:edUp .9s cubic-bezier(.2,.7,.2,1) both}.ed-zoom{animation:edZoom 2.6s cubic-bezier(.2,.7,.2,1) both}@media (prefers-reduced-motion:reduce){.ed-up,.ed-zoom{animation:none}}`}</style>
      <main className="ed-page" style={{ backgroundColor: "var(--bg)" }}>
          {/* ── Hero: to'liq rasm, asosiy obyekt o'ngda, chap tomon oq — matn shu yerda (rasm doim oq, shuning uchun ranglar qat'iy) ── */}
          <section className="relative overflow-hidden bg-white lg:h-[min(calc(100vh-80px),860px)] lg:min-h-[620px] flex flex-col lg:block">
            <div className="relative h-[280px] sm:h-[420px] lg:absolute lg:inset-0 lg:h-auto">
              <Image src={PH(HERO_IMG)} alt="Easy Drip Plus ignalari va insulin shprits-ruchkasi" fill priority
                sizes="100vw" className="ed-zoom object-cover object-[72%_50%] lg:object-[100%_50%]" />
            </div>
            <div className="relative z-10 w-full h-full px-5 sm:px-10 lg:pl-14 xl:pl-20 2xl:pl-28 py-8 sm:py-12 flex flex-col justify-center">
              <div className="lg:max-w-[min(48vw,720px)]">
              <h1 className="ed-up text-[36px] sm:text-[52px] lg:text-[min(4.6vw,68px)] font-semibold leading-[1.04] tracking-[-0.035em]" style={{ color: "#141414" }}>
                {rich(t.hero.sub, { color: ORANGE })}
              </h1>
              <p className="ed-up mt-4 text-[17px] sm:text-[19px] leading-snug tracking-tight" style={{ color: "#55555b", animationDelay: "120ms" }}>
                <strong className="font-bold" style={{ color: "#141414" }}>{t.hero.brand.replace(/\s*Plus$/, "")} <span style={{ color: ORANGE }}>Plus</span></strong> {t.hero.title}
              </p>
              {/* Asosiy afzalliklar: ramkali, ko'zga tashlanadigan kataklar */}
              <ul className="ed-up mt-6 grid grid-cols-2 gap-2.5 max-w-[560px]" style={{ animationDelay: "240ms" }}>
                {t.hero.checks.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 sm:gap-3 rounded-2xl px-3 py-2.5 sm:py-3 text-[14px] sm:text-[16px] font-bold leading-tight" style={{ backgroundColor: "color-mix(in srgb, " + GREEN + " 8%, #fff)", border: `2px solid ${GREEN}`, color: "#141414" }}>
                    <span className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 rounded-full flex items-center justify-center text-white text-sm" style={{ background: GREEN }}>✓</span>{c}
                  </li>
                ))}
              </ul>
              <p className="ed-up mt-5 text-[15px] sm:text-[16px] leading-relaxed max-w-[560px]" style={{ color: "#55555b", animationDelay: "360ms" }}>{rich(t.hero.lead, { color: "#141414", fontWeight: 700 })}</p>
              <div className="ed-up mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: "480ms" }}>
                <a href="#buyurtma" className={`${pill} text-white`} style={{ background: ORANGE }}>{t.hero.cta1}</a>
                <a href="#buyurtma" aria-label={t.hero.cta1} className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110" style={{ background: ORANGE }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
                </a>
                <a href="https://t.me/ummeduz" target="_blank" rel="noopener noreferrer" className={pill} style={{ background: "#fff", color: "#141414", boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.12)" }}>{t.hero.cta2}</a>
              </div>
              </div>
            </div>
          </section>

        <div className="max-w-[1320px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-20 sm:pb-28">

          {/* ── Mahsulot haqida: matn + surat ── */}
          <section id="mahsulot" className="scroll-mt-24 pt-16 sm:pt-24">
            <Heading title={t.about.title} />
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-3">
              <Tile className="sm:!p-10 lg:!p-14">
                <div className="space-y-5">
                  {t.about.body.map((p) => <p key={p} className={BODY} style={muted}>{rich(p)}</p>)}
                </div>
                {/* Faktlar: "·" bilan ajratilgan qiymat (o'lchamlar) alohida yashil belgilarga bo'linadi */}
                <dl className="mt-8 grid sm:grid-cols-2 gap-3">
                  {t.about.facts.map(([k, v]) => {
                    const parts = v.split(" · ");
                    return (
                      <div key={k} className={`rounded-2xl p-5 ${parts.length > 1 ? "sm:col-span-2 order-last" : ""}`}
                        style={{ backgroundColor: "var(--bg)", borderLeft: `4px solid ${parts.length > 1 ? GREEN : ORANGE}` }}>
                        <dt className="text-sm font-semibold" style={{ color: parts.length > 1 ? GREEN : ORANGE }}>{k}</dt>
                        {parts.length > 1 ? (
                          <dd className="mt-3 flex flex-wrap gap-2">
                            {parts.map((x) => (
                              <span key={x} className="rounded-full px-3.5 py-1.5 text-[15px] sm:text-base font-bold whitespace-nowrap"
                                style={{ backgroundColor: "color-mix(in srgb, " + GREEN + " 12%, var(--bg))", ...text }}>{x}</span>
                            ))}
                          </dd>
                        ) : (
                          <dd className="text-[17px] sm:text-lg font-bold mt-1.5 leading-snug" style={text}>{v}</dd>
                        )}
                      </div>
                    );
                  })}
                </dl>
              </Tile>
              <div className="relative rounded-[28px] overflow-hidden min-h-[340px] lg:min-h-0" style={TILE}>
                <Image src={PH("pen-attach-v2")} alt="EasyDrip Plus ignasini insulin shprits-ruchkasiga burab o'rnatish" fill sizes="(max-width: 1024px) 95vw, 45vw" className="object-cover" />
              </div>
            </div>
          </section>

          {/* ── Farqi: 4 ta asosiy xususiyat kartochkasi ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.trust.title} />
            <div className="grid sm:grid-cols-2 gap-3">
              {t.trust.items.map(([title, body], i) => (
                <Tile key={title} className="sm:!p-10 flex gap-5 sm:gap-6 items-start">
                  <span className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-white" style={{ background: ORANGE }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{DIFF_ICONS[i % 4]}</svg>
                  </span>
                  <div>
                    <h3 className="text-[21px] sm:text-[26px] font-semibold leading-[1.2] tracking-tight" style={text}>{title}</h3>
                    <p className={`mt-3 ${BODY}`} style={muted}>{body}</p>
                  </div>
                </Tile>
              ))}
            </div>
          </section>

          {/* ── O'lchamlar: 4 ta bir xil kartochka ── */}
          <section id="olchamlar" className="scroll-mt-24 pt-16 sm:pt-24">
            <Heading title={t.sizes.title} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[s4, s5, s6, s8].map((row) => (
                <SizeTile key={row[3]} row={row} />
              ))}
            </div>
            {/* Taqqoslash: 4 ta o'lcham yonma-yon */}
            <div className="mt-3 grid lg:grid-cols-[1.6fr_1fr] gap-3">
              <div className="group relative rounded-[28px] overflow-hidden min-h-[220px] sm:min-h-[300px] bg-white" style={{ boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.09)" }} onMouseMove={trackCursor}>
                <div className={`${ZOOM_CLS} group-hover:scale-[1.8]`} style={ZOOM_STYLE}>
                  <Image src={PH("sizes-lineup-studio")} alt="Easy Drip Plus 4, 5, 6 va 8 mm ignalar qadoqlari yonma-yon" fill sizes="(max-width: 1024px) 95vw, 60vw" className="object-cover" />
                </div>
              </div>
              <Tile className="flex flex-col justify-between gap-6">
                <p className="text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.05]" style={text}>{rich(t.sizes.packTitle, { color: ORANGE })}</p>
                <p className={BODY} style={muted}>{t.sizes.pack}</p>
              </Tile>
            </div>
          </section>

          {/* ── Xususiyatlar: 4 ta kartochka ── */}
          <section id="yechim" className="scroll-mt-24 pt-16 sm:pt-24">
            <Heading title={t.features.title} />
            {/* Suratli kartochkalar: sichqoncha ustida surat yaqinlashadi va kursor turgan joyni kattalashtiradi */}
            <div className="grid md:grid-cols-2 gap-3">
              {t.features.items.map(([title, body], i) => (
                <div key={title} className="group relative rounded-[28px] overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-8" style={TILE}
                  onMouseMove={trackCursor}>
                  <div className={`${ZOOM_CLS} group-hover:scale-[1.6]`} style={ZOOM_STYLE}>
                    <Image src={PH(FEATURE_IMG[i])} alt={title} fill sizes="(max-width: 768px) 95vw, 48vw" className="object-cover" />
                  </div>
                  <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)" }} />
                  <h3 className="relative text-[24px] sm:text-[28px] font-semibold tracking-tight text-white max-w-[80%]">{title}</h3>
                  <div className="relative">
                    <p className="text-[17px] leading-[1.55] text-white/90 max-w-[460px]">{rich(body, { color: "#fff", fontWeight: 700 })}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Muammo (qizil ramka) → Yechim (yashil ramka), har biri suratli ── */}
          <section id="muammo" className="scroll-mt-24 pt-16 sm:pt-24">
            <Heading title={t.problem.title} className="lg:[&_h2]:max-w-none lg:[&_h2]:text-[34px] xl:[&_h2]:text-[36px]" />
            <div className="space-y-10 sm:space-y-12">
              {t.problem.items.map(([title, prob, sol], i) => (
                <div key={title}>
                  <h3 className="flex items-center gap-3 text-[24px] sm:text-[30px] font-semibold tracking-tight mb-4 px-1" style={text}>
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0" style={{ background: ORANGE }}>{i + 1}</span>
                    {title}
                  </h3>
                  <div className="relative grid md:grid-cols-2 gap-3 md:gap-5">
                    {[[prob, RED, t.problem.colProblem, PROBLEM_IMG[i][0], "✕"], [sol, GREEN, t.problem.colSolution, PROBLEM_IMG[i][1], "✓"]].map(([body, c, label, img, mark], k) => (
                      <div key={k} className="rounded-[28px] overflow-hidden flex flex-col" style={{ border: `2.5px solid ${c}`, backgroundColor: k ? "rgba(61,184,81,0.06)" : "rgba(229,56,59,0.05)" }}>
                        <div className="relative aspect-[16/10]">
                          <Image src={PH(img)} alt={`${title} — ${label}`} fill sizes="(max-width: 768px) 95vw, 48vw" className="object-cover" />
                          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 text-sm font-bold text-white shadow-md" style={{ background: c }}>
                            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-xs" style={{ color: c }}>{mark}</span>{label}
                          </span>
                        </div>
                        <p className={`p-5 sm:p-7 ${BODY}`} style={k ? text : muted}>{rich(body, { color: k ? GREEN : RED, fontWeight: 700 })}</p>
                      </div>
                    ))}
                    {/* Muammodan yechimga o'q */}
                    <span className="hidden md:flex absolute left-1/2 top-[calc(50%-24px)] -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center text-white shadow-lg z-10" style={{ background: GREEN }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Kirish chuqurligi: tor asos va Hextra Tech asosi taqqoslovi */}
            <Tile className="mt-3 !p-3">
              <h3 className={`${H3} px-3 pt-3 pb-5 sm:px-5 sm:pt-5`} style={text}>{t.problem.depth.title}</h3>
              <div className="relative rounded-[20px] overflow-hidden aspect-[16/9] sm:aspect-[21/9]" style={{ backgroundColor: "var(--bg)" }}>
                <Image src={PH("depth-compare-v4")} alt={`${t.problem.depth.left}. ${t.problem.depth.right}`} fill sizes="(max-width: 1320px) 95vw, 1260px" className="object-cover" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {[[t.problem.depth.left, ORANGE, "✕"], [t.problem.depth.right, GREEN, "✓"]].map(([s, c, mark]) => (
                  <p key={s} className="rounded-2xl p-4 sm:p-5 flex gap-3 text-[17px] font-semibold leading-snug" style={{ backgroundColor: "var(--bg)", ...text }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm text-white" style={{ background: c }}>{mark}</span>{s}
                  </p>
                ))}
              </div>
              <p className="px-3 pt-4 pb-2 sm:px-5 text-[15px] leading-relaxed" style={muted}>{t.problem.depth.note}</p>
            </Tile>
          </section>

          {/* ── Nega EasyDrip ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.args.title} />
            <div className="grid md:grid-cols-3 gap-3">
              {t.args.items.map(([title, body, slogan], i) => (
                <Tile key={title} className="flex flex-col">
                  <span className="text-5xl font-light tracking-tight" style={{ color: i === 0 ? ORANGE : "var(--text)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={`${H3} mt-5 mb-3`} style={text}>{title}</h3>
                  <p className={`${BODY} flex-1`} style={muted}>{rich(body)}</p>
                  <p className="text-[17px] font-semibold mt-5" style={{ color: ORANGE }}>“{slogan}”</p>
                </Tile>
              ))}
            </div>
          </section>

          {/* ── Bilish muhim ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.honest.title} />
            <div className="grid lg:grid-cols-[1fr_2fr] gap-3">
              <Tile className="flex flex-col justify-between gap-6">
                <p className="text-lg sm:text-xl leading-[1.6]" style={text}>{t.honest.lead}</p>
                <p className="text-[15px] leading-relaxed" style={muted}>{t.honest.note}</p>
              </Tile>
              <Tile className="!py-3">
                {t.honest.items.map(([title, body], i) => (
                  <div key={title} className="py-5 grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-2 sm:gap-8 items-baseline"
                    style={i ? { borderTop: "1px solid var(--border-strong, #e5e5e5)" } : undefined}>
                    <h3 className="text-lg font-semibold flex items-baseline gap-3" style={text}>
                      <span className="flex-shrink-0" style={{ color: ORANGE }}>✕</span>{title}
                    </h3>
                    <p className={`${BODY} pl-7 sm:pl-0`} style={muted}>{rich(body)}</p>
                  </div>
                ))}
              </Tile>
            </div>
          </section>

          {/* ── Kim uchun ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.audience.title} />
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[21/9] mb-3" style={TILE}>
              <Image src={PH("pharmacy")} alt="Dorixona javonida EasyDrip Plus ignalari" fill sizes="(max-width: 1320px) 95vw, 1260px" className="object-cover" />
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {t.audience.items.map(([title, body]) => (
                <Tile key={title}>
                  <h3 className={H3} style={text}>{title}</h3>
                  <p className={`mt-3 ${BODY}`} style={muted}>{rich(body)}</p>
                </Tile>
              ))}
            </div>
          </section>

          {/* ── Qo'llash: 4 qadam ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.steps.title} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {t.steps.items.map(([title, body], i) => (
                <Tile key={title}>
                  <span className="text-5xl font-light tracking-tight" style={{ color: i === 3 ? GREEN : "var(--text)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={`${H3} mt-5 mb-2`} style={text}>{title}</h3>
                  <p className={BODY} style={muted}>{rich(body)}</p>
                </Tile>
              ))}
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {[["parts", "Igna asosi, ichki va tashqi qopqoq"], ["disposal", "Ishlatilgan ignani maxsus idishga tashlash"]].map(([n, alt]) => (
                <div key={n} className="relative rounded-[28px] overflow-hidden aspect-[4/3]" style={TILE}>
                  <Image src={PH(n)} alt={alt} fill sizes="(max-width: 640px) 95vw, 48vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>

          {/* ── Sertifikatlar ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.certs.title} />
            <div className="grid lg:grid-cols-[1fr_2fr] gap-3">
              <Tile className="flex flex-col justify-between gap-8">
                <p className={BODY} style={muted}>{t.certs.lead}</p>
                <Image src="/partners/sandstone.png" alt="Sandstone Medical" width={160} height={60} className="object-contain h-12 w-auto" style={{ width: "auto" }} />
              </Tile>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CERTS.map(([name, sub]) => (
                  <Tile key={name}>
                    <p className="text-2xl sm:text-3xl font-semibold tracking-tight" style={text}>{name}</p>
                    <p className="text-[15px] mt-1" style={muted}>{sub}</p>
                  </Tile>
                ))}
              </div>
            </div>
          </section>

          {/* ── Fikrlar ── */}
          <section className="pt-16 sm:pt-24">
            <Heading title={t.reviews.title} />
            <div className="grid md:grid-cols-3 gap-3">
              {(REVIEWS.length ? REVIEWS : [null, null, null]).map((r, i) => (
                <Tile key={i} className="flex flex-col min-h-[200px]">
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
                </Tile>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="savollar" className="scroll-mt-24 pt-16 sm:pt-24">
            <Heading title={t.faq.title} />
            <div className="grid lg:grid-cols-2 gap-3 items-start">
              {faq.map(([q, a], i) => (
                <div key={q} className="rounded-[24px]" style={TILE}>
                  <button type="button" onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-5 px-6 sm:px-7 py-5 sm:py-6 text-left">
                    <span className="text-lg font-semibold tracking-tight" style={text}>{q}</span>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-xl leading-none flex-shrink-0 transition-transform"
                      style={{ background: "var(--bg)", color: ORANGE, transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {open === i && <p className={`px-6 sm:px-7 pb-7 -mt-1 ${BODY}`} style={muted}>{rich(a)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* ── Buyurtma: pastki banner (sarlavha + afzalliklar + forma) ── */}
          <section id="buyurtma" className="scroll-mt-24 pt-16 sm:pt-24">
            <div className="rounded-[32px] p-6 sm:p-10 lg:p-14" style={TILE}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <h2 className="text-[30px] sm:text-5xl font-semibold leading-[1.08] tracking-tight max-w-[640px]" style={text}>{t.order.title}</h2>
                <a href="tel:+998775504040" className={`${pill} text-white self-start`} style={{ background: ORANGE }}>+998 77 550-40-40</a>
              </div>
              <div className="mt-8 grid sm:grid-cols-3 gap-5">
                {t.order.perks.map((p, i) => (
                  <div key={p} className="flex items-center gap-4">
                    <span className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg)", color: ORANGE }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[i % 3]}</svg>
                    </span>
                    <span className="text-[17px] font-semibold leading-snug" style={text}>{p}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-14">
                <form onSubmit={submit} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input required value={form.ism} onChange={(e) => setForm({ ...form, ism: e.target.value })}
                      placeholder={t.order.name} className={inputCls} style={inputStyle} />
                    <input required type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                      placeholder={t.order.phone} className={inputCls} style={inputStyle} />
                  </div>
                  <textarea rows={3} value={form.xabar} onChange={(e) => setForm({ ...form, xabar: e.target.value })}
                    placeholder={t.order.org} className={inputCls} style={inputStyle} />
                  <button type="submit" disabled={status === "sending"}
                    className={`${pill} text-white w-full sm:w-auto disabled:opacity-60`} style={{ background: ORANGE }}>
                    {status === "sending" ? t.order.sending : t.order.submit}
                  </button>
                  {status === "ok" && <p className="text-base" style={{ color: GREEN }}>{t.order.ok}</p>}
                  {status === "err" && <p className="text-base" style={{ color: ORANGE }}>{t.order.err}</p>}
                </form>
                <div className="flex flex-col justify-between gap-6">
                  <p className={BODY} style={muted}>{rich(t.order.lead)}</p>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest" style={muted}>{t.order.call}</p>
                    <a href="tel:+998775504040" className="block text-3xl sm:text-4xl font-semibold tracking-tight mt-2 hover:opacity-70" style={text}>+998 77 550-40-40</a>
                  </div>
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
