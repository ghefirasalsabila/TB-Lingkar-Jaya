import { useCallback, useMemo } from "react";
import { getProductById } from "../../lib/api/products";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

export function useProductDetailPage(productId) {
  const loadDetail = useCallback(async () => getProductById(productId), [productId]);

  const state = useAsyncValueEffect({
    enabled: Boolean(productId),
    initialValue: null,
    fallbackValue: null,
    load: loadDetail,
    errorMessage: "Gagal memuat detail barang",
  });

  return useMemo(() => ({
    item: state.value || null,
    loading: state.loading,
    error: state.error,
  }), [state.error, state.loading, state.value]);
}
