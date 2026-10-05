import { ActiveStatusSelect } from "../common/ActiveStatusSelect";
import { FormDialogShell } from "../common/FormDialogShell";
import { getInvalidInputClassName } from "../common/form-field-state";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { SearchableMultiSelect } from "../ui/searchable-multi-select";

export function SupplierFormDialog({ open, onOpenChange, form, editingId, submitAttempted, saving, isOwner, categories, categoriesLoading, onSubmit, onFormChange }) {
  const invalidName = submitAttempted && form.name.trim().length < 2;
  const invalidPhone = submitAttempted && form.phone.trim() && form.phone.trim().length < 6;
  const invalidAddress = submitAttempted && form.address.trim() && form.address.trim().length < 4;
  const invalidCategories = submitAttempted && form.categoryIds.length === 0;
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    disabled: !category.isActive,
  }));
  const selectedCategories = categories.filter((category) => form.categoryIds.includes(category.id));

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={editingId ? "Ubah Supplier" : "Tambah Supplier"}
      description={
        editingId
          ? "Perbarui informasi supplier, lalu simpan perubahan."
          : "Lengkapi data supplier baru untuk kebutuhan pasokan."
      }
      formId="supplier-form"
      maxWidthClassName="sm:max-w-lg"
      saving={saving}
      submitLabel="Simpan"
      onSubmit={onSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="supplier-name" className="leading-none">Nama Supplier</Label>
        <Input
          id="supplier-name"
          value={form.name}
          onChange={(event) => onFormChange("name", event.target.value)}
          aria-invalid={invalidName || undefined}
          className={getInvalidInputClassName(invalidName)}
          minLength={2}
          maxLength={120}
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label className="leading-none">Kategori Produk</Label>
        <SearchableMultiSelect
          options={categoryOptions}
          value={form.categoryIds}
          onValueChange={(nextValue) => onFormChange("categoryIds", nextValue)}
          placeholder="Pilih kategori produk"
          searchPlaceholder="Cari kategori..."
          loading={categoriesLoading}
          loadingText="Memuat kategori..."
          emptyText="Kategori tidak ditemukan."
          aria-invalid={invalidCategories || undefined}
          className={getInvalidInputClassName(invalidCategories)}
        />
        {invalidCategories ? (
          <p className="text-xs text-destructive">Pilih minimal satu kategori produk.</p>
        ) : selectedCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedCategories.map((category) => (
              <Badge key={category.id} variant="outline">{category.name}</Badge>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplier-phone" className="leading-none">Telepon <span className="font-normal text-muted-foreground">(Opsional)</span></Label>
        <Input
          id="supplier-phone"
          value={form.phone}
          onChange={(event) => onFormChange("phone", event.target.value)}
          aria-invalid={invalidPhone || undefined}
          className={getInvalidInputClassName(invalidPhone)}
          minLength={6}
          maxLength={30}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplier-address" className="leading-none">Alamat <span className="font-normal text-muted-foreground">(Opsional)</span></Label>
        <Input
          id="supplier-address"
          value={form.address}
          onChange={(event) => onFormChange("address", event.target.value)}
          aria-invalid={invalidAddress || undefined}
          className={getInvalidInputClassName(invalidAddress)}
          minLength={4}
          maxLength={255}
        />
      </div>
      {isOwner ? (
        <div className="space-y-2">
          <Label htmlFor="supplier-status" className="leading-none">Status</Label>
          <ActiveStatusSelect
            id="supplier-status"
            isActive={form.isActive}
            onActiveChange={(nextValue) => onFormChange("isActive", nextValue)}
          />
          <p className="text-xs text-muted-foreground">Jika status dinonaktifkan, data tidak akan muncul di akun karyawan.</p>
        </div>
      ) : null}
    </FormDialogShell>
  );
}
