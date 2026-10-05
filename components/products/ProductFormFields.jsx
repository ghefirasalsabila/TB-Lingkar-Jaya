import { useId } from "react";
import { ActiveStatusSelect } from "../common/ActiveStatusSelect";
import { getInvalidInputClassName } from "../common/form-field-state";
import { CurrencyInput } from "../ui/currency-input";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SearchableSelect } from "../ui/searchable-select";
import {
  PRODUCT_NUMBER_FIELDS,
  PRODUCT_TEXT_FIELDS,
} from "./product-field-config";

function ProductInputField({
  inputId,
  field,
  kind = "text",
  label,
  helperText,
  type = "text",
  form,
  getLabelClassName,
  isFieldInvalid,
  onFormChange,
  onFieldBlur,
  inputProps = {},
}) {
  const InputComponent = kind === "currency" ? CurrencyInput : Input;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className={getLabelClassName(field)}>{label}</Label>
      <InputComponent
        id={inputId}
        type={type}
        min={type === "number" ? 0 : undefined}
        value={form[field]}
        onChange={kind === "currency" ? undefined : (event) => onFormChange(field, event.target.value)}
        onValueChange={kind === "currency" ? (nextValue) => onFormChange(field, nextValue) : undefined}
        onBlur={() => onFieldBlur(field)}
        aria-invalid={isFieldInvalid(field) || undefined}
        {...inputProps}
      />
      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

export function ProductFormFields({
  form,
  categories,
  categoriesLoading = false,
  isOwner,
  getLabelClassName,
  isFieldInvalid,
  onFormChange,
  onFieldBlur,
}) {
  const invalidCategory = isFieldInvalid("categoryId");
  const formFieldIdPrefix = useId();
  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const formGridClassName = "grid gap-4 md:grid-cols-2";

  return (
    <div className={formGridClassName}>
      <div className="space-y-2">
        <Label htmlFor={`${formFieldIdPrefix}-categoryId`} className={getLabelClassName("categoryId")}>Kategori</Label>
        <SearchableSelect
          id={`${formFieldIdPrefix}-categoryId`}
          value={form.categoryId}
          onChange={(event) => onFormChange("categoryId", event.target.value)}
          onBlur={() => onFieldBlur("categoryId")}
          aria-invalid={invalidCategory || undefined}
          className={getInvalidInputClassName(invalidCategory)}
          loading={categoriesLoading}
          loadingText="Memuat kategori..."
          placeholder="Pilih kategori"
          searchPlaceholder="Cari kategori..."
          emptyText="Kategori tidak ditemukan."
          required
          options={categoryOptions}
        />
      </div>

      {PRODUCT_TEXT_FIELDS.map((config) => (
        <ProductInputField
          key={config.field}
          inputId={`${formFieldIdPrefix}-${config.field}`}
          form={form}
          getLabelClassName={getLabelClassName}
          isFieldInvalid={isFieldInvalid}
          onFormChange={onFormChange}
          onFieldBlur={onFieldBlur}
          {...config}
        />
      ))}

      <div className="space-y-2">
        <Label htmlFor={`${formFieldIdPrefix}-stock`} className="text-sm font-medium leading-none">Stok</Label>
        <Input
          id={`${formFieldIdPrefix}-stock`}
          type="number"
          min={0}
          value={form.stock}
          readOnly
          disabled
          className="bg-muted/30"
        />
        <p className="text-xs text-muted-foreground">
          Stok diatur lewat pembelian dan penjualan.
        </p>
      </div>

      {PRODUCT_NUMBER_FIELDS.map((config) => (
        <ProductInputField
          key={config.field}
          inputId={`${formFieldIdPrefix}-${config.field}`}
          type={config.kind === "currency" ? "text" : "number"}
          form={form}
          getLabelClassName={getLabelClassName}
          isFieldInvalid={isFieldInvalid}
          onFormChange={onFormChange}
          onFieldBlur={onFieldBlur}
          inputProps={{ required: true, ...(config.inputProps || {}) }}
          {...config}
        />
      ))}

      {isOwner ? (
        <div className="col-span-full space-y-2">
          <Label htmlFor={`${formFieldIdPrefix}-status`}>Status</Label>
          <ActiveStatusSelect
            id={`${formFieldIdPrefix}-status`}
            isActive={form.isActive}
            onActiveChange={(nextValue) => onFormChange("isActive", nextValue)}
          />
          <p className="text-xs text-muted-foreground">
            Jika status dinonaktifkan, data tidak akan muncul di akun karyawan.
          </p>
        </div>
      ) : null}
    </div>
  );
}
