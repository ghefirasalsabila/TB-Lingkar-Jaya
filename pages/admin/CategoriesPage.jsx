import { Plus } from "lucide-react";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { ListToolbar } from "../../components/common/ListToolbar";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusAlert } from "../../components/common/StatusAlert";
import { CategoryFormDialog } from "../../components/categories/CategoryFormDialog";
import { CategoryListTable } from "../../components/categories/CategoryListTable";
import { useCategoriesPage } from "../../hooks/categories/useCategoriesPage";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { isOwnerRole } from "../../constants/roles";

export function CategoriesPage() {
  const { role } = useAuth();
  const isOwner = isOwnerRole(role);
  const pageState = useCategoriesPage({ isOwner });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Kategori"
        seoPath="/admin/categories"
        description={
          isOwner
            ? "Pemilik dapat membuat, mengubah, dan menonaktifkan kategori."
            : "Mode karyawan: hanya dapat melihat data kategori."
        }
        actions={
          isOwner ? (
            <Button variant="outline" onClick={pageState.openCreate}>
              <Plus className="h-4 w-4" />
              Tambah Kategori
            </Button>
          ) : null
        }
      />

      <StatusAlert message={pageState.error} tone="destructive" />

      <ListToolbar
        searchValue={pageState.searchQuery}
        onSearchChange={pageState.handleSearchChange}
        placeholder="Cari kategori..."
        className="sm:max-w-sm"
        summary={`Menampilkan ${pageState.categories.length} dari ${pageState.paginationMeta.totalItems} kategori`}
      />

      <CategoryListTable
        loading={pageState.loading}
        categories={pageState.categories}
        isOwner={isOwner}
        searchQuery={pageState.searchQuery}
        paginationMeta={pageState.paginationMeta}
        page={pageState.page}
        onPageChange={pageState.setPage}
        onEdit={pageState.openEdit}
        onDelete={pageState.requestDelete}
      />

      <CategoryFormDialog
        open={pageState.formOpen}
        onOpenChange={pageState.handleFormOpenChange}
        form={pageState.form}
        editingId={pageState.editingId}
        submitAttempted={pageState.submitAttempted}
        saving={pageState.saving}
        isOwner={isOwner}
        onSubmit={pageState.handleSubmit}
        onFormChange={pageState.handleFormChange}
      />

      <ConfirmActionDialog
        open={Boolean(pageState.deleteTarget)}
        pending={pageState.deleting}
        title="Hapus kategori?"
        description={(
          <>
            Kategori <span className="font-semibold text-foreground">{pageState.deleteTarget?.name}</span> akan dinonaktifkan.
            Data tetap disimpan untuk menjaga konsistensi histori. Jika masih ada produk aktif di kategori ini,
            proses akan ditolak.
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
