import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import customerApi from '../../services/customerApi';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { isValidEmail } from '../../utils/validators';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { cartItems, totalItems, subtotal, fetchCart } = useCart();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    customer_name: customer?.name || '',
    customer_email: customer?.email || '',
    customer_phone: customer?.phone || '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
    alternative_address: '',
    payment_method: 'COD',
    notes: '',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState(null);

  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || customer.name || '',
        customer_email: prev.customer_email || customer.email || '',
        customer_phone: prev.customer_phone || customer.phone || '',
      }));
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => {
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = (payment, customerDetails) => new Promise((resolve) => {
    let settled = false;
    let paymentFailed = false;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const checkout = new window.Razorpay({
      key: payment.key_id,
      amount: payment.amount,
      currency: payment.currency || 'INR',
      name: 'WoodCraft',
      description: 'Solid wood furniture order',
      order_id: payment.razorpay_order_id,
      prefill: {
        name: customerDetails.customer_name,
        email: customerDetails.customer_email,
        contact: customerDetails.customer_phone,
      },
      theme: { color: '#8a5a3b' },
      handler: (response) => {
        if (!response?.razorpay_payment_id || !response?.razorpay_order_id || !response?.razorpay_signature) {
          finish({ failed: true });
          return;
        }
        finish({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => finish(paymentFailed ? { failed: true } : null),
      },
    });

    checkout.on('payment.failed', () => {
      paymentFailed = true;
      finish({ failed: true });
    });
    checkout.open();
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toastError('Your cart is empty.');
      return;
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
    } = formData;

    if (
      !customer_name.trim() ||
      !customer_email.trim() ||
      !customer_phone.trim() ||
      !shipping_address.trim() ||
      !shipping_city.trim() ||
      !shipping_state.trim() ||
      !shipping_pincode.trim()
    ) {
      toastError('Please fill in all required shipping address fields.');
      return;
    }

    if (!isValidEmail(customer_email)) {
      toastError('Please enter a valid email address.');
      return;
    }

    let onlinePayment = null;

    try {
      setIsPlacingOrder(true);

      if (formData.payment_method === 'ONLINE') {
        const ready = await loadRazorpay();
        if (!ready) {
          toastError('Online payment could not be opened. You can still place a cash on delivery order.');
          return;
        }

        const paymentRes = await customerApi.createRazorpayOrder();
        if (!paymentRes?.success || !paymentRes.data?.razorpay_order_id) {
          toastError('Online payment could not be started. No furniture order was placed.');
          return;
        }

        onlinePayment = await openRazorpayCheckout(paymentRes.data, formData);

        if (!onlinePayment || onlinePayment.failed) {
          toastError('Payment failed. The furniture order was not placed.');
          return;
        }
      }

      const res = await customerApi.placeOrder({
        ...formData,
        ...(onlinePayment || {}),
      });

      if (formData.payment_method === 'ONLINE' && res.data?.payment_status !== 'PAID') {
        toastError('Payment was not confirmed. The furniture order was not completed.');
        return;
      }

      if (res.success && res.data) {
        success(formData.payment_method === 'ONLINE' ? 'Payment received and order placed.' : 'Order placed successfully!');
        setOrderPlacedData(res.data);
        fetchCart();
      }
    } catch (err) {
      const paymentHint = onlinePayment?.razorpay_payment_id
        ? ` If money was deducted, share payment ${onlinePayment.razorpay_payment_id} with the studio.`
        : '';
      toastError(`${err.message || 'Failed to place order. Please try again.'}${paymentHint}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const breadcrumbs = [
    { label: 'Cart', to: '/cart' },
    { label: 'Checkout', to: '/checkout' },
  ];

  if (orderPlacedData) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '650px', textAlign: 'center' }}>
        <div className="surface-card" style={{ padding: '3rem 2rem', border: '2px solid var(--success-500)' }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-50)',
              color: 'var(--success-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ marginBottom: '0.5rem', color: 'var(--neutral-900)' }}>
            Thank You for Your Order!
          </h2>
          <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Your furniture order has been confirmed and placed into production.
          </p>

          <div style={{ background: 'var(--neutral-50)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Order Reference:</span>
              <strong style={{ color: 'var(--neutral-900)' }}>{orderPlacedData.order_number}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Payment Method:</span>
              <span style={{ fontWeight: 600 }}>
                {orderPlacedData.payment_method === 'COD'
                  ? 'Cash on Delivery'
                  : orderPlacedData.payment_status === 'PAID'
                    ? 'Paid online with Razorpay'
                    : 'Online payment'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1px solid var(--neutral-200)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontWeight: 700 }}>Total Paid/Due:</span>
              <span style={{ fontWeight: 800, color: 'var(--primary-700)' }}>{formatCurrency(orderPlacedData.total_amount)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={`/account/orders/${orderPlacedData.order_id}`} className="btn btn-primary btn-md">
              View Order Details & Tracking
            </Link>
            <Link to="/products" className="btn btn-secondary btn-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--neutral-500)', marginBottom: '1.5rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary btn-md">
          Browse Furniture Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginBottom: '2rem' }}>
        <h1>Checkout & Delivery Details</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
          Please provide your shipping and contact information for white-glove furniture delivery.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="cart-checkout-layout">
          {/* Left Form Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Section 1: Customer Contact */}
            <div className="surface-card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
                1. Customer & Contact Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputField
                  label="Full Name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required
                />

                <InputField
                  label="Email Address"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  required
                />
              </div>

              <InputField
                label="Primary Phone / Mobile Number"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                hint="Used by our delivery team to coordinate furniture assembly"
              />
            </div>

            {/* Section 2: Shipping Address */}
            <div className="surface-card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
                2. Shipping & Delivery Address
              </h3>

              <InputField
                label="Street Address / Building / Flat No."
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                placeholder="e.g. Flat 402, Oakwood Heights, 12th Main"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <InputField
                  label="City"
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  required
                />

                <InputField
                  label="State"
                  name="shipping_state"
                  value={formData.shipping_state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  required
                />

                <InputField
                  label="PIN Code"
                  name="shipping_pincode"
                  value={formData.shipping_pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  required
                />
              </div>

              <InputField
                label="Alternative Address / Site Access Notes (Optional)"
                name="alternative_address"
                value={formData.alternative_address}
                onChange={handleChange}
                placeholder="Floor number, service lift availability, nearby landmark"
              />

              <TextAreaField
                label="Delivery & Assembly Instructions (Optional)"
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special handling notes for our carpentry delivery team..."
              />
            </div>

            {/* Section 3: Payment Method */}
            <div className="surface-card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
                3. Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--radius-sm)',
                    background: formData.payment_method === 'COD' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={formData.payment_method === 'COD'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--primary-600)' }}
                  />
                  <Banknote size={22} color="var(--primary-700)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>Pay securely with cash or UPI at the time of delivery</div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--radius-sm)',
                    background: formData.payment_method === 'ONLINE' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="ONLINE"
                    checked={formData.payment_method === 'ONLINE'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--primary-600)' }}
                  />
                  <CreditCard size={22} color="var(--primary-700)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Online Payment Gateway (Debit/Credit/UPI)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>Pay now with card, UPI, or net banking</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Order Summary & Confirm */}
          <div className="order-summary-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Order Review ({totalItems} items)
            </h3>

            <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-900)' }}>{item.product_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                      {item.variant_name} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {formatCurrency(item.item_subtotal || Number(item.selling_price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>White-Glove Shipping & Assembly</span>
              <span style={{ color: 'var(--success-500)', fontWeight: 600 }}>Calculated upon order</span>
            </div>

            <div className="summary-total-row">
              <span>Total Estimated</span>
              <span style={{ color: 'var(--primary-700)' }}>{formatCurrency(subtotal)}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isPlacingOrder}
            >
              <Lock size={16} />
              <span>
                {isPlacingOrder
                  ? 'Processing Order...'
                  : formData.payment_method === 'ONLINE'
                    ? 'Pay Online & Place Order'
                    : 'Place Furniture Order'}
              </span>
            </button>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
              <ShieldCheck size={16} color="var(--success-500)" />
              <span>100% Encrypted & Safe Order Placement</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
