import { deleteProduct, getProducts } from "../../lib/api/products";
import { PRODUCTS_DEFAULT_LIMIT, PRODUCTS_DEFAULT_PAGE } from "../../features/products/product-form-utils";
import { useConfirmableAction } from "../shared/useConfirmableAction";
import { usePaginatedCollection } from "../shared/usePaginatedCollection";

export function useProductsListPage({ enabled = true } = {}) {
  const listState = usePaginatedCollection({
    defaultPage: PRODUCTS_DEFAULT_PAGE,
    defaultLimit: PRODUCTS_DEFAULT_LIMIT,
    fetchPage: getProducts,
    errorMessage: "Gagal mengambil data produk",
    enabled,
  });
  const deleteAction = useConfirmableAction({
    beforeConfirm: () => listState.setError(""),
    onConfirm: async (targetProduct) => {
      await deleteProduct(targetProduct.id);
      await listState.reload();
    },
    onError: () => {
      // Error action sudah ditampilkan lewat toast global di interceptor API.
    },
  });

  return {
    products: listState.items,
    loading: listState.loading,
    deleteTarget: deleteAction.target,
    deleting: deleteAction.running,
    searchQuery: listState.searchQuery,
    page: listState.page,
    paginationMeta: listState.paginationMeta,
    listError: listState.error,
    setPage: listState.setPage,
    handleSearchChange: listState.handleSearchChange,
    setDeleteTarget: deleteAction.request,
    confirmDelete: deleteAction.confirm,
  };
}
