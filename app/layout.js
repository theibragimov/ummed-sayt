import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

// Inter — fallback (kirillca uchun)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Ummed — Tibbiy Jihozlar",
  description: "Sifatli tibbiy jihozlar yetkazib berish. Dorixonalar va shifokorlar uchun.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${inter.variable}`}>
      <head>
        {/* Satoshi shrifti — Fontshare CDN */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
