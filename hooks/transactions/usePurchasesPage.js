import { useCallback } from "react";
import { getSupplierProducts, getSuppliers } from "../../lib/api/suppliers";
import { createPurchase, downloadPurchaseReceipt, getPurchases, updatePurchase, voidPurchase } from "../../lib/api/purchases";
import {
  TRANSACTION_DEFAULT_PAGE,
  TRANSACTION_MASTER_DATA_LIMIT,
} from "../../features/transactions/transaction-utils";
import {
  createEmptyPurchaseForm,
  emptyPurchaseItem,
  mapPurchaseToForm,
  toPurchasePayload,
} from "./purchase-page-helpers";
import { useTransactionPage } from "./useTransactionPage";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

const estimatePurchaseTotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.buyPrice || 0), 0);

export function usePurchasesPage({ isOwner }) {
  const loadMasterData = useCallback(async () => {
    const supplierResponse = await getSuppliers({
      page: TRANSACTION_DEFAULT_PAGE,
      limit: TRANSACTION_MASTER_DATA_LIMIT,
    });

    const supplierOptions = Array.isArray(supplierResponse?.data) ? supplierResponse.data : [];

    return {
      suppliers: supplierOptions.filter((item) => item.isActive),
    };
  }, []);

  const pageState = useTransactionPage({
    isOwner,
    fetchPage: getPurchases,
    fetchPageErrorMessage: "Gagal memuat data pembelian",
    loadMasterData,
    createItem: createPurchase,
    updateItem: updatePurchase,
    voidItem: voidPurchase,
    downloadReceipt: downloadPurchaseReceipt,
    receiptFileName: (id) => `struk-pembelian-${id}.pdf`,
    saveErrorMessage: "Gagal menyimpan pembelian",
    voidErrorMessage: "Gagal membatalkan pembelian",
    receiptErrorMessage: "Gagal mengunduh struk pembelian",
    emptyItemsError: "Minimal harus ada 1 item pembelian.",
    createEmptyForm: createEmptyPurchaseForm,
    mapItemToForm: mapPurchaseToForm,
    emptyItem: emptyPurchaseItem,
    estimateTotal: estimatePurchaseTotal,
    toPayload: toPurchasePayload,
  });

  const supplierId = pageState.form.supplierId;
  const loadSupplierProducts = useCallback(
    () => getSupplierProducts(supplierId),
    [supplierId],
  );
  const supplierProductState = useAsyncValueEffect({
    enabled: Boolean(pageState.showForm && supplierId),
    initialValue: [],
    fallbackValue: [],
    load: loadSupplierProducts,
    errorMessage: "Gagal memuat produk supplier",
  });
  const products = supplierId && Array.isArray(supplierProductState.value)
    ? supplierProductState.value
    : [];

  function handlePurchaseFormChange(key, value) {
    if (key !== "supplierId" || value === pageState.form.supplierId) {
      pageState.handleFormChange(key, value);
      return;
    }

    pageState.handleFormChange("supplierId", value);
    pageState.form.items.forEach((item, index) => {
      if (!item.productId) return;
      pageState.setItem(index, "productId", "");
      pageState.setItem(index, "buyPrice", "0");
    });
  }

  function handlePurchaseItemChange(index, key, value) {
    if (key !== "productId") {
      pageState.setItem(index, key, value);
      return;
    }

    const matchedProduct = products.find((product) => product.id === value);

    pageState.setItem(index, "productId", value);
    pageState.setItem(index, "buyPrice", matchedProduct ? String(matchedProduct.buyPrice ?? 0) : "0");
  }

  return {
    purchases: pageState.items,
    suppliers: pageState.masterData.suppliers || [],
    products,
    productsLoading: supplierProductState.loading,
    ...pageState,
    handleFormChange: handlePurchaseFormChange,
    setItem: handlePurchaseItemChange,
  };
}
