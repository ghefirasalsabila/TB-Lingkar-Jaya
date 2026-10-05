import { forwardRef } from "react";
import { normalizeIdrInput, formatIdrInput } from "../../lib/currency-input";
import { Input } from "./input";

export const CurrencyInput = forwardRef(function CurrencyInput(
  { value, onValueChange, onChange, ...props },
  ref
) {
  return (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={formatIdrInput(value)}
      onChange={(event) => {
        const normalizedValue = normalizeIdrInput(event.target.value);
        onValueChange?.(normalizedValue);
        onChange?.(event);
      }}
    />
  );
});
