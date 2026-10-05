import { useId } from "react";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthPageSeo } from "../../components/auth/AuthPageSeo";
import { AuthSplitLayout } from "../../components/auth/AuthSplitLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { BRAND_NAME, buildPageTitle } from "../../constants/brand";
import { useForgotPasswordPage } from "../../hooks/auth/useForgotPasswordPage";
import { PASSWORD_POLICY_MESSAGE } from "../../lib/password-policy";

export function ForgotPasswordPage() {
  const pageState = useForgotPasswordPage();
  const emailFieldId = useId();
  const newPasswordFieldId = useId();
  const confirmPasswordFieldId = useId();

  return (
    <>
      <AuthPageSeo
        path="/forgot-password"
        title={buildPageTitle(pageState.isResetMode ? "Atur Ulang Kata Sandi" : "Lupa Kata Sandi")}
        description={`Pemulihan akun admin ${BRAND_NAME} untuk meminta tautan reset atau mengatur ulang kata sandi.`}
      />

      <AuthSplitLayout heroTitle={pageState.isResetMode ? "Atur ulang kata sandi." : "Pulihkan akses akun."}>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            {pageState.isResetMode ? "Atur Ulang Kata Sandi" : "Lupa Kata Sandi"}
          </h2>
        </div>

        <form className="mt-8 space-y-5" noValidate onSubmit={pageState.handleSubmit}>
          {pageState.isResetMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor={newPasswordFieldId}>Kata sandi baru</Label>
                <Input
                  id={newPasswordFieldId}
                  type="password"
                  value={pageState.newPassword}
                  onChange={(event) => pageState.setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Masukkan kata sandi baru"
                  minLength={8}
                  required
                />
                <p className="text-xs text-muted-foreground">{PASSWORD_POLICY_MESSAGE}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={confirmPasswordFieldId}>Konfirmasi kata sandi</Label>
                <Input
                  id={confirmPasswordFieldId}
                  type="password"
                  value={pageState.confirmPassword}
                  onChange={(event) => pageState.setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi baru"
                  minLength={8}
                  required
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={emailFieldId}>Email</Label>
              <Input
                id={emailFieldId}
                type="email"
                value={pageState.email}
                onChange={(event) => pageState.setEmail(event.target.value)}
                inputMode="email"
                autoComplete="email"
                placeholder="nama@domain.com"
                required
              />
            </div>
          )}

          <Button className="w-full rounded-full" size="lg" type="submit" disabled={pageState.loading}>
            {pageState.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : pageState.isResetMode ? (
              <Save className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {pageState.loading
              ? "Memproses..."
              : pageState.isResetMode
                ? "Simpan Kata Sandi Baru"
                : "Kirim Permintaan Reset"}
          </Button>
        </form>

        <div className="mt-6 text-sm">
          <Link to="/login" className="font-medium text-primary hover:text-primary/80">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            Kembali ke login
          </Link>
        </div>
      </AuthSplitLayout>
    </>
  );
}
