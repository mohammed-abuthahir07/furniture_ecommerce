import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import customerApi from '../../services/customerApi';
import StatusBadge from '../../components/common/StatusBadge';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerApi.getMyOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Furniture Orders</h2>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
          Track production, shipping status, and view invoices for your furniture purchases.
        </p>
      </div>

      {isLoading ? (
        <PageLoader text="Loading your order history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="You haven't placed any furniture orders yet. Discover our latest collections!"
          actionLabel="Explore Furniture"
          actionTo="/products"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="surface-card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--neutral-100)',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
                    Order #{order.order_number}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: 2 }}>
                    <Calendar size={14} />
                    <span>Ordered on {formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={order.order_status} />
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
                    {formatCurrency(order.total_amount)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                  Payment: <strong>{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong> ({order.payment_status})
                  {order.shipping_city && ` • Shipping to ${order.shipping_city}, ${order.shipping_state}`}
                </div>

                <Link to={`/account/orders/${order.id}`} className="btn btn-primary btn-sm">
                  <span>Track & View Details</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
