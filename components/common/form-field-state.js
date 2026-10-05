const INVALID_INPUT_CLASS_NAME = "border-destructive focus-visible:ring-destructive/40";

export function getInvalidInputClassName(isInvalid) {
  return isInvalid ? INVALID_INPUT_CLASS_NAME : undefined;
}
