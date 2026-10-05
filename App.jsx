import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { USER_ROLES } from "./constants/roles.js";
import { lazyNamed } from "./lib/lazy-named";

const AdminLayout = lazyNamed(() => import("./components/layout/AdminLayout.jsx"), "AdminLayout");
const LoginPage = lazyNamed(() => import("./pages/auth/LoginPage.jsx"), "LoginPage");
const ForgotPasswordPage = lazyNamed(() => import("./pages/auth/ForgotPasswordPage.jsx"), "ForgotPasswordPage");
const ConfirmEmailChangePage = lazyNamed(() => import("./pages/auth/ConfirmEmailChangePage.jsx"), "ConfirmEmailChangePage");
const DashboardPage = lazyNamed(() => import("./pages/admin/DashboardPage.jsx"), "DashboardPage");
const CategoriesPage = lazyNamed(() => import("./pages/admin/CategoriesPage.jsx"), "CategoriesPage");
const SuppliersPage = lazyNamed(() => import("./pages/admin/SuppliersPage.jsx"), "SuppliersPage");
const ProductsPage = lazyNamed(() => import("./pages/admin/ProductsPage.jsx"), "ProductsPage");
const ProductDetailPage = lazyNamed(() => import("./pages/admin/ProductDetailPage.jsx"), "ProductDetailPage");
const PurchasesPage = lazyNamed(() => import("./pages/admin/PurchasesPage.jsx"), "PurchasesPage");
const SalesPage = lazyNamed(() => import("./pages/admin/SalesPage.jsx"), "SalesPage");
const PurchaseDetailPage = lazyNamed(() => import("./pages/admin/PurchaseDetailPage.jsx"), "PurchaseDetailPage");
const SaleDetailPage = lazyNamed(() => import("./pages/admin/SaleDetailPage.jsx"), "SaleDetailPage");
const ReportsPage = lazyNamed(() => import("./pages/admin/ReportsPage.jsx"), "ReportsPage");
const ReportDetailPage = lazyNamed(() => import("./pages/admin/ReportDetailPage.jsx"), "ReportDetailPage");
const UsersPage = lazyNamed(() => import("./pages/admin/UsersPage.jsx"), "UsersPage");
const ProfilePage = lazyNamed(() => import("./pages/admin/ProfilePage.jsx"), "ProfilePage");
const PublicHomePage = lazyNamed(() => import("./pages/public/PublicHomePage.jsx"), "PublicHomePage");
const PublicProductsPage = lazyNamed(() => import("./pages/public/PublicProductsPage.jsx"), "PublicProductsPage");

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
      Memuat halaman...
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/produk" element={<PublicProductsPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/confirm-email-change" element={<ConfirmEmailChangePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="products" element={<ProductsPage mode="list" />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route
            path="products/new"
            element={(
              <ProtectedRoute allowedRoles={[USER_ROLES.OWNER, USER_ROLES.EMPLOYEE]}>
                <ProductsPage mode="form" />
              </ProtectedRoute>
            )}
          />
          <Route
            path="products/edit/:id"
            element={(
              <ProtectedRoute allowedRoles={[USER_ROLES.OWNER, USER_ROLES.EMPLOYEE]}>
                <ProductsPage mode="form" />
              </ProtectedRoute>
            )}
          />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="purchases/:id" element={<PurchaseDetailPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/:id" element={<SaleDetailPage />} />
          <Route path="reports/:reportType/:date" element={<ReportDetailPage />} />
          <Route
            path="users"
            element={(
              <ProtectedRoute allowedRoles={[USER_ROLES.OWNER]}>
                <UsersPage />
              </ProtectedRoute>
            )}
          />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<Navigate to="/admin/profile" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
