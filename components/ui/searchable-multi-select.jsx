import * as React from "react";
import { CheckIcon, ChevronDownIcon, Loader2Icon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function normalizeOption(option) {
  return {
    value: String(option?.value ?? ""),
    label: String(option?.label ?? ""),
    searchText: option?.searchText ? String(option.searchText) : "",
    disabled: Boolean(option?.disabled),
  };
}

export function SearchableMultiSelect({
  className,
  options = [],
  value = [],
  onValueChange,
  placeholder = "Pilih opsi",
  searchPlaceholder = "Cari...",
  loading = false,
  loadingText = "Memuat opsi...",
  emptyText = "Tidak ada hasil.",
  disabled = false,
  "aria-invalid": ariaInvalid,
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef(null);
  const normalizedOptions = React.useMemo(() => options.map(normalizeOption), [options]);
  const selectedValues = React.useMemo(
    () => new Set((Array.isArray(value) ? value : []).map(String)),
    [value],
  );
  const selectedOptions = normalizedOptions.filter((option) => selectedValues.has(option.value));

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return normalizedOptions;

    return normalizedOptions.filter((option) => (
      [option.label, option.searchText].join(" ").toLowerCase().includes(normalizedQuery)
    ));
  }, [normalizedOptions, query]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      return undefined;
    }

    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  function toggleValue(nextValue) {
    const nextValues = selectedValues.has(nextValue)
      ? [...selectedValues].filter((currentValue) => currentValue !== nextValue)
      : [...selectedValues, nextValue];

    onValueChange?.(nextValues);
  }

  function getTriggerLabel() {
    if (loading) return loadingText;
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} kategori dipilih`;
  }

  function stopScrollPropagation(event) {
    event.stopPropagation();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          aria-busy={loading || undefined}
          className={cn(
            "h-10 w-full justify-between rounded-lg border-input bg-background px-3 py-2 text-sm font-normal text-foreground hover:bg-background dark:bg-input/30 dark:hover:bg-input/30",
            selectedOptions.length === 0 && "text-muted-foreground",
            className,
          )}
        >
          <span className="min-w-0 truncate text-left">{getTriggerLabel()}</span>
          {loading ? (
            <Loader2Icon className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="max-h-[min(24rem,var(--radix-popover-content-available-height))] overflow-hidden p-0"
        onWheelCapture={stopScrollPropagation}
      >
        <div className="border-b p-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              disabled={loading}
              className="pl-9"
            />
          </div>
        </div>

        <div
          className="max-h-72 overflow-y-auto overscroll-contain p-1"
          onWheel={stopScrollPropagation}
          onTouchMove={stopScrollPropagation}
        >
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span>{loadingText}</span>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground">{emptyText}</div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.has(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => toggleValue(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                    isSelected && "bg-accent text-accent-foreground",
                  )}
                >
                  <span className="min-w-0 truncate font-medium">{option.label}</span>
                  <span className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input",
                    isSelected && "border-primary bg-primary text-primary-foreground",
                  )}>
                    {isSelected ? <CheckIcon className="h-3 w-3" /> : null}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
