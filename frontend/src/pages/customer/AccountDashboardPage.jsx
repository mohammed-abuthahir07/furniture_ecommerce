import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Heart,
  ShoppingBag,
  Bell,
  SlidersHorizontal,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import customerApi from '../../services/customerApi';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function AccountDashboardPage() {
  const { customer } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [recentOrders, setRecentOrders] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [customRequestsCount, setCustomRequestsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, notifRes, reqsRes] = await Promise.allSettled([
          customerApi.getMyOrders(),
          customerApi.getUnreadCount(),
          customerApi.getMyCustomizationRequests(),
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value.success) {
          setRecentOrders(ordersRes.value.data?.slice(0, 3) || []);
        }
        if (notifRes.status === 'fulfilled' && notifRes.value.success) {
          const count = notifRes.value.data?.unread_count ?? notifRes.value.unread_count ?? 0;
          setUnreadNotifications(count);
        }
        if (reqsRes.status === 'fulfilled' && reqsRes.value.success) {
          const list = reqsRes.value.requests || reqsRes.value.data || [];
          setCustomRequestsCount(Array.isArray(list) ? list.length : 0);
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Welcome back, {customer?.name}!</h2>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
          Manage your orders, custom furniture projects, wishlist, and profile settings.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <Link to="/account/orders" className="surface-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all var(--transition-fast)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>My Orders</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
              {recentOrders.length > 0 ? `${recentOrders.length}+` : '0'}
            </div>
          </div>
        </Link>

        <Link to="/cart" className="surface-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-amber-light)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Cart Items</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-900)' }}>{totalItems}</div>
          </div>
        </Link>

        <Link to="/account/wishlist" className="surface-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--danger-50)', color: 'var(--danger-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Saved Furniture</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-900)' }}>{wishlistCount}</div>
          </div>
        </Link>

        <Link to="/account/customization-requests" className="surface-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--info-50)', color: 'var(--info-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Custom Requests</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-900)' }}>{customRequestsCount}</div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="surface-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Recent Furniture Orders</h3>
          <Link to="/account/orders" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--neutral-500)' }}>
            <Package size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem' }}>You haven't placed any furniture orders yet.</p>
            <Link to="/products" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--neutral-50)',
                  borderRadius: 'var(--radius-sm)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--neutral-900)' }}>
                    Order #{order.order_number}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                    Placed on {formatDate(order.created_at)} • {formatCurrency(order.total_amount)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={order.order_status} />
                  <Link to={`/account/orders/${order.id}`} className="btn btn-secondary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Account Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="surface-card">
          <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={18} color="var(--primary-600)" />
            <span>Profile & Account Security</span>
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '1rem' }}>
            Update your profile name, email, phone number, and delivery contact information.
          </p>
          <Link to="/account/profile" className="btn btn-outline btn-sm">
            Edit Profile
          </Link>
        </div>

        <div className="surface-card">
          <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <SlidersHorizontal size={18} color="var(--primary-600)" />
            <span>Bespoke Custom Requests</span>
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '1rem' }}>
            Track design reviews, quotes, and craftsman responses for your customized furniture.
          </p>
          <Link to="/account/customization-requests" className="btn btn-outline btn-sm">
            View Requests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountDashboardPage;
