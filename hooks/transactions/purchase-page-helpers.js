import { parseIdrInput } from "../../lib/currency-input";

export const emptyPurchaseItem = {
  productId: "",
  qty: "1",
  buyPrice: "0",
};

export function createEmptyPurchaseForm() {
  return {
    supplierId: "",
    items: [{ ...emptyPurchaseItem }],
  };
}

export function mapPurchaseToForm(item) {
  return {
    supplierId: item.supplierId || "",
    items:
      item.items?.length > 0
        ? item.items.map((line) => ({
            productId: line.productId,
            qty: String(line.qty),
            buyPrice: String(line.buyPrice),
          }))
        : [{ ...emptyPurchaseItem }],
  };
}

export function toPurchasePayload(form) {
  return {
    supplierId: form.supplierId,
    items: form.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        qty: Number(item.qty),
        buyPrice: parseIdrInput(item.buyPrice),
      })),
  };
}
