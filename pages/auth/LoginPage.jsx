import { useId } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthPageSeo } from "../../components/auth/AuthPageSeo";
import { AuthSplitLayout } from "../../components/auth/AuthSplitLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { BRAND_NAME, buildPageTitle } from "../../constants/brand";
import { useLoginPage } from "../../hooks/auth/useLoginPage";

export function LoginPage() {
  const pageState = useLoginPage();
  const emailFieldId = useId();
  const passwordFieldId = useId();

  return (
    <>
      <AuthPageSeo
        path="/login"
        title={buildPageTitle("Login")}
        description={`Login admin ${BRAND_NAME} untuk akses dashboard inventori, transaksi, dan laporan operasional.`}
      />

      <AuthSplitLayout heroTitle="Masuk ke panel admin.">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Masuk</h2>
        </div>

        <form className="mt-8 space-y-5" noValidate onSubmit={pageState.handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={emailFieldId}>Email</Label>
            <Input
              id={emailFieldId}
              type="email"
              value={pageState.email}
              onChange={(event) => pageState.setEmail(event.target.value)}
              inputMode="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={passwordFieldId}>Kata sandi</Label>
            <Input
              id={passwordFieldId}
              type="password"
              value={pageState.password}
              onChange={(event) => pageState.setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Ketik kata sandi"
              minLength={8}
              required
            />
          </div>

          <Button className="w-full rounded-full" size="lg" type="submit" disabled={pageState.loading}>
            {pageState.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {pageState.loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-6 text-sm">
          <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
            Lupa kata sandi
          </Link>
        </div>
      </AuthSplitLayout>
    </>
  );
}
