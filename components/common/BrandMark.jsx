import { cn } from "../../lib/classnames";
import { BRAND_LOGO_PUBLIC_PATH, BRAND_NAME } from "../../constants/brand";

export function BrandMark({ className, decorative = false, alt = `Logo ${BRAND_NAME}` }) {
  return (
    <img
      src={BRAND_LOGO_PUBLIC_PATH}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      className={cn("size-10 shrink-0", className)}
      width="40"
      height="40"
      decoding="async"
      loading="eager"
    />
  );
}
