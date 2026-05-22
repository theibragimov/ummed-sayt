"use client";
import Reveal from "./Reveal";

// Viloyatlar bo'yicha pulsatsiya nuqtalari (viewBox 900x580 koordinatlar)
const DOTS = [
  { id: "toshkent",    x: 632, y: 198, delay: 0    },
  { id: "namangan",   x: 730, y: 175, delay: 0.5  },
  { id: "andijon",    x: 790, y: 210, delay: 1.0  },
  { id: "fargona",    x: 760, y: 240, delay: 1.5  },
  { id: "samarkand",  x: 500, y: 310, delay: 0.3  },
  { id: "buxoro",     x: 330, y: 320, delay: 0.8  },
  { id: "navoiy",     x: 420, y: 270, delay: 1.3  },
  { id: "jizzax",     x: 560, y: 258, delay: 0.6  },
  { id: "sirdaryo",   x: 590, y: 220, delay: 1.1  },
  { id: "qashqa",     x: 490, y: 380, delay: 1.6  },
  { id: "surxon",     x: 530, y: 460, delay: 0.4  },
  { id: "xorazm",     x: 216, y: 246, delay: 0.9  },
  { id: "nukus",      x: 140, y: 185, delay: 1.4  },
];

export default function UzbekistanMap() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Label + sarlavha */}
        <Reveal variant="up" className="mb-12">
          <span className="section-label">Hamkorlik</span>
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-tight mt-6"
            style={{ color: "var(--text)" }}
          >
            Butun O'zbekiston bo'ylab{" "}
            <span style={{ color: "#E8491D" }}>550+</span>{" "}
            dan ortiq hamkorlar
          </h2>
        </Reveal>

        {/* Xarita */}
        <Reveal variant="up" delay={120}>
          <div className="max-w-2xl">
            <svg
              viewBox="0 0 900 580"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* ===== QORAQALPOG'ISTON ===== */}
              <path d="
                M 68,38 L 320,28 L 360,55 L 375,100 L 370,155
                L 355,195 L 330,225 L 295,252 L 258,268
                L 220,272 L 190,260 L 165,238 L 145,210
                L 118,185 L 92,165 L 72,140 L 58,108 L 58,70 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* Orol dengizi qoldiqlari (oq bo'shliq) */}
              <path d="M 68,80 L 90,72 L 100,95 L 85,118 L 65,110 Z"
                fill="var(--bg)" />
              <path d="M 58,120 L 75,128 L 72,148 L 55,140 Z"
                fill="var(--bg)" />

              {/* ===== XORAZM ===== */}
              <path d="
                M 190,260 L 220,272 L 230,295 L 218,318
                L 195,322 L 172,308 L 168,285 L 178,268 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== NAVOIY ===== */}
              <path d="
                M 295,252 L 355,195 L 395,200 L 440,210
                L 478,228 L 492,260 L 485,302 L 458,325
                L 420,335 L 375,330 L 340,315 L 308,292 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== BUXORO ===== */}
              <path d="
                M 230,295 L 295,252 L 308,292 L 310,340
                L 295,385 L 265,405 L 228,400 L 205,375
                L 192,342 L 195,322 L 218,318 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== SAMARKAND ===== */}
              <path d="
                M 458,325 L 485,302 L 520,305 L 548,320
                L 552,358 L 535,385 L 505,395 L 475,385
                L 452,362 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== JIZZAX ===== */}
              <path d="
                M 492,260 L 535,248 L 572,255 L 590,278
                L 582,308 L 558,325 L 520,305 L 485,302 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== SIRDARYO ===== */}
              <path d="
                M 572,255 L 608,238 L 638,242 L 650,265
                L 635,288 L 608,295 L 582,285 L 575,268 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== TOSHKENT ===== */}
              <path d="
                M 608,238 L 638,200 L 668,190 L 700,195
                L 712,220 L 705,248 L 680,262 L 650,265
                L 635,250 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== NAMANGAN ===== */}
              <path d="
                M 668,168 L 710,158 L 748,162 L 762,182
                L 755,205 L 728,215 L 700,210 L 682,195
                L 672,178 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== FARG'ONA ===== */}
              <path d="
                M 728,215 L 760,208 L 790,218 L 808,242
                L 800,265 L 775,278 L 748,272 L 730,255
                L 725,235 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== ANDIJON ===== */}
              <path d="
                M 762,182 L 800,178 L 828,192 L 838,218
                L 820,238 L 800,242 L 778,230 L 760,215 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== QASHQADARYO ===== */}
              <path d="
                M 420,335 L 458,325 L 452,362 L 475,385
                L 468,425 L 448,452 L 415,460 L 382,448
                L 360,420 L 355,385 L 375,355 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== SURXONDARYO ===== */}
              <path d="
                M 448,452 L 475,440 L 505,448 L 525,472
                L 520,505 L 500,525 L 472,528 L 448,512
                L 435,488 L 438,465 Z
              " fill="var(--uz-fill)" stroke="var(--uz-stroke)" strokeWidth="1.2" />

              {/* ===== ANIMATSIYALI NUQTALAR ===== */}
              {DOTS.map((dot) => (
                <g key={dot.id}>
                  {/* Pulsatsiya halqasi */}
                  <circle cx={dot.x} cy={dot.y} r="3" fill="none"
                    stroke="#E8491D" strokeWidth="0.8">
                    <animate attributeName="r"
                      values="2;7;2" dur="2.5s"
                      begin={`${dot.delay}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity"
                      values="0.9;0;0.9" dur="2.5s"
                      begin={`${dot.delay}s`} repeatCount="indefinite" />
                  </circle>
                  {/* Ichki to'q nuqta */}
                  <circle cx={dot.x} cy={dot.y} r="2.8" fill="#E8491D">
                    <animate attributeName="opacity"
                      values="1;0.6;1" dur="2.5s"
                      begin={`${dot.delay}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}

              <style>{`
                :root { --uz-fill: #e0e0e0; --uz-stroke: #ffffff; }
                html[data-theme="dark"] { --uz-fill: #2e2e2e; --uz-stroke: #181818; }
              `}</style>
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
