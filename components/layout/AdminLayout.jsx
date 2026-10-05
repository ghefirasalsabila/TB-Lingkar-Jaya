import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { THEMES, useTheme } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebarBrand } from "./admin/AdminSidebarBrand";
import { AdminSidebarNav } from "./admin/AdminSidebarNav";
import { AdminUserMenu } from "./admin/AdminUserMenu";
import { getVisibleAdminMenuGroups } from "./admin-layout-config";

export function AdminLayout() {
  const { user, role, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const visibleMenuGroups = getVisibleAdminMenuGroups(role);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-3">
            <AdminSidebarBrand />
          </SidebarHeader>
          <AdminSidebarNav pathname={location.pathname} menuGroups={visibleMenuGroups} />
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 hidden h-6 sm:block" />
              <p className="hidden text-sm font-medium text-muted-foreground sm:block">
                Panel Administrasi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <AdminUserMenu
                user={user}
                role={role}
                theme={theme}
                resolvedTheme={resolvedTheme}
                onThemeChange={setTheme}
                onProfile={() => navigate("/admin/profile")}
                onLogout={handleLogout}
              />
            </div>
          </header>

          <div className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:p-7">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
