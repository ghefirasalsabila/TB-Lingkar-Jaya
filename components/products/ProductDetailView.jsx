import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { ActiveStatusBadge } from "../common/ActiveStatusBadge";
import { PageHeader } from "../common/PageHeader";
import { StatusAlert } from "../common/StatusAlert";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatCurrency, formatNumber } from "../../lib/formatters";

const DETAIL_GRID_CLASS_NAME = "grid gap-4 md:grid-cols-2";
const READ_ONLY_FIELD_CLASS_NAME =
  "pointer-events-none border-border/60 bg-muted/20 text-foreground shadow-none";

function DetailInputField({ label, value }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-none">{label}</Label>
      <Input
        value={value}
        readOnly
        tabIndex={-1}
        className={READ_ONLY_FIELD_CLASS_NAME}
      />
    </div>
  );
}

function DetailStatusField({ value }) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label className="text-sm font-medium leading-none">Status</Label>
      <div className="flex min-h-10 items-center rounded-md border border-border/60 bg-muted/20 px-3">
        {value}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <Card className="space-y-5 p-5">
      <div className="space-y-2">
        <div className="h-5 w-40 animate-pulse rounded bg-muted/40" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted/40" />
      </div>
      <div className={DETAIL_GRID_CLASS_NAME}>
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
            <div className="h-10 animate-pulse rounded-md bg-muted/40" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ProductDetailView({ item, loading, error }) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Detail Barang"
        seoPath={item ? `/admin/products/${item.id}` : "/admin/products"}
        description={item ? `${item.name} · ${item.sku}` : "Lihat detail barang, harga, stok, dan status aktif saat ini."}
        actions={(
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/products">
                <ArrowLeft aria-hidden="true" />
                Kembali
              </Link>
            </Button>
            {item ? (
              <Button asChild variant="outline">
                <Link to={`/admin/products/edit/${item.id}`}>
                  <Pencil className="h-4 w-4" />
                  Ubah
                </Link>
              </Button>
            ) : null}
          </div>
        )}
      />

      <StatusAlert message={error} tone="destructive" />

      {loading ? <DetailSkeleton /> : null}

      {!loading && item ? (
        <Card className="space-y-5 p-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Informasi Barang</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Detail barang, harga, dan status aktif saat ini.
            </p>
          </div>

          <div className={DETAIL_GRID_CLASS_NAME}>
            <DetailInputField label="Nama Produk" value={item.name} />
            <DetailInputField label="Kategori" value={item.categoryName || "-"} />
            <DetailInputField label="SKU" value={item.sku} />
            <DetailInputField label="Satuan" value={item.unit} />
            <DetailInputField label="Stok Saat Ini" value={formatNumber(item.stock)} />
            <DetailInputField label="Stok Minimum" value={formatNumber(item.minStock)} />
            <DetailInputField label="Harga Beli" value={formatCurrency(item.buyPrice)} />
            <DetailInputField label="Harga Jual" value={formatCurrency(item.sellPrice)} />
            <DetailStatusField value={<ActiveStatusBadge isActive={item.isActive} />} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
