import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/classnames";

/**
 * SearchInput: thin composition of shadcn Input + lucide icons.
 * - Leading Search icon
 * - Optional trailing Clear (X) button when `value` is non-empty
 * Controlled via `value` / `onChange` exactly like native input.
 */
export function SearchInput({
  value = "",
  onChange,
  placeholder = "Cari...",
  className,
  inputClassName,
  "aria-label": ariaLabel = "Cari",
  ...props
}) {
  function handleClear() {
    onChange?.({ target: { value: "" } });
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn("pl-9", value ? "pr-9" : "pr-3", inputClassName)}
        {...props}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Hapus pencarian"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
