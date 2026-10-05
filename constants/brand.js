import brandData from "../../../shared/brand.json";

export const BRAND_NAME = brandData.name;
export const BRAND_SHORT_NAME = brandData.shortName;
export const BRAND_SLUG = brandData.slug;
export const BRAND_LOCATION_LABEL = brandData.locationLabel;
export const BRAND_PHONE_LINK = brandData.phoneLink;
export const BRAND_PHONE_LABEL = brandData.phoneLabel;
export const BRAND_LOGO_PUBLIC_PATH = brandData.logoPublicPath;

export function buildPageTitle(pageLabel) {
  return pageLabel ? `${pageLabel} | ${BRAND_NAME}` : BRAND_NAME;
}
