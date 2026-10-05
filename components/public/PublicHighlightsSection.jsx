import { Skeleton } from "../../components/ui/skeleton";
import { formatCompactNumber } from "../../features/public/public-utils";
import { formatNumber } from "../../lib/formatters";

export function PublicHighlightsSection({ loading, totalProducts, highlightedCount, startingPriceLabel }) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[1.5rem] border border-stone-200/80 bg-white/80 dark:border-white/10 dark:bg-white/6">
      <div className="space-y-1 px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          Produk
        </p>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-xl font-semibold text-foreground sm:text-2xl">{formatCompactNumber(totalProducts)}+</p>
        )}
      </div>
      <div className="space-y-1 border-x border-stone-200/80 px-4 py-4 dark:border-white/10 sm:px-6 sm:py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          Sorotan
        </p>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-xl font-semibold text-foreground sm:text-2xl">{formatNumber(highlightedCount)}</p>
        )}
      </div>
      <div className="space-y-1 px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          Mulai
        </p>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="text-lg font-semibold text-foreground sm:text-2xl">{startingPriceLabel}</p>
        )}
      </div>
    </div>
  );
}
