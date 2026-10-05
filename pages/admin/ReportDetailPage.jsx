import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusAlert } from "../../components/common/StatusAlert";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  getPurchasesReport,
  getSalesReport,
  getStockMovementsReport,
} from "../../lib/api/reports";
import {
  formatCurrency,
  formatNumber,
  formatStockMovementReference,
  formatStockMovementType,
  formatTransactionStatus,
} from "../../lib/formatters";
import { getApiErrorMessage } from "../../lib/api-error";
import { buildReportDetailPath, getReportTypeLabel, toDateLabel } from "../../features/reports/report-utils";

const VALID_REPORT_TYPES = new Set(["sales", "purchases", "movements"]);

function DetailSkeleton() {
  return (
    <Card className="h-72 animate-pulse bg-muted/40" />
  );
}

function buildBackHref(searchParams, reportType) {
  const params = new URLSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = searchParams.get("page");

  if (from) {
    params.set("from", from);
  }

  if (to) {
    params.set("to", to);
  }

  if (reportType && reportType !== "summary") {
    params.set("type", reportType);
  }

  if (page) {
    params.set("page", page);
  }

  const search = params.toString();
  return search ? `/admin/reports?${search}` : "/admin/reports";
}

function buildTransactionDetailHref(reportType, item) {
  if (reportType === "sales") {
    return `/admin/sales/${item.id}`;
  }

  if (reportType === "purchases") {
    return `/admin/purchases/${item.id}`;
  }

  if (reportType === "movements") {
    if (item.refType === "SALE") {
      return `/admin/sales/${item.refId}`;
    }

    if (item.refType === "PURCHASE") {
      return `/admin/purchases/${item.refId}`;
    }
  }

  return "";
}

function getTransactionLineItems(transaction) {
  if (Array.isArray(transaction?.items) && transaction.items.length > 0) {
    return transaction.items;
  }

  return [{ id: `${transaction?.id || "transaction"}-empty`, productName: "-", productSku: "", qtyLabel: "-" }];
}

function renderTransactionDetailRows({ reportType, transactions }) {
  return transactions.flatMap((transaction) => {
    const lineItems = getTransactionLineItems(transaction);
    const transactionRowCount = lineItems.length;
    const detailHref = buildTransactionDetailHref(reportType, transaction);

    return lineItems.map((lineItem, lineIndex) => (
      <TableRow key={`${transaction.id}-${lineItem.id || lineIndex}`}>
        {reportType === "purchases" ? (
          lineIndex === 0 ? <TableCell rowSpan={transactionRowCount} className="align-top">{transaction.supplierName || "-"}</TableCell> : null
        ) : null}
        <TableCell>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground">{lineItem.productName || "-"}</p>
            {lineItem.productSku ? (
              <p className="text-xs text-muted-foreground">{lineItem.productSku}</p>
            ) : null}
          </div>
        </TableCell>
        <TableCell>{lineItem.qtyLabel || "-"}</TableCell>
        {lineIndex === 0 ? (
          <TableCell rowSpan={transactionRowCount} className="align-top">
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">{transaction.displayId}</p>
            </div>
          </TableCell>
        ) : null}
        {lineIndex === 0 ? (
          <TableCell rowSpan={transactionRowCount} className="align-top">{formatTransactionStatus(transaction.status)}</TableCell>
        ) : null}
        {lineIndex === 0 ? (
          <TableCell rowSpan={transactionRowCount} className="align-top">{formatCurrency(transaction.totalAmount)}</TableCell>
        ) : null}
        {lineIndex === 0 ? (
          <TableCell rowSpan={transactionRowCount} className="align-top">
            <Button asChild variant="outline" size="sm">
              <Link to={detailHref} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Buka
              </Link>
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
    ));
  });
}

export function ReportDetailPage() {
  const { reportType, date } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [item, setItem] = useState(null);
  const backHref = useMemo(() => buildBackHref(searchParams, reportType), [reportType, searchParams]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!VALID_REPORT_TYPES.has(reportType) || !Boolean(String(date || "").match(/^\d{4}-\d{2}-\d{2}$/))) {
        if (active) {
          setError("Detail laporan tidak ditemukan.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const query = { from: date, to: date, page: 1, limit: 100 };
        const result = reportType === "sales"
          ? await getSalesReport(query)
          : reportType === "purchases"
            ? await getPurchasesReport(query)
            : await getStockMovementsReport(query);

        if (!active) {
          return;
        }

        const nextItem = Array.isArray(result?.data) ? result.data[0] || null : null;
        setItem(nextItem);

        if (!nextItem) {
          setError("Tidak ada data laporan pada tanggal ini.");
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(getApiErrorMessage(requestError, "Gagal memuat detail laporan"));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [date, reportType]);

  const reportTypeLabel = getReportTypeLabel(reportType);
  const detailTitle = item
    ? `Detail Laporan ${reportTypeLabel} · ${toDateLabel(item.date)}`
    : `Detail Laporan ${reportTypeLabel}`;
  const description = item
    ? reportType === "movements"
      ? `${formatNumber(item.movementCount)} mutasi`
      : `${formatNumber(item.transactionCount)} transaksi · Total ${formatCurrency(item.totalAmount)}`
    : `Rincian ${reportTypeLabel.toLowerCase()} untuk tanggal terpilih.`;

  return (
    <div className="space-y-5">
      <PageHeader
        title={detailTitle}
        description={description}
        seoPath={buildReportDetailPath(reportType, date)}
        actions={(
          <Button variant="outline" onClick={() => navigate(backHref)}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
      />

      <StatusAlert message={error} tone="destructive" />

      {loading ? <DetailSkeleton /> : null}

      {!loading && item ? (
        <Card className="p-0">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Rincian {reportTypeLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {reportType === "movements"
                ? "Daftar mutasi stok pada tanggal terpilih."
                : "Daftar transaksi pada tanggal terpilih."}
            </p>
          </div>
          <div className="overflow-x-auto">
            {reportType === "sales" ? (
              <Table className="min-w-[980px]">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Transaksi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[110px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTransactionDetailRows({ reportType, transactions: item.transactions })}</TableBody>
              </Table>
            ) : null}

            {reportType === "purchases" ? (
              <Table className="min-w-[1120px]">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Transaksi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[110px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTransactionDetailRows({ reportType, transactions: item.transactions })}</TableBody>
              </Table>
            ) : null}

            {reportType === "movements" ? (
              <Table className="min-w-[980px]">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Sebelum</TableHead>
                    <TableHead>Sesudah</TableHead>
                    <TableHead>Referensi</TableHead>
                    <TableHead className="w-[110px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.movements.map((movement) => {
                    const detailHref = buildTransactionDetailHref(reportType, movement);

                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-medium text-foreground">{movement.productName || movement.productId}</p>
                            <p className="text-xs text-muted-foreground">{movement.productSku || "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatStockMovementType(movement.type)}</TableCell>
                        <TableCell>{movement.qty}</TableCell>
                        <TableCell>{movement.beforeStock}</TableCell>
                        <TableCell>{movement.afterStock}</TableCell>
                        <TableCell>{movement.refLabel || formatStockMovementReference(movement.refType, movement.refId, movement.createdAt)}</TableCell>
                        <TableCell>
                          {detailHref ? (
                            <Button asChild variant="outline" size="sm">
                              <Link to={detailHref} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Buka
                              </Link>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
