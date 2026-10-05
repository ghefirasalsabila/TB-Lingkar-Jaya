import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DataPagination } from "../common/DataPagination";
import { TableSkeleton } from "../common/TableSkeleton";
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
import {
  formatCurrency,
  formatStockMovementReference,
  formatStockMovementType,
  formatTransactionStatus,
} from "../../lib/formatters";
import { REPORTS_DEFAULT_LIMIT, buildReportDetailPath, toDateLabel } from "../../features/reports/report-utils";

function getGroupedDateLabel(totalItems) {
  return `${Number(totalItems || 0)} tanggal`;
}

function getDisplayedRowCount(reportType, items) {
  if (reportType === "movements") {
    return items.reduce((count, group) => count + Number(group.movements?.length || 0), 0);
  }

  if (reportType === "sales" || reportType === "purchases") {
    return items.reduce(
      (count, group) => count + (group.transactions || []).reduce(
        (transactionCount, transaction) => transactionCount + Math.max(transaction.items?.length || 0, 1),
        0
      ),
      0
    );
  }

  return items.length;
}

function getDisplayedSummaryLabel(reportType, items, totalItems) {
  const displayedRows = getDisplayedRowCount(reportType, items);
  const groupedDateLabel = getGroupedDateLabel(totalItems);

  if (reportType === "movements") {
    return `Menampilkan ${displayedRows} mutasi pada ${items.length} dari ${groupedDateLabel}`;
  }

  if (reportType === "sales" || reportType === "purchases") {
    return `Menampilkan ${displayedRows} baris pada ${items.length} dari ${groupedDateLabel}`;
  }

  return `Menampilkan ${items.length} dari ${totalItems || 0} baris`;
}

function createDetailSearch(range, page) {
  const params = new URLSearchParams();

  if (range?.from) {
    params.set("from", range.from);
  }

  if (range?.to) {
    params.set("to", range.to);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `?${search}` : "";
}

function GroupDetailAction({ reportType, date, range, page }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to={`${buildReportDetailPath(reportType, date)}${createDetailSearch(range, page)}`}>
        Detail
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}

function TransactionSummaryCell({ transaction, reportType }) {
  const subtitleParts = [];

  if (reportType === "purchases" && transaction.supplierName) {
    subtitleParts.push(transaction.supplierName);
  }

  return (
    <div className="space-y-0.5">
      <p className="font-medium text-foreground">{transaction.displayId || transaction.id || "-"}</p>
      {subtitleParts.length > 0 ? (
        <p className="text-xs text-muted-foreground">{subtitleParts.join(" · ")}</p>
      ) : null}
    </div>
  );
}

function TransactionProductCell({ lineItem }) {
  return (
    <div className="space-y-0.5">
      <p className="font-medium text-foreground">{lineItem?.productName || "-"}</p>
      {lineItem?.productSku ? (
        <p className="text-xs text-muted-foreground">{lineItem.productSku}</p>
      ) : null}
    </div>
  );
}

function TransactionQtyCell({ lineItem }) {
  return (
    <div className="space-y-0.5">
      <p className="font-medium text-foreground">{lineItem?.qtyLabel || "-"}</p>
    </div>
  );
}

function getTransactionLineItems(transaction) {
  if (Array.isArray(transaction?.items) && transaction.items.length > 0) {
    return transaction.items;
  }

  return [{ id: `${transaction?.id || "transaction"}-empty`, productName: "-", productSku: "", qtyLabel: "-" }];
}

function renderGroupedTransactionRows({ group, reportType, range, page }) {
  const rows = [];
  const groupTransactions = group.transactions || [];
  const groupRowCount = groupTransactions.reduce(
    (count, transaction) => count + getTransactionLineItems(transaction).length,
    0
  );

  let isFirstGroupRow = true;

  for (const transaction of groupTransactions) {
    const lineItems = getTransactionLineItems(transaction);
    const transactionRowCount = lineItems.length;

    lineItems.forEach((lineItem, lineIndex) => {
      rows.push(
        <TableRow key={`${transaction.id}-${lineItem.id || lineIndex}`}>
          {isFirstGroupRow ? (
            <TableCell rowSpan={groupRowCount} className="align-top font-medium">
              {toDateLabel(group.date)}
            </TableCell>
          ) : null}
          {reportType === "purchases" && lineIndex === 0 ? (
            <TableCell rowSpan={transactionRowCount} className="align-top">
              {transaction.supplierName || "-"}
            </TableCell>
          ) : null}
          <TableCell>
            <TransactionProductCell lineItem={lineItem} />
          </TableCell>
          <TableCell>
            <TransactionQtyCell lineItem={lineItem} />
          </TableCell>
          {lineIndex === 0 ? (
            <TableCell rowSpan={transactionRowCount} className="align-top">
              <TransactionSummaryCell transaction={transaction} reportType={reportType} />
            </TableCell>
          ) : null}
          {lineIndex === 0 ? (
            <TableCell rowSpan={transactionRowCount} className="align-top">
              {formatTransactionStatus(transaction.status)}
            </TableCell>
          ) : null}
          {lineIndex === 0 ? (
            <TableCell rowSpan={transactionRowCount} className="align-top text-right">
              {formatCurrency(transaction.totalAmount)}
            </TableCell>
          ) : null}
          {isFirstGroupRow ? (
            <TableCell rowSpan={groupRowCount} className="align-top">
              <GroupDetailAction reportType={reportType} date={group.date} range={range} page={page} />
            </TableCell>
          ) : null}
        </TableRow>
      );

      isFirstGroupRow = false;
    });
  }

  return rows;
}

function GroupedTransactionsTable({ reportType, loading, items, range, page }) {
  const columnCount = reportType === "purchases" ? 8 : 7;

  return (
    <Table className={reportType === "purchases" ? "min-w-[1180px]" : "min-w-[1060px]"}>
      <TableHeader className="bg-muted/40 text-foreground">
        <TableRow className="border-t-0">
          <TableHead className="w-[140px]">Tanggal</TableHead>
          {reportType === "purchases" ? <TableHead>Supplier</TableHead> : null}
          <TableHead>Produk</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Transaksi</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[160px] text-right">Total</TableHead>
          <TableHead className="w-[110px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableSkeleton columns={columnCount} />
        ) : items.length === 0 ? (
          <TableRow>
            <TableCell className="text-muted-foreground" colSpan={columnCount}>
              Tidak ada data pada rentang tanggal ini.
            </TableCell>
          </TableRow>
        ) : (
          items.flatMap((group) => renderGroupedTransactionRows({ group, reportType, range, page }))
        )}
      </TableBody>
    </Table>
  );
}

