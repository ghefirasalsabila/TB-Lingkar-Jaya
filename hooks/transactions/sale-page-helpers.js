import { parseIdrInput } from "../../lib/currency-input";

export const emptySaleItem = {
  productId: "",
  qty: "1",
  sellPrice: "0",
};

export function createEmptySaleForm() {
  return {
    items: [{ ...emptySaleItem }],
  };
}

export function mapSaleToForm(item) {
  return {
    items:
      item.items?.length > 0
        ? item.items.map((line) => ({
            productId: line.productId,
            qty: String(line.qty),
            sellPrice: String(line.sellPrice),
          }))
        : [{ ...emptySaleItem }],
  };
}

export function toSalePayload(form) {
  return {
    items: form.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        qty: Number(item.qty),
        sellPrice: parseIdrInput(item.sellPrice),
      })),
  };
}
