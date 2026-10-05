export function resolveSiteUrl() {
  const configuredUrl = import.meta.env.VITE_APP_BASE_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "https://tblingkarjaya.com";
}

export function resolveAbsoluteAssetUrl(assetPath, siteUrl = resolveSiteUrl()) {
  if (!assetPath) {
    return siteUrl;
  }

  return new URL(assetPath, `${siteUrl}/`).toString();
}
