import { ArrowLeft, ReceiptText } from "lucide-react";
import { PageHeader } from "../common/PageHeader";
import { StatusAlert } from "../common/StatusAlert";
import { TransactionStatusBadge } from "../common/TransactionStatusBadge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatCurrency } from "../../lib/formatters";
import {
  getTransactionItemCountLabel,
  formatTransactionItemQty,
  toDateLabel,
  toDateTimeLabel,
} from "../../features/transactions/transaction-utils";

const DETAIL_GRID_CLASS_NAME = "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))]";

function DetailField({ label, value }) {
  return (
    <div className="space-y-1 rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className={DETAIL_GRID_CLASS_NAME}>
          {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-24 animate-pulse bg-muted/40" />
        ))}
      </div>
      <Card className="h-64 animate-pulse bg-muted/40" />
      <Card className="h-48 animate-pulse bg-muted/40" />
    </div>
  );
}

export function TransactionDetailView({
  variant,
  item,
  loading,
  error,
  seoPath,
  onBack,
  onDownloadReceipt,
}) {
  const isPurchase = variant === "purchase";
  const title = isPurchase ? "Detail Pembelian" : "Detail Penjualan";
  const description = item
    ? `${toDateLabel(item.date)} · ${getTransactionItemCountLabel(item.items)}`
    : isPurchase
      ? "Lihat rincian transaksi pembelian beserta item yang tercatat."
      : "Lihat rincian transaksi penjualan beserta item yang tercatat.";

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        seoPath={seoPath}
        description={description}
        actions={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <Button variant="outline" onClick={onDownloadReceipt} disabled={!item || loading}>
              <ReceiptText className="h-4 w-4" />
              Unduh Struk
            </Button>
          </div>
        )}
      />

      <StatusAlert message={error} tone="destructive" />

      {loading ? <DetailSkeleton /> : null}

      {!loading && item ? (
        <>
          <div className={DETAIL_GRID_CLASS_NAME}>
            <DetailField label="Tanggal Transaksi" value={toDateLabel(item.date)} />
            {isPurchase ? (
              <DetailField label="Supplier" value={item.supplierName || "-"} />
            ) : (
              <DetailField label="Jumlah Item" value={getTransactionItemCountLabel(item.items)} />
            )}
            <DetailField label="Total" value={formatCurrency(item.totalAmount)} />
            {isPurchase ? (
              <DetailField label="Jumlah Item" value={getTransactionItemCountLabel(item.items)} />
            ) : null}
          </div>

          <Card className="p-0">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Rincian Item</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Daftar barang yang tercatat dalam transaksi ini.
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-14">No</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.items.map((transactionItem, index) => {
                    const priceField = isPurchase ? transactionItem.buyPrice : transactionItem.sellPrice;

                    return (
                      <TableRow key={transactionItem.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium text-foreground">{transactionItem.productName || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{transactionItem.productSku || "-"}</TableCell>
                        <TableCell>{formatTransactionItemQty(transactionItem)}</TableCell>
                        <TableCell>{formatCurrency(priceField)}</TableCell>
                        <TableCell>{formatCurrency(transactionItem.subtotal)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="space-y-5 p-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Informasi Transaksi</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Metadata operasional dan histori perubahan transaksi ini.
              </p>
            </div>

            <div className={DETAIL_GRID_CLASS_NAME}>
              <DetailField label="Status" value={<TransactionStatusBadge status={item.status} />} />
              <DetailField label="Dibuat Pada" value={toDateTimeLabel(item.createdAt || item.date)} />
              <DetailField label="Terakhir Diperbarui" value={toDateTimeLabel(item.updatedAt || item.date)} />
              {item.voidedAt ? (
                <DetailField label="Dibatalkan Pada" value={toDateTimeLabel(item.voidedAt)} />
              ) : null}
            </div>

            {item.voidReason ? (
              <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Alasan Pembatalan</p>
                <p className="text-sm leading-6 text-foreground">{item.voidReason}</p>
              </div>
            ) : null}
          </Card>
        </>
      ) : null}
    </div>
  );
}
