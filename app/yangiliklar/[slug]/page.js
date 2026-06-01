"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function formatDate(sana) {
  if (!sana) return "";
  return new Date(sana).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });
}

export default function YangilikDetailPage({ params }) {
  const { slug } = use(params);
  const [post, setPost] = useState(null);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetch(`/api/yangiliklar/${slug}`)
      .then(async (r) => {
        if (!r.ok) { setNotFoundState(true); return; }
        setPost(await r.json());
      })
      .catch(() => setNotFoundState(true));
  }, [slug]);

  if (notFoundState) notFound();

  if (!post) {
    return (
      <>
        <SiteHeader />
        <main className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "var(--bg)" }}>
          <p className="text-sm text-gray-400">Yuklanmoqda...</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[860px] mx-auto px-6 lg:px-10 pt-10 pb-24">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-muted, #888)" }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">Bosh sahifa</Link>
            <span>/</span>
            <Link href="/yangiliklar" className="hover:opacity-70 transition-opacity">Yangiliklar</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }} className="truncate max-w-[200px]">{post.sarlavha}</span>
          </nav>

          {/* Kategoriya + Sana */}
          <div className="flex items-center gap-3 mb-6">
            {post.kategoriya && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: post.kategoriya.rang || "#E8491D" }}
              >
                {post.kategoriya.nom}
              </span>
            )}
            <span className="text-sm font-light" style={{ color: "var(--text-muted, #888)" }}>
              {formatDate(post.sana)}
            </span>
            {post.muallif && (
              <>
                <span style={{ color: "var(--text-muted, #888)" }}>·</span>
                <span className="text-sm font-light" style={{ color: "var(--text-muted, #888)" }}>
                  ✍ {post.muallif}
                </span>
              </>
            )}
          </div>

          {/* Sarlavha */}
          <h1
            className="text-3xl md:text-4xl font-medium leading-[1.15] tracking-tight mb-8"
            style={{ color: "var(--text)" }}
          >
            {post.sarlavha}
          </h1>

          {/* Muqova rasm */}
          {post.muqovaRasmUrl && (
            <div className="relative w-full mb-10 overflow-hidden rounded-xl" style={{ height: "clamp(220px, 40vw, 480px)" }}>
              <Image src={post.muqovaRasmUrl} alt={post.sarlavha} fill style={{ objectFit: "cover" }} />
            </div>
          )}

          {/* Qisqa tavsif */}
          {post.qisqaTavsif && (
            <p
              className="text-lg font-light leading-relaxed mb-8 pb-8"
              style={{
                color: "var(--text-muted, #888)",
                borderBottom: "1px solid var(--border-strong, #e5e5e5)",
              }}
            >
              {post.qisqaTavsif}
            </p>
          )}

          {/* To'liq matn */}
          {post.toliqMatn ? (
            <div
              className="prose prose-lg max-w-none"
              style={{ color: "var(--text)" }}
              dangerouslySetInnerHTML={{ __html: post.toliqMatn }}
            />
          ) : (
            <p className="text-sm italic" style={{ color: "var(--text-muted, #888)" }}>
              To'liq matn mavjud emas.
            </p>
          )}

          {/* Orqaga tugma */}
          <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border-strong, #e5e5e5)" }}>
            <Link
              href="/yangiliklar"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#E8491D" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Barcha yangiliklarga qaytish
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
