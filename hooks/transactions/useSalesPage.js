import { useCallback } from "react";
import { toast } from "sonner";
import { getProducts } from "../../lib/api/products";
import { formatNumber } from "../../lib/formatters";
import { createSale, downloadSaleReceipt, getSales, updateSale, voidSale } from "../../lib/api/sales";
import {
  TRANSACTION_DEFAULT_PAGE,
  TRANSACTION_MASTER_DATA_LIMIT,
} from "../../features/transactions/transaction-utils";
import {
  createEmptySaleForm,
  emptySaleItem,
  mapSaleToForm,
  toSalePayload,
} from "./sale-page-helpers";
import { useTransactionPage } from "./useTransactionPage";

const estimateSaleTotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.sellPrice || 0), 0);

function buildSaleItemValidation(items, initialItems, products) {
  const selectedCounts = items.reduce((map, item) => {
    if (!item.productId) {
      return map;
    }

    map.set(item.productId, (map.get(item.productId) || 0) + 1);
    return map;
  }, new Map());

  return items.map((item) => {
    const errors = {};
    const normalizedQty = Number(item.qty || 0);

    if (!item.productId) {
      return errors;
    }

    if ((selectedCounts.get(item.productId) || 0) > 1) {
      errors.productId = "Produk tidak boleh dipilih lebih dari sekali dalam satu transaksi.";
    }

    const product = products.find((candidate) => candidate.id === item.productId);
    const initialItem = initialItems.find((candidate) => candidate.productId === item.productId);
    const availableStock = Number(product?.stock || 0) + Number(initialItem?.qty || 0);

    if (normalizedQty > availableStock) {
      errors.qty = `Stok tersedia ${formatNumber(availableStock)} ${product?.unit || ""}`.trim();
    }

    return errors;
  });
}

export function useSalesPage({ isOwner }) {
  const loadProductOptions = useCallback(async () => {
    const response = await getProducts({
      page: TRANSACTION_DEFAULT_PAGE,
      limit: TRANSACTION_MASTER_DATA_LIMIT,
    });
    const productOptions = Array.isArray(response?.data) ? response.data : [];
    return { products: productOptions.filter((item) => item.isActive) };
  }, []);

  const pageState = useTransactionPage({
    isOwner,
    fetchPage: getSales,
    fetchPageErrorMessage: "Gagal memuat data penjualan",
    loadMasterData: loadProductOptions,
    createItem: createSale,
    updateItem: updateSale,
    voidItem: voidSale,
    downloadReceipt: downloadSaleReceipt,
    receiptFileName: (id) => `struk-penjualan-${id}.pdf`,
    voidErrorMessage: "Gagal membatalkan penjualan",
    receiptErrorMessage: "Gagal mengunduh struk penjualan",
    emptyItemsError: "Minimal harus ada 1 item penjualan.",
    createEmptyForm: createEmptySaleForm,
    mapItemToForm: mapSaleToForm,
    emptyItem: emptySaleItem,
    estimateTotal: estimateSaleTotal,
    toPayload: toSalePayload,
  });

  const products = pageState.masterData.products || [];
  const saleItemErrors = buildSaleItemValidation(
    pageState.form.items,
    pageState.initialForm.items,
    products,
  );

  function handleSaleItemChange(index, key, value) {
    if (key !== "productId") {
      pageState.setItem(index, key, value);
      return;
    }

    const matchedProduct = products.find((product) => product.id === value);

    pageState.setItem(index, "productId", value);
    pageState.setItem(index, "sellPrice", matchedProduct ? String(matchedProduct.sellPrice ?? 0) : "0");
  }

  function isSaleProductDisabled(product) {
    return Number(product?.stock || 0) <= 0;
  }

  function handleSubmit(event) {
    const hasErrors = saleItemErrors.some((item) => Object.keys(item).length > 0);

    if (hasErrors) {
      event.preventDefault();
      const hasDuplicateError = saleItemErrors.some((item) => Boolean(item.productId));
      toast.error(
        hasDuplicateError
          ? "Produk dalam penjualan tidak boleh duplikat."
          : "Jumlah penjualan tidak boleh melebihi stok tersedia.",
      );
      return;
    }

    pageState.handleSubmit(event);
  }

  return {
    sales: pageState.items,
    products,
    itemErrors: saleItemErrors,
    isProductDisabled: isSaleProductDisabled,
    ...pageState,
    handleSubmit,
    setItem: handleSaleItemChange,
  };
}
