import { BRAND_LOCATION_LABEL, BRAND_NAME, BRAND_PHONE_LABEL, BRAND_PHONE_LINK, buildPageTitle } from "../../constants/brand";
export { formatCompactNumber } from "../../lib/formatters";

export const PUBLIC_SEO_TITLE = buildPageTitle();
export const PUBLIC_SEO_DESCRIPTION =
  `${BRAND_NAME} di ${BRAND_LOCATION_LABEL}. Tersedia material bangunan, PVC, paku, listrik, cat, dan kebutuhan proyek harian.`;
export const PUBLIC_PRODUCTS_SEO_TITLE = buildPageTitle("Daftar Produk");
export const PUBLIC_PRODUCTS_SEO_DESCRIPTION =
  `Daftar produk aktif ${BRAND_NAME} di ${BRAND_LOCATION_LABEL}, lengkap dengan kategori, harga jual, dan ketersediaan stok.`;
export const PUBLIC_NAV_ITEMS = [
  { label: "Beranda", to: "/", end: true },
  { label: "Produk", to: "/produk", end: false }
];

export function getHighlightedProducts(summary) {
  return Array.isArray(summary?.highlightedProducts) ? summary.highlightedProducts : [];
}

export function getStartingPrice(products) {
  if (products.length === 0) {
    return 0;
  }

  return products.reduce((lowest, item) => {
    const current = Number(item.sellPrice || 0);
    return current < lowest ? current : lowest;
  }, Number(products[0]?.sellPrice || 0));
}

export function isIgnorablePublicDataError(message) {
  if (typeof message !== "string" || message.length === 0) {
    return false;
  }

  return (
    message.includes("Invalid `prisma.") ||
    message.includes("does not exist in the current database") ||
    message.includes("The table `public.")
  );
}

export function buildBusinessSchema({ siteUrl, ogImageUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: BRAND_NAME,
    url: `${siteUrl}/`,
    image: ogImageUrl,
    description: PUBLIC_SEO_DESCRIPTION,
    telephone: BRAND_PHONE_LINK.replace("+62", "+62 "),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Prabumulih",
      addressCountry: "ID",
    },
  };
}
