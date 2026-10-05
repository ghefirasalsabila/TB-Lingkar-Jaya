import { downloadPurchaseReceipt, getPurchaseById } from "../../lib/api/purchases";
import { TransactionDetailView } from "../../components/transactions/TransactionDetailView";
import { useTransactionDetailPage } from "../../hooks/transactions/useTransactionDetailPage";

export function PurchaseDetailPage() {
  const pageState = useTransactionDetailPage({
    backPath: "/admin/purchases",
    fetchItem: getPurchaseById,
    fetchErrorMessage: "Gagal memuat detail pembelian",
    downloadReceipt: downloadPurchaseReceipt,
    receiptFileName: (id) => `struk-pembelian-${id}.pdf`,
  });

  return (
    <TransactionDetailView
      variant="purchase"
      seoPath={`/admin/purchases/${pageState.id}`}
      item={pageState.item}
      loading={pageState.loading}
      error={pageState.error}
      onBack={pageState.handleBack}
      onDownloadReceipt={pageState.handleDownloadReceipt}
    />
  );
}
