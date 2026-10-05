import { useId } from "react";
import { CheckCircle2, CircleDashed, Loader2, Mail, Pencil, RefreshCcw, Save, X } from "lucide-react";
import { StatusAlert } from "../../components/common/StatusAlert";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ROLE_LABELS } from "../../constants/roles";
import { formatJakartaDateTime } from "../../lib/date-format";

function PendingEmailStep({ done, title }) {
  const Icon = done ? CheckCircle2 : CircleDashed;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/80 px-3 py-2">
      <div className="flex items-center gap-2 text-sm">
        <Icon className={`h-4 w-4 ${done ? "text-emerald-600" : "text-muted-foreground"}`} />
        <p className="font-medium text-foreground">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground">{done ? "Selesai" : "Menunggu"}</p>
    </div>
  );
}

export function ProfileInfoCard({
  loading,
  editing,
  saving,
  error,
  profile,
  form,
  onOpenEmailChange,
  onEdit,
  onCancel,
  onNameChange,
  onSubmit,
  onReload,
}) {
  const nameFieldId = useId();

  const pendingEmailChange = profile?.pendingEmailChange;
  const currentEmailConfirmed = Boolean(pendingEmailChange?.currentEmailConfirmedAt);
  const newEmailConfirmed = Boolean(pendingEmailChange?.newEmailConfirmedAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Kelola nama akun dan email login Anda.</CardDescription>
          </div>
          {!editing && !loading && profile ? (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Ubah
            </Button>
          ) : null}
          {editing ? (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Batal
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <StatusAlert message={error} tone="destructive" className="mb-4" />

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data profil...</p>
        ) : !profile ? (
          <div className="rounded-lg border border-dashed border-border p-5 text-center">
            <p className="text-sm font-medium text-foreground">Data akun belum tersedia.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Muat ulang halaman akun untuk mengambil profil terbaru.
            </p>
            <Button type="button" variant="outline" className="mt-4" onClick={onReload}>
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              Muat Ulang
            </Button>
          </div>
        ) : editing ? (
          <form className="space-y-4" noValidate onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor={nameFieldId}>Nama Lengkap</Label>
              <Input
                id={nameFieldId}
                value={form.name}
                onChange={(event) => onNameChange(event.target.value)}
                minLength={2}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Email Login</Label>
              <Input value={profile?.email || ""} readOnly />
              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={onOpenEmailChange}>
                  <Mail className="mr-1.5 h-3.5 w-3.5" />
                  Ubah Email Login
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Peran</Label>
              <Input value={ROLE_LABELS[profile?.role] || profile?.role || "-"} disabled />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Nama Lengkap</dt>
              <dd className="mt-0.5 text-sm text-foreground">{profile?.name || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email Login</dt>
              <dd className="mt-0.5 text-sm text-foreground">{profile?.email || "-"}</dd>
              {pendingEmailChange ? (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Perubahan email sedang diproses</p>
                    <p className="text-sm text-muted-foreground">{pendingEmailChange.newEmail}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      Aktif sampai {formatJakartaDateTime(pendingEmailChange.expiresAt)} WIB
                    </p>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <PendingEmailStep
                      done={currentEmailConfirmed}
                      title="Konfirmasi email lama"
                    />
                    <PendingEmailStep
                      done={newEmailConfirmed}
                      title="Konfirmasi email baru"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Peran</dt>
              <dd className="mt-0.5 text-sm text-foreground">{ROLE_LABELS[profile?.role] || profile?.role || "-"}</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
