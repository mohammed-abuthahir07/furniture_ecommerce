/**
 * Centralized HTTP client wrapper.
 * Manages authorization headers, multipart uploads, and unified error handling.
 */

/**
 * In development, requests stay on the Vite origin so the /api proxy
 * and /uploads middleware can serve the backend without cross-origin cookies.
 * Production uses VITE_API_BASE_URL.
 */
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

const BASE_URL = API_BASE_URL;

export const CUSTOMER_TOKEN_KEY = 'furniture_customer_token';
export const ADMIN_TOKEN_KEY = 'furniture_admin_token';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getAuthToken(role = 'CUSTOMER') {
    const key = role === 'ADMIN' ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY;
    return localStorage.getItem(key) || '';
  }

  setAuthToken(token, role = 'CUSTOMER') {
    const key = role === 'ADMIN' ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY;
    if (token) {
      localStorage.setItem(key, token);
    } else {
      localStorage.removeItem(key);
    }
  }

  clearAuthToken(role = 'CUSTOMER') {
    const key = role === 'ADMIN' ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY;
    localStorage.removeItem(key);
  }

  async request(endpoint, options = {}, role = 'CUSTOMER') {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const headers = { ...options.headers };

    // Inject Bearer token if available
    const token = this.getAuthToken(role);
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // If body is not FormData, set Content-Type to JSON
    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && !isFormData && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle 401 Unauthorized token expiry
        if (response.status === 401) {
          // Token expired or invalid
          // We can dispatch custom event if needed
          window.dispatchEvent(new CustomEvent('auth-expired', { detail: { role } }));
        }

        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const netErr = new Error('Unable to connect to server. Please ensure the backend is running.');
        netErr.status = 0;
        throw netErr;
      }
      throw err;
    }
  }

  get(endpoint, options = {}, role = 'CUSTOMER') {
    return this.request(endpoint, { ...options, method: 'GET' }, role);
  }

  post(endpoint, body, options = {}, role = 'CUSTOMER') {
    return this.request(endpoint, { ...options, method: 'POST', body }, role);
  }

  put(endpoint, body, options = {}, role = 'CUSTOMER') {
    return this.request(endpoint, { ...options, method: 'PUT', body }, role);
  }

  patch(endpoint, body, options = {}, role = 'CUSTOMER') {
    return this.request(endpoint, { ...options, method: 'PATCH', body }, role);
  }

  delete(endpoint, options = {}, role = 'CUSTOMER') {
    return this.request(endpoint, { ...options, method: 'DELETE' }, role);
  }
}

export const api = new ApiClient();
export default api;
