import { SearchInput } from "./SearchInput";

export function ListToolbar({
  searchValue,
  onSearchChange,
  placeholder,
  summary,
  className = "sm:max-w-md",
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder}
        className={className}
      />
      <p className="text-xs text-muted-foreground">{summary}</p>
    </div>
  );
}
