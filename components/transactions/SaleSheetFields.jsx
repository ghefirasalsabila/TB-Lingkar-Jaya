import { TransactionItemsSection } from "./TransactionItemsSection";

export function SaleSheetFields({
  form,
  products,
  productsLoading = false,
  itemSelectRefs,
  itemRowRefs,
  itemErrors,
  isProductDisabled,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="space-y-6">
      <TransactionItemsSection
        title="Item Penjualan"
        addButtonLabel="Tambah Item Penjualan"
        items={form.items}
        products={products}
        productsLoading={productsLoading}
        priceLabel="Harga Jual"
        priceKey="sellPrice"
        autoFocus
        itemSelectRefs={itemSelectRefs}
        itemRowRefs={itemRowRefs}
        itemErrors={itemErrors}
        isProductDisabled={isProductDisabled}
        onItemChange={onItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
}
