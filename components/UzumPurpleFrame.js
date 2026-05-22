"use client";

/**
 * Toza, to'q binafsha gradient frame — hech qanday kursor follower
 * yoki yon dog'lar yo'q. Faqat sof gradient va matn.
 */
export default function UzumPurpleFrame({ children }) {
  return (
    <div
      className="relative rounded-[33px] overflow-hidden px-6 py-14 lg:px-14 lg:py-16 text-center"
      style={{
        background:
          "linear-gradient(135deg, #4C1D95 0%, #3B0764 50%, #2E0561 100%)",
      }}
    >
      {children}
    </div>
  );
}
