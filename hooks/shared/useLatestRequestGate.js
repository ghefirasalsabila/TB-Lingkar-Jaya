import { useCallback, useRef } from "react";

export function useLatestRequestGate() {
  const latestRequestIdRef = useRef(0);

  const beginRequest = useCallback(() => {
    latestRequestIdRef.current += 1;
    return latestRequestIdRef.current;
  }, []);

  const isLatestRequest = useCallback(
    (requestId) => latestRequestIdRef.current === requestId,
    [],
  );

  return {
    beginRequest,
    isLatestRequest,
  };
}
