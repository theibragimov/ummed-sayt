"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

const PLACEHOLDER_ICONS = ["🏥", "📊", "🤝", "✅", "🎪", "🚚"];
const COLORS = ["#f0f4f8", "#f5f0f8", "#f0f8f2", "#fff8f0", "#f0f4f8", "#f5f0f8"];

function formatDate(sana) {
  if (!sana) return "";
  return new Date(sana).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });
}

export default function YangiliklarPage() {
  const { t, lang } = useLang();
  const n = t.news;
  const ru = lang === 'ru';
  const notUz = lang !== 'uz';

  const [postlar, setPostlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);

  useEffect(() => {
    fetch("/api/yangiliklar?holat=published")
      .then((r) => r.json())
      .then((data) => {
        setPostlar(Array.isArray(data) ? data : []);
        setYuklanmoqda(false);
      })
      .catch(() => setYuklanmoqda(false));
  }, []);

  const featured = postlar[0];
  const rest = postlar.slice(1);

  return (
    <>
      <SiteHeader />

      <main style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-24">

          {/* Sarlavha */}
          <Reveal variant="up" className="mb-14">
            <span className="section-label">{n.label}</span>
            <h1
              className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-6"
              style={{ color: "var(--text)" }}
            >
              {n.title}
            </h1>
          </Reveal>

          {yuklanmoqda ? (
            <div className="flex items-center justify-center py-24" style={{ color: "var(--text-muted, #888)" }}>
              <p className="text-sm font-light">Yuklanmoqda...</p>
            </div>
          ) : postlar.length === 0 ? (
            <div className="flex items-center justify-center py-24" style={{ color: "var(--text-muted, #888)" }}>
              <p className="text-sm font-light">Yangiliklar yo'q</p>
            </div>
          ) : (
            <>
              {/* Featured — katta birinchi yangilik */}
              {featured && (
                <Reveal variant="up" delay={80} className="mb-12">
                  <Link href={`/yangiliklar/${featured.slug}`} className="group block">
                    <div
                      className="w-full overflow-hidden mb-6 rounded-2xl"
                      style={{ height: "clamp(220px, 36vw, 520px)", backgroundColor: COLORS[0] }}
                    >
                      {featured.muqovaRasmUrl ? (
                        <div className="relative w-full h-full">
                          <Image src={featured.muqovaRasmUrl} alt={featured.sarlavha} fill style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-8xl">
                          {PLACEHOLDER_ICONS[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-light mb-3" style={{ color: "var(--text-muted, #888)" }}>
                          {formatDate(featured.sana)} &nbsp;·&nbsp; {featured.kategoriya?.nom || ""}
                        </p>
                        <h2
                          className="text-2xl md:text-3xl font-medium leading-[1.2] group-hover:opacity-70 transition-opacity"
                          style={{ color: "var(--text)" }}
                        >
                          {(ru && featured.sarlavhaRu) ? featured.sarlavhaRu : featured.sarlavha}
                        </h2>
                      </div>
                      <p
                        className="md:max-w-sm text-sm font-light leading-relaxed md:pt-9"
                        style={{ color: "var(--text-muted, #888)" }}
                      >
                        {(ru && featured.qisqaTavsifRu) ? featured.qisqaTavsifRu : featured.qisqaTavsif}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Divider */}
              {rest.length > 0 && (
                <div className="mb-12" style={{ height: 1, backgroundColor: "var(--border-strong, #e5e5e5)" }} />
              )}

              {/* Qolgan yangiliklar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {rest.map((item, idx) => (
                  <Reveal key={item.id} variant="up" delay={idx * 60}>
                    <Link href={`/yangiliklar/${item.slug}`} className="group block">
                      <div
                        className="w-full overflow-hidden mb-5 rounded-2xl"
                        style={{ height: 240, backgroundColor: COLORS[(idx + 1) % COLORS.length] }}
                      >
                        {item.muqovaRasmUrl ? (
                          <div className="relative w-full h-full">
                            <Image src={item.muqovaRasmUrl} alt={item.sarlavha} fill style={{ objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {PLACEHOLDER_ICONS[(idx + 1) % PLACEHOLDER_ICONS.length]}
                          </div>
                        )}
                      </div>

                      <p className="text-xs font-light mb-2" style={{ color: "var(--text-muted, #888)" }}>
                        {formatDate(item.sana)} &nbsp;·&nbsp; {item.kategoriya?.nom || ""}
                      </p>
                      <h3
                        className="text-lg font-medium leading-snug group-hover:opacity-70 transition-opacity"
                        style={{ color: "var(--text)" }}
                      >
                        {(ru && item.sarlavhaRu) ? item.sarlavhaRu : item.sarlavha}
                      </h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          )}

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
