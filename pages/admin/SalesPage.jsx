import { Plus } from "lucide-react";
import { ListToolbar } from "../../components/common/ListToolbar";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusAlert } from "../../components/common/StatusAlert";
import { SaleSheetFields } from "../../components/transactions/SaleSheetFields";
import { TransactionListTable } from "../../components/transactions/TransactionListTable";
import { TransactionSheetForm } from "../../components/transactions/TransactionSheetForm";
import { TransactionVoidDialog } from "../../components/transactions/TransactionVoidDialog";
import { useSalesPage } from "../../hooks/transactions/useSalesPage";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { isOwnerRole } from "../../constants/roles";
import { useNavigate } from "react-router-dom";

export function SalesPage() {
  const { role } = useAuth();
  const isOwner = isOwnerRole(role);
  const navigate = useNavigate();
  const pageState = useSalesPage({ isOwner });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Penjualan"
        seoPath="/admin/sales"
        description={
          isOwner
            ? "Pemilik dapat membuat, mengubah, dan membatalkan transaksi penjualan."
            : "Mode karyawan: dapat melihat, membuat, dan mengubah transaksi penjualan."
        }
        actions={
          <Button variant="outline" onClick={pageState.openCreate}>
            <Plus className="h-4 w-4" />
            Tambah Penjualan
          </Button>
        }
      />

      <StatusAlert message={!pageState.showForm ? pageState.error : ""} tone="destructive" />

      <ListToolbar
        searchValue={pageState.searchQuery}
        onSearchChange={pageState.handleSearchChange}
        placeholder="Cari status atau tanggal penjualan..."
        summary={`Menampilkan ${pageState.sales.length} dari ${pageState.paginationMeta.totalItems} transaksi`}
      />

      <TransactionListTable
        variant="sale"
        loading={pageState.loading}
        items={pageState.sales}
        searchQuery={pageState.searchQuery}
        isOwner={isOwner}
        page={pageState.page}
        paginationMeta={pageState.paginationMeta}
        onPageChange={pageState.setPage}
        onView={(id) => navigate(`/admin/sales/${id}`)}
        onDownloadReceipt={pageState.handleDownloadReceipt}
        onEdit={pageState.startEdit}
        onVoid={pageState.requestVoid}
      />

      <TransactionSheetForm
        open={pageState.showForm}
        onOpenChange={pageState.handleFormOpenChange}
        formId="sales-form"
        title={pageState.editingId ? "Ubah Penjualan" : "Tambah Penjualan"}
        description={
          pageState.editingId
            ? "Perbarui transaksi penjualan lalu simpan perubahan."
            : "Isi item penjualan untuk mencatat barang keluar."
        }
        onSubmit={pageState.handleSubmit}
        estimatedTotal={pageState.estimatedTotal}
        saving={pageState.saving}
        onCancel={() => pageState.handleFormOpenChange(false)}
        submitLabel={pageState.editingId ? "Simpan Perubahan" : "Tambah Penjualan"}
      >
        <SaleSheetFields
          form={pageState.form}
          products={pageState.products}
          productsLoading={pageState.masterDataLoading}
          itemSelectRefs={pageState.itemSelectRefs}
          itemRowRefs={pageState.itemRowRefs}
          itemErrors={pageState.itemErrors}
          isProductDisabled={pageState.isProductDisabled}
          onItemChange={pageState.setItem}
          onAddItem={pageState.addItem}
          onRemoveItem={pageState.removeItem}
        />
      </TransactionSheetForm>

      <TransactionVoidDialog
        open={Boolean(pageState.voidTargetId)}
        pending={pageState.voiding}
        title="Batalkan penjualan?"
        description="Transaksi penjualan ini akan dibatalkan dan histori stok akan disesuaikan."
        reason={pageState.voidReason}
        onOpenChange={pageState.handleVoidDialogOpenChange}
        onReasonChange={pageState.setVoidReason}
        onConfirm={pageState.confirmVoid}
      />
    </div>
  );
}
