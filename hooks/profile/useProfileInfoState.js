import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser, updateCurrentUser } from "../../lib/api/users";
import { getApiErrorMessage } from "../../lib/api-error";
import { scheduleDeferredTask } from "../../lib/browser-timing";
import { useLatestRequestGate } from "../shared/useLatestRequestGate";
import { runSubmitAction } from "../shared/submit-action";

export function useProfileInfoState() {
  const { updateSessionUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { beginRequest, isLatestRequest } = useLatestRequestGate();

  const loadProfile = useCallback(async () => {
    const requestId = beginRequest();
    setLoading(true);
    setError("");

    try {
      const profileData = await getCurrentUser();

      if (!isLatestRequest(requestId)) {
        return null;
      }

      setProfile(profileData);
      setForm({ name: profileData?.name || "" });
      return profileData;
    } catch (requestError) {
      if (isLatestRequest(requestId)) {
        setError(getApiErrorMessage(requestError, "Gagal memuat profil"));
      }

      return null;
    } finally {
      if (isLatestRequest(requestId)) {
        setLoading(false);
      }
    }
  }, [beginRequest, isLatestRequest]);

  useEffect(() => {
    return scheduleDeferredTask(loadProfile);
  }, [loadProfile]);

  function cancelProfileEdit() {
    setEditing(false);
    setForm({ name: profile?.name || "" });
    setError("");
  }

  async function handleProfileSubmit(event) {
    if (!profile) {
      return;
    }

    await runSubmitAction({
      event,
      setRunning: setSaving,
      beforeSubmit: () => {
        setError("");
      },
      onSubmit: async () => {
        const updatedProfile = await updateCurrentUser({ name: form.name });
        setProfile((previous) => ({
          ...previous,
          ...updatedProfile,
          pendingEmailChange: previous?.pendingEmailChange || null,
        }));
        updateSessionUser(updatedProfile);
        setEditing(false);
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    profile,
    form,
    loading,
    editing,
    saving,
    error,
    setEditing,
    setForm,
    setProfile,
    loadProfile,
    cancelProfileEdit,
    handleProfileSubmit,
  };
}
