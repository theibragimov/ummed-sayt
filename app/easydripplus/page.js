import EasyDripLanding from "@/components/EasyDripLanding";
import { FAQ } from "@/components/easydrip-content";

const SITE = "https://www.ummed.uz";
const URL_PATH = "/easydripplus";

const TITLE = "EasyDrip Plus — insulin shprits-ruchka ignalari (pen needles) | Ummed";
const DESCRIPTION =
  "EasyDrip Plus insulin shprits-ruchkalari uchun ignalar: 32G 4 mm, 31G 5 mm, 31G 6 mm, 31G 8 mm. Hextra Tech asosi, kattaroq qopqoqlar, ISO 13485, CE, FDA. O'zbekistonda rasmiy distribyutor — Ummed. Ulgurji narx dorixonalar uchun.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "EasyDrip", "Easy Drip", "EasyDrip Plus", "Hextra Tech",
    "insulin ignasi", "insulin ruchka ignasi", "shprits ruchka ignasi", "shprits ruchka uchun igna",
    "pen needles", "insulin pen needles", "32G 4mm igna",
    "иглы для шприц-ручек", "иглы для инсулиновых шприц-ручек", "игла для инсулиновой ручки", "пен иглы",
    "Ummed", "Toshkent", "Узбекистан",
  ],
  alternates: { canonical: URL_PATH },
  openGraph: {
    type: "website",
    url: URL_PATH,
    siteName: "Ummed",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    title: "EasyDrip Plus — har kuni insulin. Har bir detal muhim.",
    description: DESCRIPTION,
    images: [{ url: "/images/easydrip/photo/hero.jpg" }],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "EasyDrip Plus — insulin shprits-ruchka ignalari (Pen Needles)",
      alternateName: ["Easy Drip", "Иглы для шприц-ручек EasyDrip Plus"],
      description: DESCRIPTION,
      url: SITE + URL_PATH,
      image: SITE + "/images/easydrip/photo/hero.jpg",
      brand: { "@type": "Brand", name: "EasyDrip" },
      manufacturer: { "@type": "Organization", name: "Suzhou Sandstone Medical Devices Co., Ltd." },
      category: "Insulin pen needles",
      seller: { "@type": "Organization", name: "Ummed", url: SITE, telephone: "+998775504040" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.uz.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a.replace(/\*\*/g, "") },
      })),
    },
  ],
};

export default function EasyDripPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EasyDripLanding />
    </>
  );
}
