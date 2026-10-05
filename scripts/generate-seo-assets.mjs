import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://tblingkarjaya.com";

async function main() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.resolve(currentDir, "../public");

  const robotsContent = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /login",
    "Disallow: /forgot-password",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    ""
  ].join("\n");

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, "robots.txt"), robotsContent, "utf8");
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemapContent, "utf8");
}

await main();
