import { Filter, RotateCcw } from "lucide-react";
import { DataPagination } from "../../components/common/DataPagination";
import { SearchInput } from "../../components/common/SearchInput";
import { StatusAlert } from "../../components/common/StatusAlert";
import { PublicPageLayout } from "../../components/public/PublicPageLayout";
import { PublicPageSeo } from "../../components/public/PublicPageSeo";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Select } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { PUBLIC_PRODUCTS_SEO_DESCRIPTION, PUBLIC_PRODUCTS_SEO_TITLE } from "../../features/public/public-utils";
import { usePublicProductsPage } from "../../hooks/public/usePublicProductsPage";
import { formatCurrency, formatNumber } from "../../lib/formatters";

function ProductCard({ product }) {
  const stockLabel = `${formatNumber(product.stock || 0)} ${product.unit}`;
  const hasStock = Number(product.stock || 0) > 0;

  return (
    <Card className="border-stone-200/80 bg-white shadow-none dark:border-white/10 dark:bg-white/6">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline">{product.categoryName || "Tanpa kategori"}</Badge>
          <span className="text-xs text-muted-foreground">{product.sku}</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-snug text-foreground">{product.name}</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Harga</p>
              <p className="font-semibold text-foreground">{formatCurrency(product.sellPrice)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Stok</p>
              <p className="font-semibold text-foreground">{stockLabel}</p>
            </div>
          </div>
        </div>

        <Badge variant={hasStock ? "secondary" : "outline"}>{hasStock ? "Tersedia" : "Kosong"}</Badge>
      </CardContent>
    </Card>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="border-stone-200/80 bg-white shadow-none dark:border-white/10 dark:bg-white/6">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-7 w-3/4" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-20" />
      </CardContent>
    </Card>
  );
}

export function PublicProductsPage() {
  const pageState = usePublicProductsPage();

  return (
    <>
      <PublicPageSeo
        siteUrl={pageState.siteUrl}
        ogImageUrl={pageState.ogImageUrl}
        title={PUBLIC_PRODUCTS_SEO_TITLE}
        description={PUBLIC_PRODUCTS_SEO_DESCRIPTION}
        path="/produk"
      />

      <PublicPageLayout mainClassName="space-y-8 lg:space-y-10">
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Daftar Produk</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Cari barang yang tersedia di toko.</p>
          </div>

          <Card className="border-stone-200/80 bg-white/80 shadow-none dark:border-white/10 dark:bg-white/6">
            <CardContent className="space-y-4 p-4 sm:p-6">
              <form
                className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem_auto_auto]"
                onSubmit={pageState.applyFilters}
              >
                <SearchInput
                  value={pageState.draftSearchQuery}
                  onChange={(event) => pageState.setDraftSearchQuery(event.target.value)}
                  placeholder="Cari nama produk, SKU, satuan, atau kategori..."
                />
                <Select
                  value={pageState.draftCategoryId}
                  onChange={(event) => pageState.setDraftCategoryId(event.target.value)}
                  options={pageState.categoryOptions}
                  placeholder="Semua kategori"
                  aria-label="Pilih kategori"
                />
                <Button type="submit">
                  <Filter className="h-4 w-4" />
                  Terapkan
                </Button>
                <Button type="button" variant="outline" onClick={pageState.resetFilters}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </form>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {pageState.loading
                    ? "Memuat produk..."
                    : `Menampilkan ${pageState.products.length} dari ${pageState.paginationMeta.totalItems} produk`}
                </p>
                {pageState.activeFilterCount > 0 ? (
                  <Badge variant="outline">{pageState.activeFilterCount} filter aktif</Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <StatusAlert message={pageState.categoriesError} tone="destructive" />
          <StatusAlert message={pageState.error} tone="destructive" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageState.loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={`public-product-card-skeleton-${index}`} />
                ))
              : pageState.products.length === 0
                ? (
                  <Card className="border-stone-200/80 bg-white shadow-none sm:col-span-2 xl:col-span-3 dark:border-white/10 dark:bg-white/6">
                    <CardContent className="space-y-3 p-5 sm:p-6">
                      <p className="text-base font-medium text-foreground">Produk tidak ditemukan.</p>
                      <p className="text-sm text-muted-foreground">
                        Coba ubah kata kunci atau reset filter kategori.
                      </p>
                    </CardContent>
                  </Card>
                  )
                : pageState.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
          </div>

          <DataPagination
            page={pageState.page}
            pageSize={pageState.paginationMeta.limit || 12}
            totalItems={pageState.paginationMeta.totalItems}
            onPageChange={pageState.setPage}
          />
        </section>
      </PublicPageLayout>
    </>
  );
}
