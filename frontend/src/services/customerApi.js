import api from './api';

export const customerApi = {
  // Auth
  register: (data) => api.post('/api/customer/auth/register', data),
  login: (data) => api.post('/api/customer/auth/login', data),
  googleLogin: (id_token) => api.post('/api/customer/auth/google', { id_token }),
  getAuthProfile: () => api.get('/api/customer/auth/profile', {}, 'CUSTOMER'),

  // Forgot Password Flow
  sendForgotOtp: (email) =>
    api.post('/api/customer/auth/forgot-password', { email }, { credentials: 'include' }),
  verifyForgotOtp: (email, otp) =>
    api.post('/api/customer/auth/verify-otp', { email, otp }, { credentials: 'include' }),
  resetPassword: (email, otp, new_password, confirm_password) =>
    api.post(
      '/api/customer/auth/reset-password',
      { email, otp, new_password, confirm_password },
      { credentials: 'include' }
    ),

  // Profile
  getProfile: () => api.get('/api/customer/profile', {}, 'CUSTOMER'),
  updateProfile: (formData) => api.put('/api/customer/profile', formData, {}, 'CUSTOMER'),

  // Wishlist
  getWishlist: () => api.get('/api/customer/wishlist', {}, 'CUSTOMER'),
  checkWishlist: (productId) => api.get(`/api/customer/wishlist/check/${productId}`, {}, 'CUSTOMER'),
  addToWishlist: (productId) => api.post('/api/customer/wishlist', { product_id: productId }, {}, 'CUSTOMER'),
  removeFromWishlist: (productId) => api.delete(`/api/customer/wishlist/${productId}`, {}, 'CUSTOMER'),

  // Cart
  getCart: () => api.get('/api/customer/cart', {}, 'CUSTOMER'),
  addToCart: (productId, variantId, quantity = 1) =>
    api.post('/api/customer/cart', { product_id: productId, variant_id: variantId, quantity }, {}, 'CUSTOMER'),
  updateCartQuantity: (cartItemId, quantity) =>
    api.patch(`/api/customer/cart/${cartItemId}`, { quantity }, {}, 'CUSTOMER'),
  removeFromCart: (cartItemId) => api.delete(`/api/customer/cart/${cartItemId}`, {}, 'CUSTOMER'),
  clearCart: () => api.delete('/api/customer/cart', {}, 'CUSTOMER'),

  // Orders
  placeOrder: (orderData) => api.post('/api/customer/orders', orderData, {}, 'CUSTOMER'),
  createRazorpayOrder: () => api.post('/api/customer/payments/razorpay-order', {}, {}, 'CUSTOMER'),
  getMyOrders: () => api.get('/api/customer/orders', {}, 'CUSTOMER'),
  getMyOrderById: (id) => api.get(`/api/customer/orders/${id}`, {}, 'CUSTOMER'),
  cancelMyOrder: (id) => api.patch(`/api/customer/orders/${id}/cancel`, {}, {}, 'CUSTOMER'),

  // Reviews
  addReview: (data) => api.post('/api/customer/reviews', data, {}, 'CUSTOMER'),
  getMyReviews: () => api.get('/api/customer/reviews/my', {}, 'CUSTOMER'),
  editReview: (id, data) => api.put(`/api/customer/reviews/${id}`, data, {}, 'CUSTOMER'),
  removeReview: (id) => api.delete(`/api/customer/reviews/${id}`, {}, 'CUSTOMER'),

  // Customization Requests
  createCustomizationRequest: (formData) =>
    api.post('/api/customer/customization-requests', formData, {}, 'CUSTOMER'),
  getMyCustomizationRequests: () => api.get('/api/customer/customization-requests', {}, 'CUSTOMER'),
  getMyCustomizationRequestById: (id) => api.get(`/api/customer/customization-requests/${id}`, {}, 'CUSTOMER'),
  updateMyCustomizationRequest: (id, data) =>
    api.put(`/api/customer/customization-requests/${id}`, data, {}, 'CUSTOMER'),

  // Notifications
  getNotifications: () => api.get('/api/customer/notifications', {}, 'CUSTOMER'),
  getUnreadNotifications: () => api.get('/api/customer/notifications/unread', {}, 'CUSTOMER'),
  getUnreadCount: () => api.get('/api/customer/notifications/unread-count', {}, 'CUSTOMER'),
  getNotificationById: (id) => api.get(`/api/customer/notifications/${id}`, {}, 'CUSTOMER'),
  markAsRead: (id) => api.patch(`/api/customer/notifications/${id}/read`, {}, {}, 'CUSTOMER'),
  markAllAsRead: () => api.patch('/api/customer/notifications/read-all', {}, {}, 'CUSTOMER'),
  deleteNotification: (id) => api.delete(`/api/customer/notifications/${id}`, {}, 'CUSTOMER'),
};

export default customerApi;
