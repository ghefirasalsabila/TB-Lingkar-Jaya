import { useId } from "react";
import { KeyRound, Loader2, Save, X } from "lucide-react";
import { PASSWORD_POLICY_MESSAGE } from "../../lib/password-policy";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function ProfileSecurityCard({
  editing,
  loading,
  currentPassword,
  newPassword,
  onEdit,
  onCancel,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onOpenForgotPassword,
  onSubmit,
}) {
  const currentPasswordFieldId = useId();
  const newPasswordFieldId = useId();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Keamanan</CardTitle>
            <CardDescription>Kelola kata sandi akun Anda.</CardDescription>
          </div>
          {!editing ? (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <KeyRound className="mr-1.5 h-3.5 w-3.5" />
              Ubah Kata Sandi
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
        {editing ? (
          <form className="space-y-4" noValidate onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor={currentPasswordFieldId}>Kata Sandi Saat Ini</Label>
              <Input
                id={currentPasswordFieldId}
                type="password"
                value={currentPassword}
                onChange={(event) => onCurrentPasswordChange(event.target.value)}
                minLength={8}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={newPasswordFieldId}>Kata Sandi Baru</Label>
              <Input
                id={newPasswordFieldId}
                type="password"
                value={newPassword}
                onChange={(event) => onNewPasswordChange(event.target.value)}
                minLength={8}
                required
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {PASSWORD_POLICY_MESSAGE}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto px-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={onOpenForgotPassword}
              >
                Lupa kata sandi?
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {loading ? "Memproses..." : "Simpan Kata Sandi"}
              </Button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Kata Sandi</dt>
              <dd className="mt-0.5 text-sm text-foreground">••••••••</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
