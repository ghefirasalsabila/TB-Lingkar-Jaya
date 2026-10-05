import { downloadSaleReceipt, getSaleById } from "../../lib/api/sales";
import { TransactionDetailView } from "../../components/transactions/TransactionDetailView";
import { useTransactionDetailPage } from "../../hooks/transactions/useTransactionDetailPage";

export function SaleDetailPage() {
  const pageState = useTransactionDetailPage({
    backPath: "/admin/sales",
    fetchItem: getSaleById,
    fetchErrorMessage: "Gagal memuat detail penjualan",
    downloadReceipt: downloadSaleReceipt,
    receiptFileName: (id) => `struk-penjualan-${id}.pdf`,
  });

  return (
    <TransactionDetailView
      variant="sale"
      seoPath={`/admin/sales/${pageState.id}`}
      item={pageState.item}
      loading={pageState.loading}
      error={pageState.error}
      onBack={pageState.handleBack}
      onDownloadReceipt={pageState.handleDownloadReceipt}
    />
  );
}
