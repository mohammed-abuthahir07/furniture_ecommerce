import api from './api';

let categoryCache = null;
let categoryCachedAt = 0;
let categoryRequest = null;
let productsRequest = null;
let offersRequest = null;
const CATEGORY_CACHE_MS = 2 * 60 * 1000;

export const publicApi = {
  // Categories are shared by the header, home page, and filters.
  getCategories: () => {
    const fresh = categoryCache && Date.now() - categoryCachedAt < CATEGORY_CACHE_MS;
    if (fresh) return Promise.resolve(categoryCache);
    if (categoryRequest) return categoryRequest;

    categoryRequest = api.get('/api/public/categories')
      .then((res) => {
        if (res?.success) {
          categoryCache = res;
          categoryCachedAt = Date.now();
        }
        return res;
      })
      .finally(() => {
        categoryRequest = null;
      });

    return categoryRequest;
  },
  getCategoryById: (id) => api.get(`/api/public/categories/${id}`),

  // Products
  getProducts: () => {
    if (productsRequest) return productsRequest;
    productsRequest = api.get('/api/public/products').finally(() => {
      productsRequest = null;
    });
    return productsRequest;
  },
  getProductById: (id) => api.get(`/api/public/products/${id}`),
  getProductReviews: (productId) => api.get(`/api/public/products/${productId}/reviews`),

  // Search & Filter
  filterProducts: (params = {}, options = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.material) query.append('material', params.material);
    if (params.wood_type) query.append('wood_type', params.wood_type);
    if (params.min_price !== undefined && params.min_price !== '') query.append('min_price', params.min_price);
    if (params.max_price !== undefined && params.max_price !== '') query.append('max_price', params.max_price);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return api.get(`/api/public/product-filters${queryString ? `?${queryString}` : ''}`, options);
  },

  // Offers
  getOffers: () => {
    if (offersRequest) return offersRequest;
    offersRequest = api.get('/api/public/offers').finally(() => {
      offersRequest = null;
    });
    return offersRequest;
  },
  getOfferById: (id) => api.get(`/api/public/offers/${id}`),

  // Recommendations
  getRecommendations: (productId, limit = 8) => {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      return Promise.resolve({ success: true, data: [] });
    }
    const safeLimit = Math.min(20, Math.max(1, Number(limit) || 8));
    return api.get(`/api/public/recommendations?product_id=${id}&limit=${safeLimit}`);
  },

  // Compare
  compareProducts: (productIds = []) => {
    const idsString = Array.isArray(productIds) ? productIds.join(',') : productIds;
    return api.get(`/api/public/products/compare?product_ids=${encodeURIComponent(idsString)}`);
  },

  // Submit Public Custom Requirement (Multipart form data)
  submitCustomRequirement: (formData) => {
    return api.post('/api/public/custom-requirements', formData);
  }
};

export default publicApi;
