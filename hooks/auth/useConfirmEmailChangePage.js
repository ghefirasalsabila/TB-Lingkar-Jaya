import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmEmailChangeRequest } from "../../lib/api/auth";
import { getApiErrorMessage } from "../../lib/api-error";
import { runSubmitAction } from "../shared/submit-action";

export function useConfirmEmailChangePage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  async function handleSubmit(event) {
    await runSubmitAction({
      event,
      setRunning: setLoading,
      beforeSubmit: () => {
        setError("");
      },
      onSubmit: async () => {
        if (!token) {
          setError("Token konfirmasi tidak ditemukan.");
          return;
        }

        await confirmEmailChangeRequest({ token });
        setCompleted(true);
      },
      onError: (submitError) => {
        setError(
          getApiErrorMessage(
            submitError,
            "Tautan konfirmasi email tidak valid atau sudah kedaluwarsa"
          )
        );
      },
    });
  }

  return {
    token,
    loading,
    completed,
    error,
    handleSubmit,
  };
}
