import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../../components/common/QuantitySelector';
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
    <div className="container cart-page">
      <div className="cart-page-header">
        <div>
          <h1>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
          <p>Review your selected furniture pieces before proceeding to checkout.</p>
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
            {cartItems.map((item) => {
              const cartItemId = item.cart_item_id ?? item.id;
              return (
              <article key={cartItemId} className="cart-item-card">
                <img
                  src={getImageUrl(item.main_image)}
                  alt={item.product_name}
                  className="cart-item-image"
                  onError={handleImageError}
                />

                <div className="cart-item-info">
                  <Link to={`/products/${item.product_id}`}>{item.product_name}</Link>
                  <p>
                    {item.variant_name}
                    {item.color ? ` · ${item.color}` : ''}
                  </p>
                  <strong>{formatCurrency(item.unit_price || item.selling_price)}</strong>
                </div>

                <div className="cart-item-qty">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(newQty) => updateQuantity(cartItemId, newQty)}
                  />
                </div>

                <div className="cart-item-total">
                  <span>Item total</span>
                  <strong>{formatCurrency(item.item_subtotal || Number(item.selling_price) * item.quantity)}</strong>
                  <button
                    type="button"
                    className="cart-item-remove-btn"
                    onClick={() => removeFromCart(cartItemId)}
                    aria-label={`Remove ${item.product_name} from cart`}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </article>
              );
            })}
            <Link to="/products" className="cart-continue">Continue browsing furniture</Link>
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
