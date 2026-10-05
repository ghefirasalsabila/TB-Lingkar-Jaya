import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../../lib/api-error";

export function useAsyncValueEffect({
  enabled = true,
  initialValue,
  fallbackValue = initialValue,
  load,
  errorMessage = "",
}) {
  const initialValueRef = useRef(initialValue);
  const fallbackValueRef = useRef(fallbackValue);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const reloadResolversRef = useRef([]);

  useEffect(() => {
    initialValueRef.current = initialValue;
    fallbackValueRef.current = fallbackValue;
  }, [fallbackValue, initialValue]);

  const reload = useCallback(() => {
    if (!enabled) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      reloadResolversRef.current.push(resolve);
      setReloadKey((previous) => previous + 1);
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let cancelled = false;

    async function loadValue() {
      setLoading(true);
      setError("");

      try {
        const nextValue = await load();
        if (!cancelled) {
          setValue(nextValue ?? initialValueRef.current);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(errorMessage ? getApiErrorMessage(requestError, errorMessage) : "");
          setValue(fallbackValueRef.current);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          const pendingResolvers = reloadResolversRef.current;
          reloadResolversRef.current = [];
          pendingResolvers.forEach((resolve) => resolve());
        }
      }
    }

    void loadValue();

    return () => {
      cancelled = true;
    };
  }, [enabled, errorMessage, load, reloadKey]);

  return {
    value,
    loading: enabled ? loading : false,
    error,
    reload,
    setValue,
    setLoading,
    setError,
  };
}
