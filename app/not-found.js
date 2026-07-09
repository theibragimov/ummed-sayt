"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLang();
  const n = t.notFound;

  return (
    <>
      <SiteHeader />

      <main
        className="flex-1 flex items-center justify-center px-6"
        style={{ backgroundColor: "var(--bg)", minHeight: "70vh" }}
      >
        <div className="max-w-lg w-full text-center py-16 sm:py-24 anim-fade-up">
          <div
            className="mx-auto mb-8 w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(232,73,29,0.1)" }}
          >
            <svg
              className="w-9 h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8491D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>

          <h1
            className="text-2xl sm:text-[28px] font-medium tracking-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            {n.title}
          </h1>

          <p
            className="text-[15px] sm:text-base leading-relaxed mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            {n.message}
          </p>

          <Link
            href="/"
            className="hero-cta inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
          >
            {n.homeBtn}
          </Link>

          <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
            {n.contactText}{" "}
            <Link
              href="/aloqa"
              className="font-medium underline underline-offset-2"
              style={{ color: "#E8491D" }}
            >
              {n.contactLink}
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
