import api from './api';

export const adminApi = {
  // Auth
  login: (data) => api.post('/api/admin/auth/login', data, {}, 'ADMIN'),
  getProfile: () => api.get('/api/admin/auth/profile', {}, 'ADMIN'),

  // Settings & Profile
  getSettingsProfile: () => api.get('/api/admin/settings/profile', {}, 'ADMIN'),
  updateSettingsProfile: (data) => api.put('/api/admin/settings/profile', data, {}, 'ADMIN'),
  changePassword: (data) => api.put('/api/admin/settings/change-password', data, {}, 'ADMIN'),
  getStoreSettings: () => api.get('/api/admin/settings/store', {}, 'ADMIN'),
  updateStoreSettings: (data) => api.put('/api/admin/settings/store', data, {}, 'ADMIN'),

  // Dashboard
  getDashboardSummary: () => api.get('/api/admin/dashboard/summary', {}, 'ADMIN'),
  getOrderStatusCounts: () => api.get('/api/admin/dashboard/order-status-counts', {}, 'ADMIN'),
  getRevenueSummary: () => api.get('/api/admin/dashboard/revenue', {}, 'ADMIN'),
  getTodayMetrics: () => api.get('/api/admin/dashboard/today', {}, 'ADMIN'),
  getLowStockVariants: () => api.get('/api/admin/dashboard/low-stock-variants', {}, 'ADMIN'),
  getOutOfStockVariants: () => api.get('/api/admin/dashboard/out-of-stock-variants', {}, 'ADMIN'),
  getRecentOrders: () => api.get('/api/admin/dashboard/recent-orders', {}, 'ADMIN'),
  getRecentProducts: () => api.get('/api/admin/dashboard/recent-products', {}, 'ADMIN'),
  getBestSellingProducts: () => api.get('/api/admin/dashboard/best-selling-products', {}, 'ADMIN'),

  // Categories
  getAllCategories: () => api.get('/api/admin/categories', {}, 'ADMIN'),
  getCategoryById: (id) => api.get(`/api/admin/categories/${id}`, {}, 'ADMIN'),
  createCategory: (formData) => api.post('/api/admin/categories', formData, {}, 'ADMIN'),
  updateCategory: (id, formData) => api.put(`/api/admin/categories/${id}`, formData, {}, 'ADMIN'),
  changeCategoryStatus: (id, status) => api.patch(`/api/admin/categories/${id}/status`, { status }, {}, 'ADMIN'),
  deleteCategory: (id) => api.delete(`/api/admin/categories/${id}`, {}, 'ADMIN'),

  // Products
  getAllProducts: () => api.get('/api/admin/products', {}, 'ADMIN'),
  getProductById: (id) => api.get(`/api/admin/products/${id}`, {}, 'ADMIN'),
  createProduct: (formData) => api.post('/api/admin/products', formData, {}, 'ADMIN'),
  updateProduct: (id, formData) => api.put(`/api/admin/products/${id}`, formData, {}, 'ADMIN'),
  changeProductStatus: (id, status) => api.patch(`/api/admin/products/${id}/status`, { status }, {}, 'ADMIN'),
  deleteProduct: (id) => api.delete(`/api/admin/products/${id}`, {}, 'ADMIN'),

  // Product Variants
  getVariantsByProductId: (productId) => api.get(`/api/admin/product-variants/product/${productId}`, {}, 'ADMIN'),
  getVariantById: (id) => api.get(`/api/admin/product-variants/${id}`, {}, 'ADMIN'),
  createVariant: (data) => api.post('/api/admin/product-variants', data, {}, 'ADMIN'),
  updateVariant: (id, data) => api.put(`/api/admin/product-variants/${id}`, data, {}, 'ADMIN'),
  updateVariantStock: (id, stock_quantity) =>
    api.patch(`/api/admin/product-variants/${id}/stock`, { stock_quantity }, {}, 'ADMIN'),
  changeVariantStatus: (id, status) =>
    api.patch(`/api/admin/product-variants/${id}/status`, { status }, {}, 'ADMIN'),
  deleteVariant: (id) => api.delete(`/api/admin/product-variants/${id}`, {}, 'ADMIN'),

  // Product Gallery Images
  getImagesByProductId: (productId) => api.get(`/api/admin/product-images/product/${productId}`, {}, 'ADMIN'),
  getImageById: (id) => api.get(`/api/admin/product-images/${id}`, {}, 'ADMIN'),
  addImage: (formData) => api.post('/api/admin/product-images', formData, {}, 'ADMIN'),
  updateImage: (id, data) => api.put(`/api/admin/product-images/${id}`, data, {}, 'ADMIN'),
  deleteImage: (id) => api.delete(`/api/admin/product-images/${id}`, {}, 'ADMIN'),

  // Offers
  getAllOffers: () => api.get('/api/admin/offers', {}, 'ADMIN'),
  getOfferById: (id) => api.get(`/api/admin/offers/${id}`, {}, 'ADMIN'),
  createOffer: (formData) => api.post('/api/admin/offers', formData, {}, 'ADMIN'),
  updateOffer: (id, formData) => api.put(`/api/admin/offers/${id}`, formData, {}, 'ADMIN'),
  changeOfferStatus: (id, status) => api.patch(`/api/admin/offers/${id}/status`, { status }, {}, 'ADMIN'),
  deleteOffer: (id) => api.delete(`/api/admin/offers/${id}`, {}, 'ADMIN'),

  // Orders
  getAllOrders: () => api.get('/api/admin/orders', {}, 'ADMIN'),
  getOrderById: (id) => api.get(`/api/admin/orders/${id}`, {}, 'ADMIN'),
  updateOrderStatus: (id, data) => api.patch(`/api/admin/orders/${id}/status`, data, {}, 'ADMIN'),

  // Customers
  getAllCustomers: () => api.get('/api/admin/customers', {}, 'ADMIN'),
  getCustomerById: (id) => api.get(`/api/admin/customers/${id}`, {}, 'ADMIN'),
  changeCustomerStatus: (id, status) => api.patch(`/api/admin/customers/${id}/status`, { status }, {}, 'ADMIN'),

  // Inventory
  getAllInventory: () => api.get('/api/admin/inventory', {}, 'ADMIN'),
  getInventorySummary: () => api.get('/api/admin/inventory/summary', {}, 'ADMIN'),
  getLowStockInventory: () => api.get('/api/admin/inventory/low-stock', {}, 'ADMIN'),
  getOutOfStockInventory: () => api.get('/api/admin/inventory/out-of-stock', {}, 'ADMIN'),
  getProductInventory: (productId) => api.get(`/api/admin/inventory/product/${productId}`, {}, 'ADMIN'),
  updateInventoryVariantStock: (variantId, stock_quantity) =>
    api.patch(`/api/admin/inventory/variant/${variantId}/stock`, { stock_quantity }, {}, 'ADMIN'),

  // Analytics
  getAnalyticsSummary: () => api.get('/api/admin/analytics/summary', {}, 'ADMIN'),
  getSalesTrend: (days = 30) => api.get(`/api/admin/analytics/sales-trend?days=${days}`, {}, 'ADMIN'),
  getRevenueAnalytics: () => api.get('/api/admin/analytics/revenue', {}, 'ADMIN'),
  getOrdersByStatusAnalytics: () => api.get('/api/admin/analytics/orders-by-status', {}, 'ADMIN'),
  getProductAnalytics: () => api.get('/api/admin/analytics/products', {}, 'ADMIN'),
  getBestSellingProductsAnalytics: (limit = 5) =>
    api.get(`/api/admin/analytics/best-selling-products?limit=${limit}`, {}, 'ADMIN'),
  getCategoryAnalytics: () => api.get('/api/admin/analytics/categories', {}, 'ADMIN'),
  getCustomerAnalytics: () => api.get('/api/admin/analytics/customers', {}, 'ADMIN'),
  getPaymentAnalytics: () => api.get('/api/admin/analytics/payments', {}, 'ADMIN'),
  getInventoryAnalytics: () => api.get('/api/admin/analytics/inventory', {}, 'ADMIN'),
  getBestSellingCategoriesAnalytics: (limit = 5) =>
    api.get(`/api/admin/analytics/best-selling-categories?limit=${limit}`, {}, 'ADMIN'),

  // Reports
  getSalesReport: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/api/admin/reports/sales${q ? `?${q}` : ''}`, {}, 'ADMIN');
  },
  getOrdersReport: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/api/admin/reports/orders${q ? `?${q}` : ''}`, {}, 'ADMIN');
  },
  getProductsReport: () => api.get('/api/admin/reports/products', {}, 'ADMIN'),
  getCustomersReport: () => api.get('/api/admin/reports/customers', {}, 'ADMIN'),
  getInventoryReport: () => api.get('/api/admin/reports/inventory', {}, 'ADMIN'),
  getPaymentsReport: () => api.get('/api/admin/reports/payments', {}, 'ADMIN'),
  getCategoriesReport: () => api.get('/api/admin/reports/categories', {}, 'ADMIN'),

  // Notifications
  getAllNotifications: () => api.get('/api/admin/notifications', {}, 'ADMIN'),
  getUnreadNotifications: () => api.get('/api/admin/notifications/unread', {}, 'ADMIN'),
  getUnreadCount: () => api.get('/api/admin/notifications/unread-count', {}, 'ADMIN'),
  getNotificationById: (id) => api.get(`/api/admin/notifications/${id}`, {}, 'ADMIN'),
  markAsRead: (id) => api.patch(`/api/admin/notifications/${id}/read`, {}, {}, 'ADMIN'),
  markAllAsRead: () => api.patch('/api/admin/notifications/read-all', {}, {}, 'ADMIN'),
  deleteNotification: (id) => api.delete(`/api/admin/notifications/${id}`, {}, 'ADMIN'),

  // Customization Requests
  getAllCustomizationRequests: () => api.get('/api/admin/customization-requests', {}, 'ADMIN'),
  getCustomizationRequestsByStatus: (status) =>
    api.get(`/api/admin/customization-requests/status/${status}`, {}, 'ADMIN'),
  getCustomizationRequestById: (id) => api.get(`/api/admin/customization-requests/${id}`, {}, 'ADMIN'),
  updateCustomizationStatus: (id, status) =>
    api.patch(`/api/admin/customization-requests/${id}/status`, { status }, {}, 'ADMIN'),
  replyCustomizationRequest: (id, data) =>
    api.put(`/api/admin/customization-requests/${id}/reply`, data, {}, 'ADMIN'),
  deleteCustomizationRequest: (id) =>
    api.delete(`/api/admin/customization-requests/${id}`, {}, 'ADMIN'),

  // Custom Requirements (View-Only)
  getAllCustomRequirements: () => api.get('/api/admin/custom-requirements', {}, 'ADMIN'),
  getCustomRequirementById: (id) => api.get(`/api/admin/custom-requirements/${id}`, {}, 'ADMIN'),
};

export default adminApi;
