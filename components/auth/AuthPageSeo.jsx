import { Helmet } from "react-helmet-async";
import { resolveSiteUrl } from "../../lib/site";

export function AuthPageSeo({ path, title, description }) {
  const siteUrl = resolveSiteUrl();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow, noarchive" />
      <meta name="theme-color" content="#0f766e" />
      <link rel="canonical" href={`${siteUrl}${path}`} />
    </Helmet>
  );
}