function GroupedMovementsTable({ loading, items, range, page }) {
  return (
    <Table className="min-w-[1080px]">
      <TableHeader className="bg-muted/40 text-foreground">
        <TableRow className="border-t-0">
          <TableHead className="w-[140px]">Tanggal</TableHead>
          <TableHead>Produk</TableHead>
          <TableHead>Tipe</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Sebelum</TableHead>
          <TableHead>Sesudah</TableHead>
          <TableHead>Ref</TableHead>
          <TableHead className="w-[110px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableSkeleton columns={8} />
        ) : items.length === 0 ? (
          <TableRow>
            <TableCell className="text-muted-foreground" colSpan={8}>
              Tidak ada data pada rentang tanggal ini.
            </TableCell>
          </TableRow>
        ) : (
          items.flatMap((group) => (
            group.movements?.map((movement, index) => (
              <TableRow key={movement.id}>
                {index === 0 ? (
                  <TableCell rowSpan={group.movements.length} className="align-top font-medium">
                    {toDateLabel(group.date)}
                  </TableCell>
                ) : null}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">{movement.productName || movement.productId || "-"}</p>
                    <p className="text-xs text-muted-foreground">{movement.productSku || "-"}</p>
                  </div>
                </TableCell>
                <TableCell>{formatStockMovementType(movement.type)}</TableCell>
                <TableCell>{movement.qty}</TableCell>
                <TableCell>{movement.beforeStock}</TableCell>
                <TableCell>{movement.afterStock}</TableCell>
                <TableCell>{movement.refLabel || formatStockMovementReference(movement.refType, movement.refId, movement.createdAt)}</TableCell>
                {index === 0 ? (
                  <TableCell rowSpan={group.movements.length} className="align-top">
                    <GroupDetailAction reportType="movements" date={group.date} range={range} page={page} />
                  </TableCell>
                ) : null}
              </TableRow>
            )) || []
          ))
        )}
      </TableBody>
    </Table>
  );
}

export function ReportsDataTable({
  reportType,
  range,
  loading,
  items,
  reportMeta,
  page,
  onPageChange,
}) {
  return (
    <>
      <div className="flex justify-end">
        <p className="text-xs text-muted-foreground">
          {getDisplayedSummaryLabel(reportType, items, reportMeta.totalItems)}
        </p>
      </div>

      <Card className="p-0 shadow-none">
        <div className="overflow-x-auto">
          {reportType === "movements" ? (
            <GroupedMovementsTable loading={loading} items={items} range={range} page={page} />
          ) : (
            <GroupedTransactionsTable reportType={reportType} loading={loading} items={items} range={range} page={page} />
          )}
        </div>
      </Card>

      <DataPagination
        page={page}
        pageSize={reportMeta.limit || REPORTS_DEFAULT_LIMIT}
        totalItems={reportMeta.totalItems}
        onPageChange={onPageChange}
      />
    </>
  );
}
