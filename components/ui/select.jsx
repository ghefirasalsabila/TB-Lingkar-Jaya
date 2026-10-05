import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const EMPTY_VALUE = "__empty__"

function normalizeSelectOption(option) {
  return {
    value: String(option?.value ?? ""),
    label: option?.label,
    disabled: Boolean(option?.disabled),
  }
}

function getSelectOptions(children) {
  return React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type === "option")
    .map((child) =>
      normalizeSelectOption({
        value: child.props.value,
        label: child.props.children,
        disabled: child.props.disabled,
      }),
    )
}

const Select = React.forwardRef(function Select(
  {
    className,
    children,
    options: optionsProp,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    ...props
  },
  ref,
) {
  const options = React.useMemo(
    () => (Array.isArray(optionsProp) ? optionsProp.map(normalizeSelectOption) : getSelectOptions(children)),
    [children, optionsProp],
  )
  const emptyOption = options.find((option) => option.value === "")
  const hasValueProp = value !== undefined
  const hasDefaultValueProp = defaultValue !== undefined
  const normalizedValue = value === null ? "" : String(value ?? "")
  const normalizedDefaultValue = defaultValue === null ? "" : String(defaultValue ?? "")
  const selectedValue = normalizedValue === "" ? EMPTY_VALUE : normalizedValue
  const selectedDefaultValue = normalizedDefaultValue === "" ? EMPTY_VALUE : normalizedDefaultValue

  function handleValueChange(nextValue) {
    const resolvedValue = nextValue === EMPTY_VALUE ? "" : nextValue
    onChange?.({
      target: { value: resolvedValue },
      currentTarget: { value: resolvedValue },
    })
  }

  return (
    <SelectPrimitive.Root
      {...(hasValueProp ? { value: selectedValue } : {})}
      {...(hasDefaultValueProp ? { defaultValue: selectedDefaultValue } : {})}
      onValueChange={handleValueChange}
      disabled={props.disabled}
    >
      <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select"
        onBlur={onBlur}
        className={cn(
          "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Value placeholder={placeholder || emptyOption?.label || "Pilih opsi"} />
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <SelectPrimitive.Viewport className="p-1">
            {emptyOption ? (
              <SelectPrimitive.Item
                value={EMPTY_VALUE}
                disabled={emptyOption.disabled}
                className="relative flex cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-2 text-sm text-muted-foreground outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
              >
                <SelectPrimitive.ItemText>{emptyOption.label}</SelectPrimitive.ItemText>
                <span className="pointer-events-none absolute right-2 flex items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
              </SelectPrimitive.Item>
            ) : null}

            {options
              .filter((option) => option.value !== "")
              .map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <span className="pointer-events-none absolute right-2 flex items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <CheckIcon className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                </SelectPrimitive.Item>
              ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
})

export { Select }
