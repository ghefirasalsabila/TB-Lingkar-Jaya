import { Plus } from "lucide-react";
import { ListToolbar } from "../../components/common/ListToolbar";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusAlert } from "../../components/common/StatusAlert";
import { PurchaseSheetFields } from "../../components/transactions/PurchaseSheetFields";
import { TransactionListTable } from "../../components/transactions/TransactionListTable";
import { TransactionSheetForm } from "../../components/transactions/TransactionSheetForm";
import { TransactionVoidDialog } from "../../components/transactions/TransactionVoidDialog";
import { usePurchasesPage } from "../../hooks/transactions/usePurchasesPage";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { isOwnerRole } from "../../constants/roles";
import { useNavigate } from "react-router-dom";

export function PurchasesPage() {
  const { role } = useAuth();
  const isOwner = isOwnerRole(role);
  const navigate = useNavigate();
  const pageState = usePurchasesPage({ isOwner });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pembelian"
        seoPath="/admin/purchases"
        description={
          isOwner
            ? "Kelola transaksi barang masuk (pembelian) sesuai alur operasional gudang."
            : "Mode karyawan: dapat melihat serta membuat dan mengubah transaksi barang masuk."
        }
        actions={
          <Button variant="outline" onClick={pageState.openCreate}>
            <Plus className="h-4 w-4" />
            Tambah Pembelian
          </Button>
        }
      />

      <StatusAlert message={!pageState.showForm ? pageState.error : ""} tone="destructive" />

      <ListToolbar
        searchValue={pageState.searchQuery}
        onSearchChange={pageState.handleSearchChange}
        placeholder="Cari supplier, status, atau tanggal..."
        summary={`Menampilkan ${pageState.purchases.length} dari ${pageState.paginationMeta.totalItems} transaksi`}
      />

      <TransactionListTable
        variant="purchase"
        loading={pageState.loading}
        items={pageState.purchases}
        searchQuery={pageState.searchQuery}
        isOwner={isOwner}
        page={pageState.page}
        paginationMeta={pageState.paginationMeta}
        onPageChange={pageState.setPage}
        onView={(id) => navigate(`/admin/purchases/${id}`)}
        onDownloadReceipt={pageState.handleDownloadReceipt}
        onEdit={pageState.startEdit}
        onVoid={pageState.requestVoid}
      />

      <TransactionSheetForm
        open={pageState.showForm}
        onOpenChange={pageState.handleFormOpenChange}
        formId="purchase-form"
        title={pageState.editingId ? "Ubah Pembelian" : "Tambah Pembelian"}
        description={
          pageState.editingId
            ? "Perbarui transaksi pembelian lalu simpan perubahan."
            : "Isi supplier dan item pembelian untuk mencatat barang masuk."
        }
        onSubmit={pageState.handleSubmit}
        estimatedTotal={pageState.estimatedTotal}
        saving={pageState.saving}
        onCancel={() => pageState.handleFormOpenChange(false)}
        submitLabel={pageState.editingId ? "Simpan Perubahan" : "Tambah Pembelian"}
      >
        <PurchaseSheetFields
          form={pageState.form}
          suppliers={pageState.suppliers}
          products={pageState.products}
          masterDataLoading={pageState.masterDataLoading}
          productsLoading={pageState.productsLoading}
          itemSelectRefs={pageState.itemSelectRefs}
          itemRowRefs={pageState.itemRowRefs}
          onFormChange={pageState.handleFormChange}
          onItemChange={pageState.setItem}
          onAddItem={pageState.addItem}
          onRemoveItem={pageState.removeItem}
        />
      </TransactionSheetForm>

      <TransactionVoidDialog
        open={Boolean(pageState.voidTargetId)}
        pending={pageState.voiding}
        title="Batalkan pembelian?"
        description="Transaksi pembelian ini akan dibatalkan dan histori stok akan disesuaikan."
        reason={pageState.voidReason}
        onOpenChange={pageState.handleVoidDialogOpenChange}
        onReasonChange={pageState.setVoidReason}
        onConfirm={pageState.confirmVoid}
      />
    </div>
  );
}
