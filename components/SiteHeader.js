"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useLang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

const LANGS = [
  { code: "uz", label: "Uz", flag: "🇺🇿" },
  { code: "ru", label: "Ру", flag: "🇷🇺" },
  { code: "en", label: "En", flag: "🇬🇧" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/haqimizda" },
    { label: t.nav.catalog, href: "/katalog" },
    { label: t.nav.news || "Yangiliklar", href: "/yangiliklar" },
  ];

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 site-header anim-fade-down">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
        {/* Logo */}
        <Logo size="md" variant="light" />

        {/* O'ng tomon: nav + til + Bog'lanish */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Navigatsiya o'ng tomonda */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-[15px] font-medium transition-colors duration-200 nav-link"
                  style={active ? { color: "#E8491D" } : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-btn w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
            aria-label="Tema almashtirish"
          >
            {theme === "dark" ? (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Til dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              onBlur={() => setTimeout(() => setLangOpen(false), 180)}
              className="flex items-center gap-2 text-sm font-semibold lang-btn rounded-full px-3 py-2 transition-colors"
            >
              <span className="text-base leading-none">{current.flag}</span>
              <span>{current.label}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 rounded-xl overflow-hidden shadow-xl lang-dropdown anim-fade-down">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold transition-colors lang-item ${
                      lang === l.code ? "text-[#E8491D]" : ""
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bog'lanish — pill tugma */}
          <Link
            href="/aloqa"
            className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-[15px] font-medium contact-btn transition-all"
          >
            {t.nav.contact}
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full theme-btn transition-colors"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mobile-menu anim-fade-down">
          <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex flex-col gap-1">
            {[...navItems, { label: t.nav.contact, href: "/aloqa" }].map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-[15px] font-medium transition-colors mobile-link"
                  style={active ? { color: "#E8491D" } : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 mt-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setMobileOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors lang-item ${
                    lang === l.code ? "text-[#E8491D]" : ""
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
