"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

const PLACEHOLDER_ICONS = ["🏥", "📊", "🤝", "✅", "🎪", "🚚"];
const COLORS = ["#f0f4f8", "#f5f0f8", "#f0f8f2", "#fff8f0", "#f0f4f8", "#f5f0f8"];

export default function YangiliklarPage() {
  const { t } = useLang();
  const n = t.news;

  const featured = n.items[0];
  const rest = n.items.slice(1);

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

          {/* Featured — katta birinchi yangilik */}
          <Reveal variant="up" delay={80} className="mb-12">
            <Link href={`/yangiliklar/${featured.id}`} className="group block">
              <div
                className="w-full overflow-hidden mb-6"
                style={{ height: "clamp(220px, 36vw, 520px)", backgroundColor: COLORS[0] }}
              >
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {PLACEHOLDER_ICONS[0]}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-light mb-3" style={{ color: "var(--text-muted, #888)" }}>
                    {featured.date} &nbsp;·&nbsp; {featured.category}
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-medium leading-[1.2] group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--text)" }}
                  >
                    {featured.title}
                  </h2>
                </div>
                <p
                  className="md:max-w-sm text-sm font-light leading-relaxed md:pt-9"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  {featured.desc}
                </p>
              </div>
            </Link>
          </Reveal>

          {/* Divider */}
          <div className="mb-12" style={{ height: 1, backgroundColor: "var(--border-strong, #e5e5e5)" }} />

          {/* Qolgan yangiliklar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {rest.map((item, idx) => (
              <Reveal key={item.id} variant="up" delay={idx * 60}>
                <Link href={`/yangiliklar/${item.id}`} className="group block">
                  <div
                    className="w-full overflow-hidden mb-5"
                    style={{ height: 240, backgroundColor: COLORS[idx + 1] }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {PLACEHOLDER_ICONS[idx + 1]}
                    </div>
                  </div>

                  <p className="text-xs font-light mb-2" style={{ color: "var(--text-muted, #888)" }}>
                    {item.date} &nbsp;·&nbsp; {item.category}
                  </p>
                  <h3
                    className="text-lg font-medium leading-snug group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--text)" }}
                  >
                    {item.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
