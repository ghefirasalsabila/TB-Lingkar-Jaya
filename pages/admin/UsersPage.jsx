import { Plus } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { ListToolbar } from "../../components/common/ListToolbar";
import { StatusAlert } from "../../components/common/StatusAlert";
import { UserFormDialog } from "../../components/users/UserFormDialog";
import { UserListTable } from "../../components/users/UserListTable";
import { USERS_DEFAULT_LIMIT } from "../../features/users/user-form-utils";
import { useUsersPage } from "../../hooks/users/useUsersPage";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { isOwnerRole } from "../../constants/roles";

export function UsersPage() {
  const { role } = useAuth();
  const isOwner = isOwnerRole(role);
  const pageState = useUsersPage({ isOwner });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pengguna"
        seoPath="/admin/users"
        description={
          isOwner
            ? "Pemilik dapat menambah, mengubah, dan menonaktifkan akun pengguna."
            : "Mode karyawan: hanya dapat melihat data akun sendiri."
        }
        actions={
          isOwner ? (
            <Button variant="outline" onClick={pageState.openCreate}>
              <Plus className="h-4 w-4" />
              Tambah Pengguna
            </Button>
          ) : null
        }
      />

      <StatusAlert message={pageState.error} tone="destructive" />

      <ListToolbar
        searchValue={pageState.searchQuery}
        onSearchChange={pageState.handleSearchChange}
        placeholder="Cari nama, email, atau peran..."
        summary={`Menampilkan ${pageState.users.length} dari ${pageState.paginationMeta.totalItems} pengguna`}
      />

      <UserListTable
        loading={pageState.loading}
        users={pageState.users}
        isOwner={isOwner}
        searchQuery={pageState.searchQuery}
        page={pageState.page}
        pageSize={pageState.paginationMeta.limit || USERS_DEFAULT_LIMIT}
        totalItems={pageState.paginationMeta.totalItems}
        onPageChange={pageState.setPage}
        onEdit={pageState.openEdit}
        onDeactivate={pageState.requestDeactivate}
      />

      <UserFormDialog
        open={pageState.formOpen}
        onOpenChange={pageState.handleFormOpenChange}
        form={pageState.form}
        isEditMode={pageState.isEditMode}
        isDefaultOwnerEdit={pageState.isDefaultOwnerEdit}
        submitAttempted={pageState.submitAttempted}
        saving={pageState.saving}
        onSubmit={pageState.handleSubmit}
        onFormChange={pageState.handleFormChange}
      />

      <ConfirmActionDialog
        open={Boolean(pageState.deleteTarget)}
        pending={pageState.deleting}
        title="Nonaktifkan pengguna?"
        description={(
          <>
            Pengguna <span className="font-semibold text-foreground">{pageState.deleteTarget?.name}</span> akan dinonaktifkan dan
            tidak bisa login sampai diaktifkan kembali.
          </>
        )}
        confirmLabel="Nonaktifkan"
        onOpenChange={(open) => {
          if (!open) pageState.clearDeleteTarget();
        }}
        onConfirm={pageState.confirmDeactivate}
      />
    </div>
  );
}
