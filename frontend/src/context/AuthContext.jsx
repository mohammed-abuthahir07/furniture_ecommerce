import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { CUSTOMER_TOKEN_KEY, ADMIN_TOKEN_KEY } from '../services/api';
import customerApi from '../services/customerApi';
import adminApi from '../services/adminApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Customer State
  const [customer, setCustomer] = useState(null);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);

  // Admin State
  const [admin, setAdmin] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  // Load customer profile on mount
  const loadCustomer = useCallback(async () => {
    const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    if (!token) {
      setCustomer(null);
      setIsCustomerLoading(false);
      return;
    }

    try {
      const res = await customerApi.getProfile();
      if (res.success && res.customer) {
        setCustomer(res.customer);
      } else {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        setCustomer(null);
      }
    } catch {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      setCustomer(null);
    } finally {
      setIsCustomerLoading(false);
    }
  }, []);

  // Load admin profile on mount
  const loadAdmin = useCallback(async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setAdmin(null);
      setIsAdminLoading(false);
      return;
    }

    try {
      const res = await adminApi.getProfile();
      if (res.success && res.admin) {
        setAdmin(res.admin);
      } else {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAdmin(null);
      }
    } catch {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      setAdmin(null);
    } finally {
      setIsAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomer();
    loadAdmin();

    const handleAuthExpired = (e) => {
      if (e.detail?.role === 'ADMIN') {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAdmin(null);
      } else {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        setCustomer(null);
      }
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [loadCustomer, loadAdmin]);

  // Customer Auth Methods
  const customerLogin = (token, customerData) => {
    api.setAuthToken(token, 'CUSTOMER');
    setCustomer(customerData);
  };

  const customerLogout = () => {
    api.clearAuthToken('CUSTOMER');
    setCustomer(null);
  };

  const updateCustomerState = (updatedCustomer) => {
    setCustomer(updatedCustomer);
  };

  // Admin Auth Methods
  const adminLogin = (token, adminData) => {
    api.setAuthToken(token, 'ADMIN');
    setAdmin(adminData);
  };

  const adminLogout = () => {
    api.clearAuthToken('ADMIN');
    setAdmin(null);
  };

  const updateAdminState = (updatedAdmin) => {
    setAdmin(updatedAdmin);
  };

  const value = {
    // Customer
    customer,
    isCustomerAuthenticated: !!customer,
    isCustomerLoading,
    customerLogin,
    customerLogout,
    updateCustomerState,
    refreshCustomer: loadCustomer,

    // Admin
    admin,
    isAdminAuthenticated: !!admin,
    isAdminLoading,
    adminLogin,
    adminLogout,
    updateAdminState,
    refreshAdmin: loadAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
