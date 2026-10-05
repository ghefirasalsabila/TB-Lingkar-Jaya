import { Select } from "../ui/select";

const ACTIVE_STATUS_VALUES = {
  active: "active",
  inactive: "inactive",
};

const ACTIVE_STATUS_OPTIONS = [
  { value: ACTIVE_STATUS_VALUES.active, label: "Aktif" },
  { value: ACTIVE_STATUS_VALUES.inactive, label: "Nonaktif" },
];

function getActiveStatusValue(isActive) {
  return isActive ? ACTIVE_STATUS_VALUES.active : ACTIVE_STATUS_VALUES.inactive;
}

export function ActiveStatusSelect({
  id,
  isActive,
  onActiveChange,
  disabled = false,
  className,
  ariaLabel,
}) {
  return (
    <Select
      id={id}
      value={getActiveStatusValue(isActive)}
      onChange={(event) => onActiveChange(event.target.value === ACTIVE_STATUS_VALUES.active)}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      options={ACTIVE_STATUS_OPTIONS}
    />
  );
}
