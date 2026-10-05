import { NavLink } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function isItemActive(pathname, to) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AdminSidebarNav({ pathname, menuGroups }) {
  return (
    <SidebarContent>
      {menuGroups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const active = isItemActive(pathname, item.to);
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.label}
                    className="h-9 rounded-lg font-medium"
                  >
                    <NavLink to={item.to} end>
                      <item.icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
