import { ActiveStatusSelect } from "../common/ActiveStatusSelect";
import { FormDialogShell } from "../common/FormDialogShell";
import { getInvalidInputClassName } from "../common/form-field-state";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function CategoryFormDialog({ open, onOpenChange, form, editingId, submitAttempted, saving, isOwner, onSubmit, onFormChange }) {
  const invalidName = submitAttempted && form.name.trim().length < 2;

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={editingId ? "Ubah Kategori" : "Tambah Kategori"}
      description={
        editingId
          ? "Perbarui nama kategori, lalu simpan perubahan."
          : "Masukkan nama kategori baru untuk dipakai pada pengelompokan produk."
      }
      formId="category-form"
      formClassName="grid gap-3"
      saving={saving}
      submitLabel={editingId ? "Simpan Perubahan" : "Tambah Kategori"}
      onSubmit={onSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="category-name" className="leading-none">Nama kategori</Label>
        <Input
          id="category-name"
          placeholder="Mis. Material, Listrik, Paku"
          value={form.name}
          onChange={(event) => onFormChange("name", event.target.value)}
          aria-invalid={invalidName || undefined}
          className={getInvalidInputClassName(invalidName)}
          minLength={2}
          maxLength={100}
          required
          autoFocus
        />
      </div>
      {isOwner ? (
        <div className="grid gap-2">
          <Label htmlFor="category-status" className="leading-none">Status</Label>
          <ActiveStatusSelect
            id="category-status"
            isActive={form.isActive}
            onActiveChange={(nextValue) => onFormChange("isActive", nextValue)}
          />
          <p className="text-xs text-muted-foreground">Jika status dinonaktifkan, data tidak akan muncul di akun karyawan. Kategori yang masih dipakai produk aktif tidak bisa dinonaktifkan.</p>
        </div>
      ) : null}
    </FormDialogShell>
  );
}
