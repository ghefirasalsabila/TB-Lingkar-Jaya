import { useState } from "react";

function hasActionTarget(target) {
  return !(target === null || target === undefined || target === "");
}

export function useConfirmableAction({
  initialTarget = null,
  beforeConfirm,
  onConfirm,
  onSuccess,
  onError,
}) {
  const [running, setRunning] = useState(false);
  const [target, setTarget] = useState(initialTarget);

  function request(nextTarget) {
    setTarget(nextTarget);
  }

  function clear() {
    setTarget(initialTarget);
  }

  async function confirm() {
    if (!hasActionTarget(target)) {
      return false;
    }

    beforeConfirm?.();
    setRunning(true);

    try {
      await onConfirm(target);
      clear();
      onSuccess?.();
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    } finally {
      setRunning(false);
    }
  }

  return {
    running,
    target,
    request,
    clear,
    confirm,
  };
}
