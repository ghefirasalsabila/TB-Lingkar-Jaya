import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "../../lib/api-error";
import { scheduleDeferredTask } from "../../lib/browser-timing";
import { useLatestRequestGate } from "./useLatestRequestGate";

function parsePositiveInt(value, fallbackValue) {
  const parsedValue = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
}

export function usePaginatedCollection({
  defaultPage,
  defaultLimit,
  fetchPage,
  errorMessage,
  initialItems = [],
  enabled = true,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState(initialItems);
  const page = parsePositiveInt(searchParams.get("page"), defaultPage);
  const searchQuery = searchParams.get("search") || "";
  const [paginationMeta, setPaginationMeta] = useState({
    page: defaultPage,
    limit: defaultLimit,
    totalItems: initialItems.length,
  });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const { beginRequest, isLatestRequest } = useLatestRequestGate();

  const reload = useCallback(async ({
    page: nextPage = page,
    limit: nextLimit = defaultLimit,
    search: nextSearch = searchQuery,
  } = {}) => {
    const requestId = beginRequest();
    setLoading(true);
    setError("");

    try {
      const response = await fetchPage({
        page: nextPage,
        limit: nextLimit,
        search: nextSearch,
      });

      if (!isLatestRequest(requestId)) {
        return;
      }

      const nextItems = Array.isArray(response?.data) ? response.data : [];

      setItems(nextItems);
      setPaginationMeta(
        response?.meta || {
          page: nextPage,
          limit: nextLimit,
          totalItems: nextItems.length,
        },
      );
    } catch (requestError) {
      if (!isLatestRequest(requestId)) {
        return;
      }

      setError(getApiErrorMessage(requestError, errorMessage));
    } finally {
      if (isLatestRequest(requestId)) {
        setLoading(false);
      }
    }
  }, [beginRequest, defaultLimit, errorMessage, fetchPage, isLatestRequest, page, searchQuery]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return scheduleDeferredTask(reload);
  }, [enabled, reload]);

  function handleSearchChange(value) {
    const nextParams = new URLSearchParams(searchParams);
    const normalizedValue = value.trim();

    if (normalizedValue) {
      nextParams.set("search", normalizedValue);
    } else {
      nextParams.delete("search");
    }

    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  function handlePageChange(nextPage) {
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage > defaultPage) {
      nextParams.set("page", String(nextPage));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams, { replace: true });
  }

  return {
    items,
    setItems,
    searchQuery,
    page,
    paginationMeta,
    loading,
    error,
    setError,
    setPage: handlePageChange,
    handleSearchChange,
    reload,
  };
}
