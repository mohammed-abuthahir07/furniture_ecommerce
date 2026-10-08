import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import customerApi from '../services/customerApi';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isCustomerAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [cart, setCart] = useState({
    items: [],
    total_items: 0,
    subtotal: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isCustomerAuthenticated) {
      setCart({ items: [], total_items: 0, subtotal: 0 });
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.getCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch {
      // Cart fetch failure
    } finally {
      setIsLoading(false);
    }
  }, [isCustomerAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    if (!isCustomerAuthenticated) {
      toastError('Please log in to add items to your cart.');
      return false;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.addToCart(productId, variantId, quantity);
      if (res.success) {
        success(res.message || 'Item added to cart!');
        await fetchCart();
        return true;
      }
      return false;
    } catch (err) {
      toastError(err.message || 'Failed to add item to cart.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return false;
    try {
      const res = await customerApi.updateCartQuantity(cartItemId, newQuantity);
      if (res.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (err) {
      toastError(err.message || 'Failed to update quantity.');
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await customerApi.removeFromCart(cartItemId);
      if (res.success) {
        success(res.message || 'Item removed from cart.');
        await fetchCart();
        return true;
      }
      return false;
    } catch (err) {
      toastError(err.message || 'Failed to remove item.');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const res = await customerApi.clearCart();
      if (res.success) {
        setCart({ items: [], total_items: 0, subtotal: 0 });
        return true;
      }
      return false;
    } catch (err) {
      toastError(err.message || 'Failed to clear cart.');
      return false;
    }
  };

  const value = {
    cart,
    cartItems: cart.items || [],
    totalItems: cart.total_items || 0,
    subtotal: cart.subtotal || 0,
    isLoading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
