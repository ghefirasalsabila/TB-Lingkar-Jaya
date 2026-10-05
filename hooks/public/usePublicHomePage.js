import { useCallback, useMemo } from "react";
import { getPublicSummary } from "../../lib/api/public";
import { resolveAbsoluteAssetUrl, resolveSiteUrl } from "../../lib/site";
import { formatCurrency } from "../../lib/formatters";
import {
  getHighlightedProducts,
  getStartingPrice,
  isIgnorablePublicDataError
} from "../../features/public/public-utils";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

const EMPTY_PUBLIC_SUMMARY = null;
const OG_IMAGE_PATH = "/og-image.png";

export function usePublicHomePage() {
  const loadSummary = useCallback(() => getPublicSummary(), []);
  const summaryState = useAsyncValueEffect({
    initialValue: EMPTY_PUBLIC_SUMMARY,
    fallbackValue: EMPTY_PUBLIC_SUMMARY,
    load: loadSummary,
    errorMessage: "Gagal memuat informasi publik",
  });

  const summary = summaryState.value;
  const highlightedProducts = useMemo(() => getHighlightedProducts(summary), [summary]);
  const visibleError = isIgnorablePublicDataError(summaryState.error) ? "" : summaryState.error;
  const totalProducts = Number(summary?.totalProducts || 0);
  const startingPrice = useMemo(() => getStartingPrice(highlightedProducts), [highlightedProducts]);
  const startingPriceLabel = startingPrice > 0 ? formatCurrency(startingPrice) : "-";
  const siteUrl = resolveSiteUrl();
  const ogImageUrl = resolveAbsoluteAssetUrl(OG_IMAGE_PATH, siteUrl);

  return {
    loading: summaryState.loading,
    error: visibleError,
    highlightedProducts,
    totalProducts,
    startingPriceLabel,
    siteUrl,
    ogImageUrl,
  };
}
