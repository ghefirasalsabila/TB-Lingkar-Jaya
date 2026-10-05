import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { downloadBrowserFile } from "../../lib/browser-file";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

export function useTransactionDetailPage({
  backPath,
  fetchItem,
  fetchErrorMessage,
  downloadReceipt,
  receiptFileName,
}) {
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const loadItem = useCallback(() => fetchItem(id), [fetchItem, id]);
  const detailState = useAsyncValueEffect({
    enabled: Boolean(id),
    initialValue: null,
    fallbackValue: null,
    load: loadItem,
    errorMessage: fetchErrorMessage,
  });

  const handleBack = useCallback(() => {
    navigate(backPath);
  }, [backPath, navigate]);

  const handleDownloadReceipt = useCallback(async () => {
    const { blob, fileName } = await downloadReceipt(id);
    downloadBrowserFile(blob, fileName || receiptFileName(id));
  }, [downloadReceipt, id, receiptFileName]);

  return {
    id,
    item: detailState.value,
    loading: detailState.loading,
    error: detailState.error,
    handleBack,
    handleDownloadReceipt,
  };
}
