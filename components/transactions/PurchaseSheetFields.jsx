import { useId } from "react";
import { Label } from "../../components/ui/label";
import { SearchableSelect } from "../../components/ui/searchable-select";
import { TransactionItemsSection } from "./TransactionItemsSection";

export function PurchaseSheetFields({
  form,
  suppliers,
  products,
  masterDataLoading = false,
  productsLoading = false,
  itemSelectRefs,
  itemRowRefs,
  onFormChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) {
  const supplierFieldId = useId();
  const supplierOptions = [
    ...suppliers.map((item) => ({
      value: item.id,
      label: item.name,
      description: item.categories?.map((category) => category.name).join(", ") || item.phone || item.address || "",
      searchText: [
        item.phone,
        item.address,
        item.categories?.map((category) => category.name).join(" "),
      ].filter(Boolean).join(" "),
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={supplierFieldId}>Supplier</Label>
        <SearchableSelect
          id={supplierFieldId}
          value={form.supplierId}
          onChange={(event) => onFormChange("supplierId", event.target.value)}
          autoFocus
          options={supplierOptions}
          loading={masterDataLoading}
          loadingText="Memuat supplier..."
          placeholder="Pilih supplier"
          searchPlaceholder="Cari supplier..."
          emptyText="Supplier tidak ditemukan."
        />
      </div>

      <TransactionItemsSection
        title="Item Pembelian"
        addButtonLabel="Tambah Item Pembelian"
        items={form.items}
        products={products}
        productsLoading={productsLoading}
        productsDisabled={!form.supplierId}
        productPlaceholder={form.supplierId ? "Pilih produk" : "Pilih supplier terlebih dahulu"}
        productEmptyText="Belum ada produk pada kategori supplier ini."
        priceLabel="Harga Beli"
        priceKey="buyPrice"
        itemSelectRefs={itemSelectRefs}
        itemRowRefs={itemRowRefs}
        onItemChange={onItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
}
