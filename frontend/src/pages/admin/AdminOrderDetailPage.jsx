import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Save,
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import StatusBadge from '../../components/common/StatusBadge';
import SelectField from '../../components/forms/SelectField';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const { success, error: toastError } = useToast();

  const [order, setOrder] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
        setSelectedOrderStatus(res.data.order_status || 'PENDING');
        setSelectedPaymentStatus(res.data.payment_status || 'PENDING');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    try {
      setIsUpdatingStatus(true);
      const res = await adminApi.updateOrderStatus(id, {
        order_status: selectedOrderStatus,
        payment_status: selectedPaymentStatus,
      });
      if (res.success) {
        success('Order status updated successfully.');
        fetchOrderDetail();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading order management record..." />;
  }

  if (error || !order) {
    return <ErrorState message={error || 'Order record not found.'} onRetry={fetchOrderDetail} />;
  }

  const orderStatuses = [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'CONFIRMED', label: 'CONFIRMED' },
    { value: 'PROCESSING', label: 'PROCESSING' },
    { value: 'SHIPPED', label: 'SHIPPED' },
    { value: 'OUT_FOR_DELIVERY', label: 'OUT_FOR_DELIVERY' },
    { value: 'DELIVERED', label: 'DELIVERED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ];

  const paymentStatuses = [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'PAID', label: 'PAID' },
    { value: 'FAILED', label: 'FAILED' },
    { value: 'REFUNDED', label: 'REFUNDED' },
  ];

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/admin/orders"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}
        >
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Order #{order.order_number}</h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Placed on {formatDateTime(order.created_at)} • Customer ID: #{order.customer_id}
            </div>
          </div>
          <StatusBadge status={order.order_status} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Order Items & Delivery Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Items */}
          <div className="admin-table-card">
            <div className="admin-table-toolbar">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Ordered Products ({order.items?.length || 0})
              </h3>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant & Color</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.product_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Product #{item.product_id}</div>
                      </td>
                      <td>
                        <div>{item.variant_name}</div>
                        {item.color && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.color}</div>}
                      </td>
                      <td>{formatCurrency(item.unit_price)}</td>
                      <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800 }}>
                        {formatCurrency(item.item_subtotal || Number(item.unit_price) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="surface-card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Shipping & Customer Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem', color: '#334155' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Recipient Name:</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{order.customer_name}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Contact Phone:</div>
                <div style={{ fontWeight: 600 }}>{order.customer_phone}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Contact Email:</div>
                <div>{order.customer_email}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Delivery Address:</div>
                <div>{order.shipping_address}</div>
                <div>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</div>
              </div>
            </div>

            {order.alternative_address && (
              <div style={{ marginTop: '1rem', padding: '0.65rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#475569' }}>
                <strong>Site Notes / Alternative Address:</strong> {order.alternative_address}
              </div>
            )}

            {order.notes && (
              <div style={{ marginTop: '0.5rem', padding: '0.65rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#475569' }}>
                <strong>Customer Delivery Notes:</strong> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status Transition & Charges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Workflow Updater */}
          <div className="surface-card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Fulfillment & Payment Workflow
            </h3>

            <form onSubmit={handleUpdateStatus}>
              <SelectField
                label="Order Status Transition"
                value={selectedOrderStatus}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                options={orderStatuses}
              />

              <SelectField
                label="Payment Status"
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                options={paymentStatuses}
              />

              <button
                type="submit"
                className="btn btn-primary btn-md btn-block"
                style={{ marginTop: '1rem' }}
                disabled={isUpdatingStatus}
              >
                <Save size={16} />
                <span>{isUpdatingStatus ? 'Updating Status...' : 'Save Status Update'}</span>
              </button>
            </form>
          </div>

          {/* Financial Invoice Breakdown */}
          <div className="surface-card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Financial Summary
            </h3>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>White Glove Shipping</span>
              <span>{Number(order.shipping_charge) > 0 ? formatCurrency(order.shipping_charge) : 'FREE'}</span>
            </div>

            {Number(order.discount_amount) > 0 && (
              <div className="summary-row" style={{ color: 'var(--success-500)' }}>
                <span>Discount Applied</span>
                <span>-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}

            <div className="summary-total-row" style={{ marginBottom: '1rem' }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary-700)' }}>{formatCurrency(order.total_amount)}</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div>Payment Mode: <strong>{order.payment_method}</strong></div>
              <div>Current Payment Status: <strong>{order.payment_status}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;
