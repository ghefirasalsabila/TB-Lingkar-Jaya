import { ListToolbar } from "../../components/common/ListToolbar";
import { StatusAlert } from "../../components/common/StatusAlert";
import { DataPagination } from "../../components/common/DataPagination";
import { ProductListTable } from "./ProductListTable";
import { PRODUCTS_DEFAULT_LIMIT } from "../../features/products/product-form-utils";

export function ProductsListSection({
  loading,
  products,
  isOwner,
  searchQuery,
  paginationMeta,
  page,
  listError,
  onSearchChange,
  onDelete,
  onPageChange,
}) {
  return (
    <>
      <StatusAlert message={listError} tone="destructive" />

      <ListToolbar
        searchValue={searchQuery}
        onSearchChange={onSearchChange}
          placeholder="Cari nama produk, SKU, satuan, atau kategori..."
        summary={`Menampilkan ${products.length} dari ${paginationMeta.totalItems} produk`}
      />

      <ProductListTable
        loading={loading}
        products={products}
        isOwner={isOwner}
        searchQuery={searchQuery}
        onDelete={onDelete}
      />

      <DataPagination
        page={page}
        pageSize={paginationMeta.limit || PRODUCTS_DEFAULT_LIMIT}
        totalItems={paginationMeta.totalItems}
        onPageChange={onPageChange}
      />
    </>
  );
}
