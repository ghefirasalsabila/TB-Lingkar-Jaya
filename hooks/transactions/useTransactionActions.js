import { useState } from "react";
import { toast } from "sonner";
import { downloadBrowserFile } from "../../lib/browser-file";
import { useConfirmableAction } from "../shared/useConfirmableAction";

function hasMinimumVoidReasonWords(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length >= 3;
}

export function useTransactionActions({
  isOwner,
  listState,
  formState,
  reloadMasterData,
  createItem,
  updateItem,
  voidItem,
  downloadReceipt,
  receiptFileName,
  emptyItemsError,
  toPayload,
}) {
  const [saving, setSaving] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const voidAction = useConfirmableAction({
    initialTarget: "",
    beforeConfirm: () => listState.setError(""),
    onConfirm: async (targetId) => {
      const trimmedReason = voidReason.trim();
      if (trimmedReason && !hasMinimumVoidReasonWords(trimmedReason)) {
        toast.error("Alasan pembatalan minimal 3 kata.");
        throw new Error("VOID_REASON_TOO_SHORT");
      }
      await voidItem(targetId, trimmedReason ? { reason: trimmedReason } : {});
      await Promise.all([
        listState.reload(),
        reloadMasterData?.(),
      ]);
    },
    onSuccess: () => {
      setVoidReason("");
    },
    onError: () => {
      // Error action sudah ditampilkan lewat toast global di interceptor API.
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();
    listState.setError("");

    try {
      setSaving(true);
      const payload = toPayload(formState.form);
      if (payload.items.length === 0) {
        toast.error(emptyItemsError);
        return;
      }

      if (formState.editingId) {
        await updateItem(formState.editingId, payload);
      } else {
        await createItem(payload);
      }

      formState.resetForm();
      await Promise.all([
        listState.reload(),
        reloadMasterData?.(),
      ]);
    } catch {
      // Error submit sudah ditampilkan lewat toast global di interceptor API.
    } finally {
      setSaving(false);
    }
  }

  function requestVoid(id) {
    if (!isOwner) return;
    voidAction.request(id);
    setVoidReason("");
  }

  function handleVoidDialogOpenChange(open) {
    if (!open) {
      voidAction.clear();
      setVoidReason("");
    }
  }

  async function handleDownloadReceipt(id) {
    listState.setError("");

    try {
      const { blob, fileName } = await downloadReceipt(id);
      downloadBrowserFile(blob, fileName || receiptFileName(id));
    } catch {
      // Error download sudah ditampilkan lewat toast global di interceptor API.
    }
  }

  return {
    saving,
    voiding: voidAction.running,
    voidTargetId: voidAction.target,
    voidReason,
    setVoidReason,
    handleSubmit,
    requestVoid,
    handleVoidDialogOpenChange,
    confirmVoid: voidAction.confirm,
    handleDownloadReceipt,
  };
}
