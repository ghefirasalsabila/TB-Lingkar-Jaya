import { cn } from "../../lib/classnames";

export function DashboardIconSurface({ className, children }) {
  return (
    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", className)}>
      {children}
    </div>
  );
}
