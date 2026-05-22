"use client";

export default function HeroMedical3D() {
  return (
    <div
      className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center justify-center pointer-events-none select-none"
      style={{ width: "42%", right: "2%" }}
    >
      <div
        style={{
          animation: "floatMedical 4s ease-in-out infinite",
          filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.18)) drop-shadow(0 10px 20px rgba(232,73,29,0.08))",
        }}
      >
        <svg
          viewBox="0 0 340 520"
          width="320"
          height="490"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ===== SHISHA USTKI QISMI (bo'yin) ===== */}
          {/* Qopqoq */}
          <rect x="143" y="18" width="54" height="12" rx="4" fill="#c8d4dc" />
          <rect x="147" y="18" width="46" height="12" rx="4"
            fill="url(#capGrad)" />

          {/* Rezina tiqin */}
          <rect x="150" y="28" width="40" height="18" rx="3" fill="#2d2d2d" />
          <rect x="155" y="30" width="30" height="4" rx="2" fill="rgba(255,255,255,0.12)" />

          {/* Bo'yin */}
          <path d="M155 46 L155 72 Q155 78 148 80 L138 84 Q130 88 130 96 L130 108"
            stroke="#b8c8d4" strokeWidth="1" fill="none" />
          <path d="M185 46 L185 72 Q185 78 192 80 L202 84 Q210 88 210 96 L210 108"
            stroke="#b8c8d4" strokeWidth="1" fill="none" />
          <path d="M155 46 Q155 52 148 56 L138 62 Q130 68 130 78 L130 108"
            fill="url(#neckGrad)" stroke="none" />
          <path d="M185 46 L210 108" fill="none" />
          <path d="M155 46 L185 46 L210 108 L130 108 Z" fill="url(#neckBodyGrad)" />

          {/* ===== ASOSIY SHISHA TANA ===== */}
          {/* Orqa yuzasi (chuqurlik effekti) */}
          <rect x="120" y="108" width="100" height="280" rx="18"
            fill="url(#glassBack)" />

          {/* Asosiy shisha */}
          <rect x="122" y="110" width="96" height="276" rx="16"
            fill="url(#glassMain)" />

          {/* Chap reflex — yorug'lik */}
          <rect x="130" y="120" width="14" height="240" rx="7"
            fill="url(#leftReflex)" opacity="0.55" />

          {/* O'ng reflex */}
          <rect x="198" y="130" width="8" height="180" rx="4"
            fill="rgba(255,255,255,0.12)" />

          {/* Ichidagi suyuqlik */}
          <rect x="126" y="160" width="88" height="218" rx="12"
            fill="url(#liquidGrad)" opacity="0.82" />

          {/* Suyuqlik yuqori chegarasi (menisk) */}
          <ellipse cx="170" cy="160" rx="44" ry="7"
            fill="url(#meniscus)" opacity="0.6" />

          {/* Suyuqlik pufakchalari */}
          <circle cx="155" cy="230" r="3.5" fill="rgba(255,255,255,0.25)" />
          <circle cx="175" cy="260" r="2.5" fill="rgba(255,255,255,0.2)" />
          <circle cx="163" cy="295" r="2" fill="rgba(255,255,255,0.18)" />
          <circle cx="182" cy="210" r="2" fill="rgba(255,255,255,0.22)" />

          {/* ===== YORLIQ (Label) ===== */}
          <rect x="131" y="185" width="78" height="110" rx="6"
            fill="white" opacity="0.92" />
          <rect x="131" y="185" width="78" height="110" rx="6"
            fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

          {/* Yorliq kross chiziqlar */}
          <line x1="139" y1="203" x2="201" y2="203" stroke="#e8491d" strokeWidth="1.5" />

          {/* Ummed logosi yoriqlida */}
          <text x="170" y="220" textAnchor="middle"
            fontSize="8" fontWeight="700" fill="#E8491D"
            fontFamily="system-ui, sans-serif" letterSpacing="2">
            UMMED
          </text>

          {/* Preparatni nomi */}
          <text x="170" y="238" textAnchor="middle"
            fontSize="6.5" fontWeight="600" fill="#1a1a2e"
            fontFamily="system-ui, sans-serif">
            Infuzion eritma
          </text>

          {/* Tarkib */}
          <text x="170" y="255" textAnchor="middle"
            fontSize="5.5" fill="#666" fontFamily="system-ui, sans-serif">
            NaCl 0.9% / 500 ml
          </text>

          {/* Alt chiziq */}
          <line x1="139" y1="264" x2="201" y2="264" stroke="#eee" strokeWidth="1" />

          {/* Qo'shimcha info */}
          <text x="170" y="278" textAnchor="middle"
            fontSize="5" fill="#999" fontFamily="system-ui, sans-serif">
            Steril • Apirogen
          </text>

          <rect x="145" y="284" width="50" height="6" rx="2" fill="#E8491D" opacity="0.15" />
          <text x="170" y="289.5" textAnchor="middle"
            fontSize="4.5" fill="#E8491D" fontFamily="system-ui, sans-serif" fontWeight="600">
            ISO 9001 Sertifikatlangan
          </text>

          {/* ===== TUBI ===== */}
          <ellipse cx="170" cy="386" rx="50" ry="10"
            fill="url(#bottomEllipse)" />
          <rect x="122" y="380" width="96" height="8" rx="4"
            fill="url(#bottomRect)" />

          {/* Pastki plastik halqa */}
          <ellipse cx="170" cy="388" rx="48" ry="8"
            fill="url(#ringGrad)" />

          {/* ===== NAYCHALAR (TRUBKALAR) ===== */}
          {/* Qopqoqdan chiquvchi 2 naycha */}
          {/* Chap — qo'shish */}
          <line x1="160" y1="28" x2="160" y2="18" stroke="#5a7a8a" strokeWidth="3"
            strokeLinecap="round" />
          {/* O'ng — chiqarish */}
          <line x1="180" y1="28" x2="180" y2="18" stroke="#3a5a6a" strokeWidth="3"
            strokeLinecap="round" />

          {/* Pastdan chiquvchi trubka */}
          <path d="M170 388 Q170 420 165 440 Q160 460 158 490"
            stroke="#8aaebc" strokeWidth="5" strokeLinecap="round" fill="none"
            opacity="0.7" />
          {/* Trubka ichi */}
          <path d="M170 388 Q170 420 165 440 Q160 460 158 490"
            stroke="rgba(180,220,240,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Trubka oxiridagi tip */}
          <ellipse cx="157.5" cy="492" rx="5" ry="3" fill="#5a7a8a" />
          <ellipse cx="157.5" cy="492" rx="3" ry="2" fill="#8aaabc" />

          {/* Qisqich (klemma) trubkada */}
          <rect x="161" y="445" width="10" height="5" rx="2.5"
            fill="#E8491D" opacity="0.85" />

          {/* ===== GRADIENTLAR ===== */}
          <defs>
            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0eaf0" />
              <stop offset="100%" stopColor="#a8bcc8" />
            </linearGradient>

            <linearGradient id="neckBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c8d8e4" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#e8f2f8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#b0c4d0" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="neckGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d0e0ea" />
              <stop offset="100%" stopColor="#b8c8d4" />
            </linearGradient>

            <linearGradient id="glassBack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8aaab8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6a8a98" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="glassMain" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ccdde8" stopOpacity="0.85" />
              <stop offset="18%" stopColor="#e8f4fa" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f0f8fc" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#ddeef6" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#b8ccd8" stopOpacity="0.78" />
            </linearGradient>

            <linearGradient id="leftReflex" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8ddf0" stopOpacity="0.5" />
              <stop offset="30%" stopColor="#90c8e8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#68aed0" stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="meniscus" cx="50%" cy="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a0c8e0" stopOpacity="0.2" />
            </radialGradient>

            <linearGradient id="bottomEllipse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a0b8c4" />
              <stop offset="100%" stopColor="#7090a0" />
            </linearGradient>

            <linearGradient id="bottomRect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c0d4de" />
              <stop offset="100%" stopColor="#90a8b4" />
            </linearGradient>

            <linearGradient id="ringGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d0e2ec" />
              <stop offset="100%" stopColor="#8aaab8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Float animatsiya */}
      <style>{`
        @keyframes floatMedical {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-22px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}
