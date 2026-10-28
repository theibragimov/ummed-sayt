const SITE = "https://www.ummed.uz";

export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/easydripplus`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/katalog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/haqimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/aloqa`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/yangiliklar`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
}
