"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useLang } from "@/lib/i18n";

export default function SiteFooter() {
  const { t, lang } = useLang();
  const L = (uz, ru, en) => (lang === "ru" ? ru : lang === "en" && en ? en : uz);

  return (
    <footer style={{ backgroundColor: "#111111", color: "#e5e5e5" }}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">

        {/* === YUQORI QISM === */}
        <div className="pt-12 sm:pt-20 pb-10 sm:pb-16 flex flex-col lg:flex-row lg:justify-between gap-10 sm:gap-14">

          {/* Chap — email + 3 ustun */}
          <div className="flex-1">
            <p className="text-sm font-light mb-4 sm:mb-5" style={{ color: "#555" }}>
              {L("Elektron pochta", "Электронная почта", "Email")}
            </p>

            {/* Email — kichikroq mobilda */}
            <a
              href="mailto:info@ummed.uz"
              className="block text-[28px] sm:text-[40px] lg:text-[56px] font-light leading-none tracking-tight mb-8 sm:mb-14 transition-opacity hover:opacity-60"
              style={{ color: "#e5e5e5" }}
            >
              info@ummed.uz
            </a>

            {/* 3 ustun: aloqa uchun | manzil | ish vaqti */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-light mb-3" style={{ color: "#444" }}>
                  {L("Aloqa uchun", "Для связи", "Contact")}
                </p>
                <a
                  href="tel:+998775504040"
                  className="text-sm font-light transition-opacity hover:opacity-60"
                  style={{ color: "#999" }}
                >
                  +998 77 550-40-40
                </a>
              </div>
              <div>
                <p className="text-xs font-light mb-3" style={{ color: "#444" }}>
                  {L("Manzil", "Адрес", "Address")}
                </p>
                <p className="text-sm font-light leading-relaxed" style={{ color: "#999" }}>
                  {t.footer.address}
                </p>
              </div>
              <div>
                <p className="text-xs font-light mb-3" style={{ color: "#444" }}>
                  {L("Ish vaqti", "Рабочее время", "Working Hours")}
                </p>
                <p className="text-sm font-light" style={{ color: "#999" }}>
                  {t.footer.workHours}
                </p>
              </div>
            </div>
          </div>

          {/* O'ng — ijtimoiy tarmoqlar */}
          <div className="flex flex-col gap-5 lg:items-end lg:pt-14">
            {[
              { label: "Telegram",  href: "https://t.me/ummeduz" },
              { label: "Instagram", href: "https://www.instagram.com/ummed_uz/" },
              { label: "YouTube",   href: "https://www.youtube.com/channel/UCPE1FJuYNkMyEehQkEh01CQ" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base font-light transition-opacity hover:opacity-50 group"
                style={{ color: "#e5e5e5" }}
              >
                {s.label}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* === PASTKI QISM — divider + logo + copyright === */}
        <div
          className="py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Asosiy logo */}
          <Logo size="md" variant="dark" />

          {/* Copyright */}
          <p className="text-xs font-light" style={{ color: "#3a3a3a" }}>
            © 2026 Ummed. {L("Barcha huquqlar himoyalangan", "Все права защищены", "All rights reserved")}
          </p>
        </div>

      </div>
    </footer>
  );
}
