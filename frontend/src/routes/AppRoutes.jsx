import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { PageLoader } from '../components/common/Loader';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedCustomerRoute from './ProtectedCustomerRoute';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import PublicOnlyRoute from './PublicOnlyRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ProductListingPage from '../pages/public/ProductListingPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import WishlistPage from '../pages/customer/WishlistPage';

const CategoriesPage = lazy(() => import('../pages/public/CategoriesPage'));
const CategoryProductsPage = lazy(() => import('../pages/public/CategoryProductsPage'));
const OffersPage = lazy(() => import('../pages/public/OffersPage'));
const ProductComparisonPage = lazy(() => import('../pages/public/ProductComparisonPage'));
const CustomRequirementPage = lazy(() => import('../pages/public/CustomRequirementPage'));
const ForgotPasswordPage = lazy(() => import('../pages/public/ForgotPasswordPage'));
const StorePolicyPage = lazy(() => import('../pages/public/StorePolicyPage'));

const AccountDashboardPage = lazy(() => import('../pages/customer/AccountDashboardPage'));
const MyProfilePage = lazy(() => import('../pages/customer/MyProfilePage'));
const MyOrdersPage = lazy(() => import('../pages/customer/MyOrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/customer/OrderDetailPage'));
const MyReviewsPage = lazy(() => import('../pages/customer/MyReviewsPage'));
const NotificationsPage = lazy(() => import('../pages/customer/NotificationsPage'));
const CustomizationRequestsPage = lazy(() => import('../pages/customer/CustomizationRequestsPage'));
const CustomizationRequestDetailPage = lazy(() => import('../pages/customer/CustomizationRequestDetailPage'));

const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminProductDetailPage = lazy(() => import('../pages/admin/AdminProductDetailPage'));
const AdminInventoryPage = lazy(() => import('../pages/admin/AdminInventoryPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('../pages/admin/AdminOrderDetailPage'));
const AdminCustomersPage = lazy(() => import('../pages/admin/AdminCustomersPage'));
const AdminOffersPage = lazy(() => import('../pages/admin/AdminOffersPage'));
const AdminCustomizationRequestsPage = lazy(() => import('../pages/admin/AdminCustomizationRequestsPage'));
const AdminCustomRequirementsPage = lazy(() => import('../pages/admin/AdminCustomRequirementsPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const AdminReportsPage = lazy(() => import('../pages/admin/AdminReportsPage'));
const AdminNotificationsPage = lazy(() => import('../pages/admin/AdminNotificationsPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));

function LegacyCustomizationRedirect() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const search = params.toString();
  const target = id ? `/account/customizations/${id}` : '/account/customizations';
  return <Navigate to={`${target}${search ? `?${search}` : ''}`} replace />;
}

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* -------------------------------------------------------------
          PUBLIC STOREFRONT ROUTES (Wrapped in PublicLayout)
      ------------------------------------------------------------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryProductsPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/compare" element={<ProductComparisonPage />} />
        <Route path="/custom-requirement" element={<CustomRequirementPage />} />
        <Route path="/privacy" element={<StorePolicyPage />} />
        <Route path="/terms" element={<StorePolicyPage />} />
        <Route path="/shipping" element={<StorePolicyPage />} />
        
        {/* Cart and checkout stay closed until the customer signs in */}
        <Route element={<ProtectedCustomerRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Wishlist Shortcut Route */}
        <Route element={<ProtectedCustomerRoute />}>
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Route>

      {/* Login and register show the form only, with no storefront header or footer. */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* -------------------------------------------------------------
          CUSTOMER PORTAL ROUTES (Wrapped in CustomerLayout & Guard)
      ------------------------------------------------------------- */}
      <Route element={<ProtectedCustomerRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="/account" element={<Navigate to="/account/dashboard" replace />} />
          <Route path="/account/dashboard" element={<AccountDashboardPage />} />
          <Route path="/account/profile" element={<MyProfilePage />} />
          <Route path="/account/orders" element={<MyOrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/account/reviews" element={<MyReviewsPage />} />
          <Route path="/account/notifications" element={<NotificationsPage />} />
          <Route path="/account/customizations" element={<CustomizationRequestsPage />} />
          <Route path="/account/customizations/:id" element={<CustomizationRequestDetailPage />} />
          <Route path="/account/customization-requests" element={<LegacyCustomizationRedirect />} />
          <Route path="/account/customization-requests/:id" element={<LegacyCustomizationRedirect />} />
        </Route>
      </Route>

      {/* -------------------------------------------------------------
          ADMIN AUTH ROUTE (Stand-alone page)
      ------------------------------------------------------------- */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* -------------------------------------------------------------
          ADMIN MANAGEMENT PORTAL (Wrapped in AdminLayout & Guard)
      ------------------------------------------------------------- */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/:id" element={<AdminProductDetailPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/offers" element={<AdminOffersPage />} />
          <Route path="/admin/customizations" element={<AdminCustomizationRequestsPage />} />
          <Route path="/admin/custom-requirements" element={<AdminCustomRequirementsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* -------------------------------------------------------------
          404 NOT FOUND (Wrapped in PublicLayout)
      ------------------------------------------------------------- */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
