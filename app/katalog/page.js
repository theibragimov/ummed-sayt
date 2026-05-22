"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const ALL_PRODUCTS = PRODUCTS;

const CATEGORIES = [
  { value: "hammasi", label: "Hammasi" },
  { value: "diagnostika", label: "Diagnostika" },
  { value: "nafas", label: "Nafas jihozlari" },
  { value: "yurak", label: "Yurak jihozlari" },
  { value: "mebel", label: "Tibbiy mebel" },
  { value: "sterilizatsiya", label: "Sterilizatsiya" },
];

export default function KatalogPage() {
  const [category, setCategory] = useState("hammasi");
  const [search, setSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (category !== "hammasi") {
      list = list.filter((p) => p.category === category);
    }

    return list;
  }, [category, search]);

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Qidiruv */}
      <div>
        <label
          className="block text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted, #888)" }}
        >
          Qidiruv
        </label>
        <input
          type="text"
          placeholder="Mahsulot nomi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 text-sm font-light focus:outline-none transition-colors"
          style={{
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border-strong, #e5e5e5)",
            color: "var(--text)",
          }}
        />
      </div>

      {/* Kategoriya */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted, #888)" }}
        >
          Kategoriya
        </p>
        <ul className="space-y-1">
          {CATEGORIES.map((c) => (
            <li key={c.value}>
              <button
                onClick={() => setCategory(c.value)}
                className="w-full text-left text-sm font-light px-4 py-2.5 transition-colors"
                style={
                  category === c.value
                    ? { color: "#E8491D", fontWeight: 500 }
                    : { color: "var(--text)" }
                }
              >
                {category === c.value && (
                  <span
                    className="inline-block w-1.5 h-1.5 mr-2 align-middle"
                    style={{ backgroundColor: "#E8491D" }}
                  />
                )}
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      {(category !== "hammasi" || search) && (
        <button
          onClick={() => { setCategory("hammasi"); setSearch(""); }}
          className="w-full text-xs py-2.5 font-light tracking-wide transition-colors"
          style={{
            border: "1px solid var(--border-strong, #e5e5e5)",
            color: "var(--text-muted, #888)",
          }}
        >
          Filtrni tozalash
        </button>
      )}
    </div>
  );

  return (
    <>
      <SiteHeader />

      <main className="flex-1" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-24">

          {/* Sarlavha */}
          <Reveal variant="up" className="mb-14">
            <span className="section-label">Katalog</span>
            <h1
              className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-6"
              style={{ color: "var(--text)" }}
            >
              Barcha mahsulotlar
            </h1>
            <p
              className="mt-4 text-base font-light"
              style={{ color: "var(--text-muted, #888)" }}
            >
              {filtered.length} ta mahsulot
            </p>
          </Reveal>

          {/* Mobile filter toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="text-sm font-medium px-5 py-2.5 transition-colors"
              style={{
                border: "1px solid var(--border-strong, #e5e5e5)",
                color: "var(--text)",
              }}
            >
              {mobileFilterOpen ? "Filtrni yopish" : "Filtr"}
            </button>
          </div>

          {mobileFilterOpen && (
            <div
              className="md:hidden p-6 mb-8"
              style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}
            >
              <FilterPanel />
            </div>
          )}

          <div className="flex gap-12">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-56 flex-shrink-0">
              <div className="sticky top-28">
                <FilterPanel />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-24"
                  style={{ color: "var(--text-muted, #888)" }}
                >
                  <p className="text-lg font-medium">Mahsulot topilmadi</p>
                  <p className="text-sm font-light mt-2">Filtr yoki qidiruvni o'zgartiring</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px"
                  style={{ border: "1px solid var(--border-strong, #e5e5e5)" }}>
                  {filtered.map((product, idx) => (
                    <Link
                      key={product.id}
                      href={`/katalog/${product.id}`}
                      className="group flex flex-col overflow-hidden transition-colors"
                      style={{
                        backgroundColor: "var(--bg)",
                        borderRight: "1px solid var(--border-strong, #e5e5e5)",
                        borderBottom: "1px solid var(--border-strong, #e5e5e5)",
                      }}
                    >
                      {/* Rasm */}
                      <div
                        className="relative flex items-center justify-center text-7xl transition-colors"
                        style={{
                          height: 220,
                          backgroundColor: "var(--card-bg, #f8f8f8)",
                        }}
                      >
                        {product.badge && (
                          <span
                            className="absolute top-4 left-4 text-xs font-medium px-3 py-1 text-white"
                            style={{
                              backgroundColor:
                                product.badge === "Yangi"
                                  ? "#3DB851"
                                  : product.badge === "Ommabop"
                                  ? "#E8491D"
                                  : "#6366f1",
                            }}
                          >
                            {product.badge}
                          </span>
                        )}
                        {product.img}
                      </div>

                      {/* Ma'lumot */}
                      <div className="p-6 flex flex-col flex-1">
                        <span
                          className="text-xs font-medium uppercase tracking-widest mb-2"
                          style={{ color: "#E8491D" }}
                        >
                          {CATEGORIES.find((c) => c.value === product.category)?.label}
                        </span>
                        <h3
                          className="text-base font-medium leading-snug mb-2"
                          style={{ color: "var(--text)" }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="text-sm font-light leading-relaxed flex-1 mb-6"
                          style={{ color: "var(--text-muted, #888)" }}
                        >
                          {product.desc}
                        </p>

                        <span
                          className="text-sm font-medium tracking-wide flex items-center gap-1 transition-colors group-hover:gap-2"
                          style={{ color: "var(--text)" }}
                        >
                          Batafsil
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M9 7h8v8" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
