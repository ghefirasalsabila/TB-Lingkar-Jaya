import { Button } from "../ui/button";
import { useTheme } from "../../context/ThemeContext.jsx";
import { CurrentThemeIcon, ThemeMenuItems } from "./ThemeMenuItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ThemeToggle({ className = "", variant = "outline" }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon-sm"
          className={className}
          aria-label="Pilih tema"
          title="Tema"
        >
          <CurrentThemeIcon theme={theme} resolvedTheme={resolvedTheme} className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 min-w-44">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <ThemeMenuItems value={theme} onValueChange={setTheme} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
