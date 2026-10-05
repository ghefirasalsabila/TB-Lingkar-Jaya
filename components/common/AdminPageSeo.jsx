import { Helmet } from "react-helmet-async";
import { buildPageTitle } from "../../constants/brand";
import { resolveSiteUrl } from "../../lib/site";

export function AdminPageSeo({ title, description, path }) {
  const siteUrl = resolveSiteUrl();
  const normalizedPath = path?.startsWith("/") ? path : path ? `/${path}` : "";
  const canonicalUrl = normalizedPath ? `${siteUrl}${normalizedPath}` : null;

  return (
    <Helmet>
      <title>{buildPageTitle(title)}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content="noindex, nofollow, noarchive" />
      <meta name="theme-color" content="#0f766e" />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
    </Helmet>
  );
}
