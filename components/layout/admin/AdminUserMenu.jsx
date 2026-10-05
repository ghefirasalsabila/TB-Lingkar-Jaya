import {
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { CurrentThemeIcon, ThemeMenuItems } from "../../common/ThemeMenuItems";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS } from "../../../constants/roles";
import { getInitials } from "../admin-layout-config";

export function AdminUserMenu({
  user,
  role,
  theme,
  resolvedTheme,
  onThemeChange,
  onProfile,
  onLogout,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto items-center gap-2.5 px-3 py-2 text-sm font-medium"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-foreground">
              {user?.name || "Pengguna"}
            </p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[role] || "Pengguna"}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{user?.name || "Pengguna"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onProfile}>
            <User className="mr-2 h-4 w-4" />
            Akun Saya
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CurrentThemeIcon theme={theme} resolvedTheme={resolvedTheme} className="mr-2 h-4 w-4" />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <ThemeMenuItems value={theme} onValueChange={onThemeChange} />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
