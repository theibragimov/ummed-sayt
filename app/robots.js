export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/studio"] },
    sitemap: "https://www.ummed.uz/sitemap.xml",
  };
}
