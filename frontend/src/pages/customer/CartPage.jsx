import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../../components/common/QuantitySelector';
import PriceDisplay from '../../components/common/PriceDisplay';
import EmptyState from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/Loader';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import { formatCurrency } from '../../utils/formatters';

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalItems, subtotal, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();

  if (isLoading && cartItems.length === 0) {
    return <PageLoader text="Loading your shopping cart..." />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
            Review your selected furniture pieces before proceeding to checkout.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={clearCart}
            style={{ color: 'var(--danger-500)', borderColor: 'var(--neutral-300)' }}
          >
            <Trash2 size={14} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your furniture cart is empty"
          description="Explore our living, dining, and bedroom furniture collections to add items to your cart."
          actionLabel="Browse Furniture Catalog"
          actionTo="/products"
        />
      ) : (
        <div className="cart-checkout-layout">
          {/* Cart Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={getImageUrl(item.main_image)}
                  alt={item.product_name}
                  className="cart-item-image"
                  onError={handleImageError}
                />

                <div>
                  <Link
                    to={`/products/${item.product_id}`}
                    style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--neutral-900)', display: 'block', marginBottom: 2 }}
                  >
                    {item.product_name}
                  </Link>

                  <div style={{ fontSize: '0.82rem', color: 'var(--neutral-500)', marginBottom: '0.5rem' }}>
                    Variant: <strong style={{ color: 'var(--neutral-800)' }}>{item.variant_name}</strong>
                    {item.color && ` (${item.color})`}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      Unit Price: {formatCurrency(item.unit_price || item.selling_price)}
                    </div>

                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(newQty) => updateQuantity(item.id, newQty)}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                  <button
                    type="button"
                    className="modal-close-btn cart-item-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item from cart"
                  >
                    <Trash2 size={16} color="var(--danger-500)" />
                  </button>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>Item Total</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
                      {formatCurrency(item.item_subtotal || Number(item.selling_price) * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="order-summary-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Order Summary
            </h3>

            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span style={{ fontWeight: 700, color: 'var(--neutral-800)' }}>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Delivery</span>
              <span style={{ color: 'var(--success-500)', fontWeight: 600 }}>Calculated at Checkout</span>
            </div>

            <div className="summary-total-row">
              <span>Estimated Total</span>
              <span style={{ color: 'var(--primary-700)' }}>{formatCurrency(subtotal)}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={() => navigate('/checkout')}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={15} color="var(--primary-600)" />
                <span>White-Glove delivery & on-site assembly included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} color="var(--primary-600)" />
                <span>10-Year Timber Warranty coverage</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
