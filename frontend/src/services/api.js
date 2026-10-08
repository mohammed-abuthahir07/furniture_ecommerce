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

const TECHNICAL_MESSAGE = /sql|ER_|ECONN|AxiosError|ERR_NETWORK|Cannot read properties|syntax error|stack/i;

function toUserMessage(status, message) {
  const text = String(message || '').trim();
  if (status === 0 || TECHNICAL_MESSAGE.test(text)) {
    if (status === 0 || /ECONN|ERR_NETWORK|fetch/i.test(text)) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return 'Something went wrong on our side. Please try again in a moment.';
  }
  if (text) return text;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status === 409) return 'This action conflicts with the current data. Please refresh and try again.';
  if (status === 422 || status === 400) return 'Please check the highlighted fields and try again.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'Something went wrong on our side. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

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
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('auth-expired', { detail: { role } }));
        }

        const error = new Error(toUserMessage(response.status, data.message));
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      if (err.name === 'TypeError' && String(err.message).toLowerCase().includes('fetch')) {
        const netErr = new Error('Unable to connect to the server. Please check your internet connection and try again.');
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
