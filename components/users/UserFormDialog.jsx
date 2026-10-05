import { ActiveStatusSelect } from "../common/ActiveStatusSelect";
import { FormDialogShell } from "../common/FormDialogShell";
import { getInvalidInputClassName } from "../common/form-field-state";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { USER_ROLES } from "../../constants/roles";
import { getUserFormInvalidState, USER_ROLE_OPTIONS } from "../../features/users/user-form-utils";

export function UserFormDialog({
  open,
  onOpenChange,
  form,
  isEditMode,
  isDefaultOwnerEdit,
  submitAttempted,
  saving,
  onSubmit,
  onFormChange,
}) {
  const { invalidName, invalidEmail, invalidPassword } = getUserFormInvalidState(form, submitAttempted);
  const availableRoleOptions = USER_ROLE_OPTIONS.filter(
    (option) => option.value !== USER_ROLES.OWNER || form.role === USER_ROLES.OWNER,
  );

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Ubah Pengguna" : "Tambah Pengguna"}
      description={
        isEditMode
          ? "Perbarui data pengguna sesuai kebutuhan operasional."
          : "Tambahkan akun pengguna baru. Peran akan otomatis diset sebagai karyawan."
      }
      formId="user-form"
      saving={saving}
      submitLabel={isEditMode ? "Simpan Perubahan" : "Tambah Pengguna"}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <div className="grid gap-2">
        <Label htmlFor="user-name" className="leading-none">Nama</Label>
        <Input
          id="user-name"
          name="create-user-full-name"
          value={form.name}
          onChange={(event) => onFormChange("name", event.target.value)}
          aria-invalid={invalidName || undefined}
          className={getInvalidInputClassName(invalidName)}
          minLength={2}
          required
          autoFocus
          autoComplete="off"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-email" className="leading-none">Email</Label>
        <Input
          id="user-email"
          name="create-user-email-address"
          type="email"
          value={form.email}
          onChange={(event) => onFormChange("email", event.target.value)}
          aria-invalid={invalidEmail || undefined}
          className={getInvalidInputClassName(invalidEmail)}
          required
          disabled={isDefaultOwnerEdit}
          autoComplete="off"
        />
      </div>
      {!isEditMode ? (
        <div className="grid gap-2">
          <Label htmlFor="user-password" className="leading-none">Password</Label>
          <Input
            id="user-password"
            name="create-user-new-password"
            type="password"
            minLength={8}
            value={form.password}
            onChange={(event) => onFormChange("password", event.target.value)}
            aria-invalid={invalidPassword || undefined}
            className={getInvalidInputClassName(invalidPassword)}
            required
            autoComplete="new-password"
          />
        </div>
      ) : null}
      {isEditMode ? (
        <div className="grid gap-2">
          <Label htmlFor="user-role" className="leading-none">Peran</Label>
          <Select
            id="user-role"
            value={form.role}
            onChange={(event) => onFormChange("role", event.target.value)}
            disabled={isDefaultOwnerEdit}
            options={availableRoleOptions}
          />
        </div>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="user-status" className="leading-none">Status</Label>
        <ActiveStatusSelect
          id="user-status"
          isActive={form.isActive}
          onActiveChange={(nextValue) => onFormChange("isActive", nextValue)}
          disabled={isEditMode && form.role === USER_ROLES.OWNER}
        />
        <p className="text-xs text-muted-foreground">
          Jika status nonaktif, pengguna tidak dapat login ke sistem.
        </p>
      </div>
    </FormDialogShell>
  );
}
