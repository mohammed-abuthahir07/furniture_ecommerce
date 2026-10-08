import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import customerApi from '../services/customerApi';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isCustomerAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isCustomerAuthenticated) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.getWishlist();
      const items = Array.isArray(res.wishlist) ? res.wishlist : Array.isArray(res.data) ? res.data : null;
      if (res.success && items) {
        setWishlist(items);
        const ids = new Set(items.map((item) => Number(item.product_id)));
        setWishlistIds(ids);
      }
    } catch {
      // Ignore wishlist fetch error
    } finally {
      setIsLoading(false);
    }
  }, [isCustomerAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback((productId) => {
    return wishlistIds.has(Number(productId));
  }, [wishlistIds]);

  const toggleWishlist = async (productId) => {
    if (!isCustomerAuthenticated) {
      toastError('Please log in to manage your wishlist.');
      return false;
    }

    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      toastError('Showroom samples can be requested from the custom studio.');
      return false;
    }
    const currentlyWishlisted = wishlistIds.has(id);

    try {
      if (currentlyWishlisted) {
        const res = await customerApi.removeFromWishlist(id);
        if (res.success) {
          success(res.message || 'Removed from wishlist.');
          await fetchWishlist();
          return true;
        }
      } else {
        const res = await customerApi.addToWishlist(id);
        if (res.success) {
          success(res.message || 'Added to wishlist!');
          await fetchWishlist();
          return true;
        }
      }
      return false;
    } catch (err) {
      toastError(err.message || 'Failed to update wishlist.');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await customerApi.removeFromWishlist(Number(productId));
      if (res.success) {
        success(res.message || 'Removed from wishlist.');
        await fetchWishlist();
        return true;
      }
      return false;
    } catch (err) {
      toastError(err.message || 'Failed to remove from wishlist.');
      return false;
    }
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    isLoading,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
