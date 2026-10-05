import { Plus } from "lucide-react";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { ListToolbar } from "../../components/common/ListToolbar";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusAlert } from "../../components/common/StatusAlert";
import { SupplierFormDialog } from "../../components/suppliers/SupplierFormDialog";
import { SupplierListTable } from "../../components/suppliers/SupplierListTable";
import { useSuppliersPage } from "../../hooks/suppliers/useSuppliersPage";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { isOwnerRole } from "../../constants/roles";

export function SuppliersPage() {
  const { role } = useAuth();
  const isOwner = isOwnerRole(role);
  const pageState = useSuppliersPage({ isOwner });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Supplier"
        seoPath="/admin/suppliers"
        description={
          isOwner
            ? "Daftar supplier dan status kemitraan aktif."
            : "Mode karyawan: hanya dapat melihat data supplier."
        }
        actions={
          isOwner ? (
            <Button variant="outline" onClick={pageState.openCreate}>
              <Plus className="h-4 w-4" />
              Tambah Supplier
            </Button>
          ) : null
        }
      />

      <StatusAlert message={pageState.error} tone="destructive" />

      <ListToolbar
        searchValue={pageState.searchQuery}
        onSearchChange={pageState.handleSearchChange}
        placeholder="Cari nama, kategori, telepon, atau alamat supplier..."
        summary={`Menampilkan ${pageState.suppliers.length} dari ${pageState.paginationMeta.totalItems} supplier`}
      />

      <SupplierListTable
        loading={pageState.loading}
        suppliers={pageState.suppliers}
        isOwner={isOwner}
        searchQuery={pageState.searchQuery}
        paginationMeta={pageState.paginationMeta}
        page={pageState.page}
        onPageChange={pageState.setPage}
        onEdit={pageState.openEdit}
        onDelete={pageState.requestDelete}
      />

      <SupplierFormDialog
        open={pageState.formOpen}
        onOpenChange={pageState.handleFormOpenChange}
        form={pageState.form}
        editingId={pageState.editingId}
        submitAttempted={pageState.submitAttempted}
        saving={pageState.saving}
        isOwner={isOwner}
        categories={pageState.categories}
        categoriesLoading={pageState.categoriesLoading}
        onSubmit={pageState.handleSubmit}
        onFormChange={pageState.handleFormChange}
      />

      <ConfirmActionDialog
        open={Boolean(pageState.deleteTarget)}
        pending={pageState.deleting}
        title="Hapus supplier?"
        description={(
          <>
            Supplier <span className="font-semibold text-foreground">{pageState.deleteTarget?.name}</span> akan dinonaktifkan.
            Data tetap disimpan untuk menjaga histori pembelian.
          </>
        )}
        confirmLabel="Nonaktifkan"
        onOpenChange={(open) => {
          if (!open) pageState.clearDeleteTarget();
        }}
        onConfirm={pageState.confirmDelete}
      />
    </div>
  );
}
