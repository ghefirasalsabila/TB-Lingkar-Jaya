import { useId } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getInvalidInputClassName } from "../common/form-field-state";
import { Button } from "../ui/button";
import { CurrencyInput } from "../ui/currency-input";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SearchableSelect } from "../ui/searchable-select";
import { formatNumber } from "../../lib/formatters";

export function TransactionItemsSection({
  title,
  addButtonLabel,
  items,
  products,
  productsLoading = false,
  productsDisabled = false,
  productPlaceholder = "Pilih produk",
  productEmptyText = "Produk tidak ditemukan.",
  priceLabel,
  priceKey,
  priceReadOnly = false,
  autoFocus = false,
  itemSelectRefs,
  itemRowRefs,
  itemErrors = [],
  isProductDisabled,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) {
  const fieldIdPrefix = useId();
  function getProductStockDescription(product) {
    const normalizedStock = Number(product?.stock);

    if (!Number.isFinite(normalizedStock)) {
      return product?.categoryName || "";
    }

    if (normalizedStock <= 0) {
      return "Stok habis";
    }

    return `Stok ${formatNumber(normalizedStock)} ${product.unit || ""}`.trim();
  }

  const productOptions = [
    ...products.map((product) => ({
      value: product.id,
      label: product.name,
      description: [
        product.sku,
        getProductStockDescription(product),
      ].filter(Boolean).join(" • "),
      searchText: [product.sku, product.categoryName, product.unit].filter(Boolean).join(" "),
      disabled: typeof isProductDisabled === "function" ? Boolean(isProductDisabled(product)) : false,
    })),
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{items.length} item</p>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const currentErrors = itemErrors[index] || {};

          return (
            <div
              key={`${item.productId}-${index}`}
              ref={(node) => {
                itemRowRefs.current[index] = node;
              }}
              className="space-y-4 rounded-lg border border-border p-4"
            >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-foreground">Item {index + 1}</p>
              <Button
                type="button"
                variant="destructive"
                onClick={() => onRemoveItem(index)}
                disabled={items.length <= 1}
                className="h-10 w-full px-4 sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Item
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="min-w-0 space-y-2 md:col-span-2">
                <Label
                  htmlFor={`${fieldIdPrefix}-product-${index}`}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Produk
                </Label>
                <SearchableSelect
                  id={`${fieldIdPrefix}-product-${index}`}
                  ref={(node) => {
                    itemSelectRefs.current[index] = node;
                  }}
                  autoFocus={autoFocus && index === 0}
                  value={item.productId}
                  onChange={(event) => onItemChange(index, "productId", event.target.value)}
                  options={productOptions}
                  loading={productsLoading}
                  disabled={productsDisabled}
                  loadingText="Memuat produk..."
                  placeholder={productPlaceholder}
                  searchPlaceholder="Cari produk atau SKU..."
                  emptyText={productEmptyText}
                  aria-invalid={Boolean(currentErrors.productId) || undefined}
                  className={getInvalidInputClassName(Boolean(currentErrors.productId))}
                />
                {currentErrors.productId ? (
                  <p className="text-xs text-destructive">{currentErrors.productId}</p>
                ) : null}
              </div>
              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor={`${fieldIdPrefix}-qty-${index}`}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Jumlah
                </Label>
                <Input
                  id={`${fieldIdPrefix}-qty-${index}`}
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(event) => onItemChange(index, "qty", event.target.value)}
                  aria-invalid={Boolean(currentErrors.qty) || undefined}
                  className={getInvalidInputClassName(Boolean(currentErrors.qty))}
                  required
                />
                {currentErrors.qty ? (
                  <p className="text-xs text-destructive">{currentErrors.qty}</p>
                ) : null}
              </div>
              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor={`${fieldIdPrefix}-price-${index}`}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {priceLabel}
                </Label>
                <CurrencyInput
                  id={`${fieldIdPrefix}-price-${index}`}
                  value={item[priceKey]}
                  onValueChange={(nextValue) => onItemChange(index, priceKey, nextValue)}
                  readOnly={priceReadOnly}
                  aria-readonly={priceReadOnly || undefined}
                  aria-invalid={Boolean(currentErrors[priceKey]) || undefined}
                  className={priceReadOnly ? "bg-muted/30" : getInvalidInputClassName(Boolean(currentErrors[priceKey]))}
                  placeholder="Mis. 10.000"
                  required
                />
                {currentErrors[priceKey] ? (
                  <p className="text-xs text-destructive">{currentErrors[priceKey]}</p>
                ) : null}
              </div>
            </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" onClick={onAddItem} className="h-10 w-full border-dashed">
        <Plus className="h-4 w-4" />
        {addButtonLabel}
      </Button>
    </div>
  );
}
