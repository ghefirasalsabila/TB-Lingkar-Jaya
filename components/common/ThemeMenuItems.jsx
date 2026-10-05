import { Monitor, Moon, Sun } from "lucide-react";
import { THEMES } from "../../context/ThemeContext";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";

export function CurrentThemeIcon({ theme, resolvedTheme, className = "h-4 w-4" }) {
  if (theme === THEMES.system) {
    return <Monitor className={className} />;
  }

  return resolvedTheme === THEMES.dark
    ? <Moon className={className} />
    : <Sun className={className} />;
}

export function ThemeMenuItems({ value, onValueChange }) {
  return (
    <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
      <DropdownMenuRadioItem value={THEMES.light} className="gap-2">
        <Sun className="h-4 w-4" />
        <span>Terang</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value={THEMES.dark} className="gap-2">
        <Moon className="h-4 w-4" />
        <span>Gelap</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value={THEMES.system} className="gap-2">
        <Monitor className="h-4 w-4" />
        <span>Sistem</span>
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}
