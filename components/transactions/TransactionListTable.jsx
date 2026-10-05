import { Ban, Download, Eye, Pencil } from "lucide-react";
import { DataPagination } from "../common/DataPagination";
import { TableSkeleton } from "../common/TableSkeleton";
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
import { isVoidedTransactionStatus } from "../../constants/transactions";
import { formatCurrency } from "../../lib/formatters";
import {
  getTransactionProductSummary,
  getTransactionQtySummary,
  TRANSACTION_DEFAULT_LIMIT,
  toDateLabel,
} from "../../features/transactions/transaction-utils";

export function TransactionListTable({
  variant,
  loading,
  items,
  searchQuery,
  isOwner,
  page,
  paginationMeta,
  onPageChange,
  onDownloadReceipt,
  onView,
  onEdit,
  onVoid,
}) {
  const isPurchase = variant === "purchase";
  const tableMinWidth = isPurchase ? "min-w-[1100px]" : "min-w-[1040px]";
  const emptyLabel = isPurchase ? "Belum ada transaksi pembelian." : "Belum ada transaksi penjualan.";
  const emptySearchLabel = "Tidak ada transaksi yang cocok dengan pencarian.";
  const skeletonColumns = isPurchase ? 7 : 6;
  const colspan = isPurchase ? 7 : 6;

  return (
    <>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <Table className={tableMinWidth}>
            <TableHeader className="bg-muted/40 text-foreground">
              <TableRow className="border-t-0">
                <TableHead>Tanggal</TableHead>
                {isPurchase ? <TableHead>Supplier</TableHead> : null}
                <TableHead>Produk</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton columns={skeletonColumns} />
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={colspan}>
                    {searchQuery ? emptySearchLabel : emptyLabel}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const productSummary = getTransactionProductSummary(item.items);
                  const qtySummary = getTransactionQtySummary(item.items);

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{toDateLabel(item.date)}</TableCell>
                      {isPurchase ? (
                        <TableCell className="font-medium text-foreground">{item.supplierName || "-"}</TableCell>
                      ) : null}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{productSummary.primary}</div>
                          {productSummary.secondary ? (
                            <div className="text-xs text-muted-foreground">{productSummary.secondary}</div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{qtySummary.primary}</div>
                          {qtySummary.secondary ? (
                            <div className="text-xs text-muted-foreground">{qtySummary.secondary}</div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
                      <TableCell>
                        <TransactionStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => onView(item.id)}>
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onEdit(item)} disabled={isVoidedTransactionStatus(item.status)}>
                            <Pencil className="h-3.5 w-3.5" />
                            Ubah
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onDownloadReceipt(item.id)}>
                            <Download className="h-3.5 w-3.5" />
                            Struk
                          </Button>
                          {isOwner ? (
                            <Button variant="destructive" size="sm" onClick={() => onVoid(item.id)} disabled={isVoidedTransactionStatus(item.status)}>
                              <Ban className="h-3.5 w-3.5" />
                              Batalkan
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <DataPagination
        page={page}
        pageSize={paginationMeta.limit || TRANSACTION_DEFAULT_LIMIT}
        totalItems={paginationMeta.totalItems}
        onPageChange={onPageChange}
      />
    </>
  );
}
