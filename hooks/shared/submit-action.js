import { toast } from "sonner";

function defaultValidationMessage(issues) {
  return issues.join(" ");
}

export async function runSubmitAction({
  event,
  setRunning,
  beforeSubmit,
  onSubmit,
  onError,
  onFinally,
}) {
  event?.preventDefault?.();
  beforeSubmit?.();

  setRunning(true);

  try {
    await onSubmit();
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  } finally {
    onFinally?.();
    setRunning(false);
  }
}

export async function runValidatedSubmitAction({
  event,
  setRunning,
  validate,
  onSubmit,
  onError,
  formatValidationMessage = defaultValidationMessage,
}) {
  event?.preventDefault?.();

  const validationIssues = validate();
  if (validationIssues.length > 0) {
    toast.error(formatValidationMessage(validationIssues));
    return false;
  }

  setRunning(true);

  try {
    await onSubmit();
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  } finally {
    setRunning(false);
  }
}
