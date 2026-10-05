import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/classnames";

export function DashboardPreviewSummaryCard({
  icon,
  title,
  loading,
  onClick,
  primaryContent,
  previewItems,
  previewKey,
  previewClassName,
  emptyPreview,
  remainderLabel,
}) {
  const handleKeyDown = (event) => {
    if (!onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn("transition-all hover:shadow-md", onClick ? "cursor-pointer md:col-span-2" : "")}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <p className="text-sm font-semibold text-foreground">{title}</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary">
            Lihat Detail <ChevronDown className="h-3 w-3" />
          </span>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-7 w-36" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ) : (
          <>
            {primaryContent}
            <div className="flex flex-wrap gap-2">
              {previewItems.map((item) => (
                <span key={previewKey(item)} className={cn("rounded-full px-2.5 py-1 text-xs font-medium", previewClassName)}>
                  {item.name}
                </span>
              ))}
              {remainderLabel ? (
                <span className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground">
                  {remainderLabel}
                </span>
              ) : null}
              {emptyPreview}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
