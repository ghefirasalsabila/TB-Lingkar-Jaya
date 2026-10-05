import { Helmet } from "react-helmet-async";
import { BRAND_LOCATION_LABEL, BRAND_NAME } from "../../constants/brand";
import { buildBusinessSchema } from "../../features/public/public-utils";

export function PublicPageSeo({ siteUrl, ogImageUrl, title, description, path = "/" }) {
  const businessSchema = buildBusinessSchema({ siteUrl, ogImageUrl });
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#0f766e" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={`${BRAND_NAME} di ${BRAND_LOCATION_LABEL}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImageUrl} />
      <meta property="twitter:image:alt" content={`${BRAND_NAME} di ${BRAND_LOCATION_LABEL}`} />
      <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
    </Helmet>
  );
}
