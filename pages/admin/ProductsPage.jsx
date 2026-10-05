import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmActionDialog } from "../../components/common/ConfirmActionDialog";
import { PageHeader } from "../../components/common/PageHeader";
import { ProductEditorSection } from "../../components/products/ProductEditorSection";
import { ProductsListSection } from "../../components/products/ProductsListSection";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useProductsListPage } from "../../hooks/products/useProductsListPage";
import { isOwnerRole } from "../../constants/roles";

export function ProductsPage({ mode = "list" }) {
  const { role } = useAuth();
  const { id: routeEditId } = useParams();
  const navigate = useNavigate();
  const isOwner = isOwnerRole(role);
  const isFormMode = mode === "form";
  const isEditMode = isFormMode && Boolean(routeEditId);
  const listPage = useProductsListPage({ enabled: !isFormMode });

  return (
    <div className="space-y-5">
      <PageHeader
        title={isFormMode ? (isEditMode ? "Ubah Barang" : "Tambah Barang") : "Data Barang"}
        seoPath={isFormMode ? (isEditMode ? `/admin/products/edit/${routeEditId}` : "/admin/products/new") : "/admin/products"}
        description={
          isFormMode
            ? isEditMode
              ? "Perbarui data barang sesuai kebutuhan operasional gudang."
              : "Lengkapi data barang baru sesuai kebutuhan operasional gudang."
            : isOwner
              ? "Daftar barang dengan stok, harga, dan status terkini."
              : "Mode karyawan: dapat melihat, menambah, dan mengubah barang. Status hanya bisa diubah pemilik."
        }
        actions={
          isFormMode ? (
            <Button asChild variant="outline">
              <Link to="/admin/products">
                <ArrowLeft aria-hidden="true" />
                Kembali
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/admin/products/new">
                <Plus className="h-4 w-4" />
                Tambah Barang
              </Link>
            </Button>
          )
        }
      />

      {isFormMode ? (
        <ProductEditorSection
          key={routeEditId || "new-product"}
          routeEditId={routeEditId}
          isEditMode={isEditMode}
          isOwner={isOwner}
          navigate={navigate}
        />
      ) : null}

      {!isFormMode ? (
        <ProductsListSection
          loading={listPage.loading}
          products={listPage.products}
          isOwner={isOwner}
          searchQuery={listPage.searchQuery}
          paginationMeta={listPage.paginationMeta}
          page={listPage.page}
          listError={listPage.listError}
          onSearchChange={listPage.handleSearchChange}
          onDelete={listPage.setDeleteTarget}
          onPageChange={listPage.setPage}
        />
      ) : null}

      <ConfirmActionDialog
        open={Boolean(listPage.deleteTarget)}
        pending={listPage.deleting}
        title="Hapus produk?"
        description={(
          <>
            Produk <span className="font-semibold text-foreground">{listPage.deleteTarget?.name}</span> akan dinonaktifkan.
            Histori transaksi tetap dipertahankan.
          </>
        )}
        confirmLabel="Nonaktifkan"
        onOpenChange={(open) => {
          if (!open) listPage.setDeleteTarget(null);
        }}
        onConfirm={listPage.confirmDelete}
      />
    </div>
  );
}
