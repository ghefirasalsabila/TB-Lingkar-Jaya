import { LogIn, Phone } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { BrandMark } from "../common/BrandMark";
import { Button } from "../ui/button";
import { cn } from "../../lib/classnames";
import { BRAND_LOCATION_LABEL, BRAND_NAME, BRAND_PHONE_LINK } from "../../constants/brand";
import {
  PUBLIC_NAV_ITEMS,
} from "../../features/public/public-utils";

function getNavLinkClassName({ isActive }) {
  return cn(
    "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors",
    isActive
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-white/80 hover:text-foreground dark:hover:bg-white/8",
  );
}

export function PublicHomeHeader() {
  return (
    <header className="border-b border-stone-200/80 pb-4 dark:border-white/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark className="size-10 rounded-2xl sm:size-11" decorative />

          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {BRAND_NAME}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{BRAND_LOCATION_LABEL}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={getNavLinkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:self-auto">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-stone-200 bg-white/80 px-3 text-sm text-foreground shadow-none hover:bg-white dark:border-white/10 dark:bg-white/6 dark:hover:bg-white/10 sm:w-auto"
            >
              <a href={`tel:${BRAND_PHONE_LINK}`}>
                <Phone data-icon="inline-start" /> Hubungi
              </a>
            </Button>
            <Button asChild className="w-full rounded-full px-4 sm:w-auto sm:px-5">
              <Link to="/login">
                <LogIn data-icon="inline-start" /> Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
