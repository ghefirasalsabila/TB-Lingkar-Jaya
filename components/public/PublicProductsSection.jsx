import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { formatCurrency, formatNumber } from "../../lib/formatters";

export function PublicProductsSection({ loading, highlightedProducts }) {
  return (
    <section id="produk" className="space-y-5 lg:space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Produk Pilihan</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {loading ? "Memuat..." : `${highlightedProducts.length} produk`}
          </div>
          <Button asChild variant="ghost" className="px-0 text-sm">
            <Link to="/produk">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={`public-product-skeleton-${index}`}
                className="border-stone-200/80 bg-white shadow-none dark:border-white/10 dark:bg-white/6"
              >
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          : highlightedProducts.length === 0
            ? (
              <Card className="border-stone-200/80 bg-white shadow-none sm:col-span-2 xl:col-span-4 dark:border-white/10 dark:bg-white/6">
                <CardContent className="p-5 sm:p-6">
                  <p className="text-sm text-muted-foreground">
                    Belum ada produk sorotan yang dapat ditampilkan.
                  </p>
                </CardContent>
              </Card>
              )
            : highlightedProducts.map((item) => (
                <Card
                  key={item.id}
                  className="border-stone-200/80 bg-white shadow-none dark:border-white/10 dark:bg-white/6"
                >
                  <CardContent className="flex h-full flex-col justify-between gap-6 p-5 sm:gap-8 sm:p-6">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {item.categoryName || "Tanpa kategori"}
                      </p>

                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold leading-snug text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(item.stock || 0)} {item.unit}
                        </p>
                      </div>
                    </div>

                    <p className="text-2xl font-semibold text-foreground">
                      {formatCurrency(item.sellPrice)}
                    </p>
                  </CardContent>
                </Card>
              ))}
      </div>
    </section>
  );
}
