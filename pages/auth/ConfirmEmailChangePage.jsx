import { CheckCircle2, Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthPageSeo } from "../../components/auth/AuthPageSeo";
import { AuthSplitLayout } from "../../components/auth/AuthSplitLayout";
import { StatusAlert } from "../../components/common/StatusAlert";
import { Button } from "../../components/ui/button";
import { BRAND_NAME, buildPageTitle } from "../../constants/brand";
import { useConfirmEmailChangePage } from "../../hooks/auth/useConfirmEmailChangePage";

export function ConfirmEmailChangePage() {
  const pageState = useConfirmEmailChangePage();

  return (
    <>
      <AuthPageSeo
        path="/confirm-email-change"
        title={buildPageTitle("Konfirmasi Ubah Email")}
        description={`Konfirmasi perubahan email login ${BRAND_NAME}.`}
      />

      <AuthSplitLayout heroTitle="Konfirmasi perubahan email login.">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Konfirmasi Ubah Email</h2>
          <p className="text-sm text-muted-foreground">
            Klik tombol di bawah untuk memproses tautan konfirmasi email ini.
          </p>
        </div>

        <form className="mt-8 space-y-5" noValidate onSubmit={pageState.handleSubmit}>
          <StatusAlert message={pageState.error} tone="destructive" />

          {!pageState.completed ? (
            <Button className="w-full rounded-full" size="lg" type="submit" disabled={pageState.loading || !pageState.token}>
              {pageState.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {pageState.loading ? "Memproses..." : "Konfirmasi Sekarang"}
            </Button>
          ) : (
            <Button asChild className="w-full rounded-full" size="lg">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Kembali ke Login
              </Link>
            </Button>
          )}
        </form>
      </AuthSplitLayout>
    </>
  );
}
