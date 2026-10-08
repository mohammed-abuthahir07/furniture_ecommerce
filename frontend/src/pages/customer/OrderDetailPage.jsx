import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  MapPin,
  CreditCard,
  AlertTriangle,
  ArrowLeft,
  XCircle,
} from 'lucide-react';
import customerApi from '../../services/customerApi';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerApi.getMyOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      const res = await customerApi.cancelMyOrder(id);
      if (res.success) {
        success('Order cancelled successfully.');
        setIsCancelModalOpen(false);
        fetchOrderDetail();
      }
    } catch (err) {
      toastError(err.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading order details and tracking..." />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Order Not Found"
        message={error || 'The requested order could not be retrieved.'}
        onRetry={fetchOrderDetail}
      />
    );
  }

  // Order Tracking Timeline Steps
  const trackingSteps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'In Production / Crafting' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStatus = order.order_status;
  const isCancelled = currentStatus === 'CANCELLED';
  const currentStepIndex = trackingSteps.findIndex((s) => s.key === currentStatus);

  const isCancellable = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(currentStatus);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/account/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <h2>Order #{order.order_number}</h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--neutral-500)' }}>
            Placed on {formatDateTime(order.created_at)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <StatusBadge status={currentStatus} />
          {isCancellable && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }}
              onClick={() => setIsCancelModalOpen(true)}
            >
              <XCircle size={14} />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Order Progress / Status Tracking Bar */}
      <div className="surface-card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--neutral-700)' }}>
          Order Fulfillment & Delivery Status
        </h3>

        {isCancelled ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--danger-50)', color: 'var(--danger-500)', borderRadius: 'var(--radius-sm)' }}>
            <XCircle size={24} />
            <div>
              <div style={{ fontWeight: 700 }}>This order has been cancelled.</div>
              <div style={{ fontSize: '0.8rem' }}>Inventory has been restored and no further payments will be collected.</div>
            </div>
          </div>
        ) : (
          <div className="order-tracking-bar">
            {trackingSteps.map((step, idx) => {
              const isCompleted = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className={`tracking-step ${isCompleted ? 'completed' : isCurrent ? 'current' : ''}`}
                >
                  <div className="step-circle">
                    {isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                  </div>
                  <div className="step-label">{step.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Order Items Table / Cards */}
        <div className="surface-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
            Ordered Furniture Items ({order.items?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--neutral-100)',
                }}
              >
                {item.main_image && (
                  <img
                    src={getImageUrl(item.main_image)}
                    alt={item.product_name}
                    style={{ width: '80px', height: '65px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <Link
                    to={`/products/${item.product_id}`}
                    style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--neutral-900)' }}
                  >
                    {item.product_name}
                  </Link>

                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: 2 }}>
                    Variant: <strong>{item.variant_name}</strong> {item.color && `• Color: ${item.color}`}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--neutral-600)', marginTop: 4 }}>
                    Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--neutral-900)' }}>
                  {formatCurrency(item.item_subtotal || Number(item.unit_price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info: Shipping & Payment Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Address */}
          <div className="surface-card">
            <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem' }}>
              <MapPin size={16} color="var(--primary-600)" />
              <span>Shipping Destination</span>
            </h4>
            <div style={{ fontSize: '0.88rem', color: 'var(--neutral-800)', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700 }}>{order.customer_name}</div>
              <div>{order.shipping_address}</div>
              <div>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</div>
              <div style={{ marginTop: '0.5rem', color: 'var(--neutral-600)', fontSize: '0.82rem' }}>
                Phone: {order.customer_phone}
              </div>
              {order.alternative_address && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                  Site Notes: {order.alternative_address}
                </div>
              )}
            </div>
          </div>

          {/* Payment & Charges Summary */}
          <div className="surface-card">
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem' }}>
              <CreditCard size={16} color="var(--primary-600)" />
              <span>Financial Breakdown</span>
            </h4>

            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping & Assembly</span>
              <span>{Number(order.shipping_charge) > 0 ? formatCurrency(order.shipping_charge) : 'FREE'}</span>
            </div>

            {Number(order.discount_amount) > 0 && (
              <div className="summary-row" style={{ color: 'var(--success-500)' }}>
                <span>Discount</span>
                <span>-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}

            <div className="summary-total-row">
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary-700)' }}>{formatCurrency(order.total_amount)}</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--neutral-600)', background: 'var(--neutral-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div>Method: <strong>{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong></div>
              <div>Status: <strong>{order.payment_status}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Furniture Order"
        message={`Are you sure you want to cancel Order #${order.order_number}? Items and inventory will be returned to stock.`}
        confirmText="Yes, Cancel Order"
        isDestructive
        isLoading={isCancelling}
      />
    </div>
  );
}

export default OrderDetailPage;
