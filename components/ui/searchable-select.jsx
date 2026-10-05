import * as React from "react"
import { CheckIcon, ChevronDownIcon, Loader2Icon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function normalizeOption(option) {
  return {
    value: String(option?.value ?? ""),
    label: String(option?.label ?? ""),
    description: option?.description ? String(option.description) : "",
    searchText: option?.searchText ? String(option.searchText) : "",
    disabled: Boolean(option?.disabled),
  }
}

const SearchableSelect = React.forwardRef(function SearchableSelect(
  {
    className,
    options = [],
    value,
    onChange,
    placeholder = "Pilih opsi",
    searchPlaceholder = "Cari...",
    loading = false,
    loadingText = "Memuat opsi...",
    emptyText = "Tidak ada hasil.",
    disabled = false,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const searchInputRef = React.useRef(null)
  const normalizedOptions = React.useMemo(() => options.map(normalizeOption), [options])
  const selectedOption = normalizedOptions.find((option) => option.value === String(value ?? "")) || null

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return normalizedOptions
    }

    return normalizedOptions.filter((option) => {
      const haystack = [option.label, option.description, option.searchText].join(" ").toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [normalizedOptions, query])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      return
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [open])

  function handleSelect(nextValue) {
    onChange?.({
      target: { value: nextValue },
      currentTarget: { value: nextValue },
    })
    setOpen(false)
  }

  function stopScrollPropagation(event) {
    event.stopPropagation()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel || placeholder}
          disabled={disabled}
          aria-busy={loading || undefined}
          className={cn(
            "h-10 w-full justify-between rounded-lg border-input bg-background px-3 py-2 text-sm font-normal text-foreground hover:bg-background dark:bg-input/30 dark:hover:bg-input/30",
            !selectedOption && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <span className="min-w-0 truncate text-left">
            {selectedOption ? selectedOption.label : loading ? loadingText : placeholder}
          </span>
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
              const isSelected = option.value === String(value ?? "")

              return (
                <button
                  key={option.value || "__empty__"}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                    isSelected && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="min-w-0 space-y-0.5">
                    <span className="block truncate font-medium">{option.label || placeholder}</span>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted-foreground">{option.description}</span>
                    ) : null}
                  </span>
                  {isSelected ? <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" /> : null}
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
})

export { SearchableSelect }
