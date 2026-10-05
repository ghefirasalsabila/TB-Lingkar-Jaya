import { Link } from "react-router-dom";
import { LogIn, MapPin, Phone } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { BRAND_LOCATION_LABEL, BRAND_NAME, BRAND_PHONE_LABEL, BRAND_PHONE_LINK } from "../../constants/brand";

export function PublicHomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200/80 py-6 dark:border-white/10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            &copy; {year} {BRAND_NAME}
          </p>
          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            <a
              href={`tel:${BRAND_PHONE_LINK}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Phone className="h-3 w-3" />
              {BRAND_PHONE_LABEL}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {BRAND_LOCATION_LABEL}
            </span>
          </div>
        </div>

        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:w-auto sm:self-auto">
          <ThemeToggle variant="ghost" />
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 hover:text-primary/80 sm:w-auto sm:text-xs"
          >
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
