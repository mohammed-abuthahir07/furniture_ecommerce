import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import CategoriesPage from '../pages/public/CategoriesPage';
import CategoryProductsPage from '../pages/public/CategoryProductsPage';
import ProductListingPage from '../pages/public/ProductListingPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import OffersPage from '../pages/public/OffersPage';
import ProductComparisonPage from '../pages/public/ProductComparisonPage';
import CustomRequirementPage from '../pages/public/CustomRequirementPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import StorePolicyPage from '../pages/public/StorePolicyPage';

// Customer Pages
import AccountDashboardPage from '../pages/customer/AccountDashboardPage';
import MyProfilePage from '../pages/customer/MyProfilePage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import MyOrdersPage from '../pages/customer/MyOrdersPage';
import OrderDetailPage from '../pages/customer/OrderDetailPage';
import WishlistPage from '../pages/customer/WishlistPage';
import MyReviewsPage from '../pages/customer/MyReviewsPage';
import NotificationsPage from '../pages/customer/NotificationsPage';
import CustomizationRequestsPage from '../pages/customer/CustomizationRequestsPage';
import CustomizationRequestDetailPage from '../pages/customer/CustomizationRequestDetailPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminProductDetailPage from '../pages/admin/AdminProductDetailPage';
import AdminInventoryPage from '../pages/admin/AdminInventoryPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from '../pages/admin/AdminOrderDetailPage';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage';
import AdminOffersPage from '../pages/admin/AdminOffersPage';
import AdminCustomizationRequestsPage from '../pages/admin/AdminCustomizationRequestsPage';
import AdminCustomRequirementsPage from '../pages/admin/AdminCustomRequirementsPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

const AppRoutes = () => {
  return (
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
        
        {/* Cart is publicly viewable */}
        <Route path="/cart" element={<CartPage />} />

        {/* Customer Auth Pages (PublicOnly) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Checkout - requires Customer Auth */}
        <Route element={<ProtectedCustomerRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Wishlist Shortcut Route */}
        <Route element={<ProtectedCustomerRoute />}>
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
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
  );
};

export default AppRoutes;
