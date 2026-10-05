import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPublicCategories, getPublicProducts } from "../../lib/api/public";
import { getApiErrorMessage } from "../../lib/api-error";
import { scheduleDeferredTask } from "../../lib/browser-timing";
import { resolveAbsoluteAssetUrl, resolveSiteUrl } from "../../lib/site";
import { isIgnorablePublicDataError } from "../../features/public/public-utils";
import { useLatestRequestGate } from "../shared/useLatestRequestGate";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

const PUBLIC_PRODUCTS_DEFAULT_PAGE = 1;
const PUBLIC_PRODUCTS_DEFAULT_LIMIT = 12;
const OG_IMAGE_PATH = "/og-image.png";
const EMPTY_PAGINATION_META = {
  page: PUBLIC_PRODUCTS_DEFAULT_PAGE,
  limit: PUBLIC_PRODUCTS_DEFAULT_LIMIT,
  totalItems: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

function parsePositiveInt(value, fallbackValue) {
  const parsedValue = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
}

export function usePublicProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategoryId = searchParams.get("categoryId") || "";
  const [products, setProducts] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(EMPTY_PAGINATION_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draftSearchQuery, setDraftSearchQuery] = useState(initialSearch);
  const [draftCategoryId, setDraftCategoryId] = useState(initialCategoryId);
  const { beginRequest, isLatestRequest } = useLatestRequestGate();
  const page = parsePositiveInt(searchParams.get("page"), PUBLIC_PRODUCTS_DEFAULT_PAGE);
  const filters = useMemo(() => ({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
  }), [searchParams]);

  useEffect(() => {
    return scheduleDeferredTask(() => {
      setDraftSearchQuery(filters.search);
      setDraftCategoryId(filters.categoryId);
    });
  }, [filters.categoryId, filters.search]);

  const categoryState = useAsyncValueEffect({
    initialValue: [],
    fallbackValue: [],
    load: getPublicCategories,
    errorMessage: "Gagal memuat kategori produk",
  });

  const loadProducts = useCallback(async () => {
    const requestId = beginRequest();
    setLoading(true);
    setError("");

    try {
      const response = await getPublicProducts({
        page,
        limit: PUBLIC_PRODUCTS_DEFAULT_LIMIT,
        search: filters.search,
        categoryId: filters.categoryId,
      });

      if (!isLatestRequest(requestId)) {
        return;
      }

      setProducts(Array.isArray(response?.data) ? response.data : []);
      setPaginationMeta(response?.meta || EMPTY_PAGINATION_META);
    } catch (requestError) {
      if (!isLatestRequest(requestId)) {
        return;
      }

      setError(getApiErrorMessage(requestError, "Gagal memuat daftar produk"));
    } finally {
      if (isLatestRequest(requestId)) {
        setLoading(false);
      }
    }
  }, [beginRequest, filters.categoryId, filters.search, isLatestRequest, page]);

  useEffect(() => scheduleDeferredTask(loadProducts), [loadProducts]);

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "Semua kategori" },
      ...categoryState.value.map((category) => ({
        value: category.id,
        label: `${category.name} (${category.productCount})`,
      })),
    ],
    [categoryState.value],
  );

  const siteUrl = resolveSiteUrl();
  const ogImageUrl = resolveAbsoluteAssetUrl(OG_IMAGE_PATH, siteUrl);
  const activeFilterCount = Number(Boolean(filters.search)) + Number(Boolean(filters.categoryId));
  const visibleError = isIgnorablePublicDataError(error) ? "" : error;
  const visibleCategoriesError = isIgnorablePublicDataError(categoryState.error)
    ? ""
    : categoryState.error;

  function applyFilters(event) {
    event?.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    const normalizedSearch = draftSearchQuery.trim();

    if (normalizedSearch) {
      nextParams.set("search", normalizedSearch);
    } else {
      nextParams.delete("search");
    }

    if (draftCategoryId) {
      nextParams.set("categoryId", draftCategoryId);
    } else {
      nextParams.delete("categoryId");
    }

    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  function resetFilters() {
    setDraftSearchQuery("");
    setDraftCategoryId("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    nextParams.delete("categoryId");
    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  function handlePageChange(nextPage) {
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage > PUBLIC_PRODUCTS_DEFAULT_PAGE) {
      nextParams.set("page", String(nextPage));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams, { replace: true });
  }

  return {
    products,
    paginationMeta,
    page,
    setPage: handlePageChange,
    loading,
    error: visibleError,
    draftSearchQuery,
    draftCategoryId,
    setDraftSearchQuery,
    setDraftCategoryId,
    applyFilters,
    resetFilters,
    categoryOptions,
    categoriesError: visibleCategoriesError,
    activeFilterCount,
    siteUrl,
    ogImageUrl,
  };
}
