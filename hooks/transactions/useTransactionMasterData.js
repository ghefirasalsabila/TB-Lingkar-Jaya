import { useCallback } from "react";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

const EMPTY_MASTER_DATA = {};

export function useTransactionMasterData(loadMasterData) {
  const loadData = useCallback(() => {
    if (!loadMasterData) {
      return EMPTY_MASTER_DATA;
    }

    return loadMasterData();
  }, [loadMasterData]);

  const masterDataState = useAsyncValueEffect({
    enabled: Boolean(loadMasterData),
    initialValue: EMPTY_MASTER_DATA,
    fallbackValue: EMPTY_MASTER_DATA,
    load: loadData,
  });

  return {
    value: masterDataState.value,
    loading: masterDataState.loading,
    error: masterDataState.error,
    reload: masterDataState.reload,
  };
}
