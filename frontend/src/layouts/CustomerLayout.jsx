import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  Bell,
  SlidersHorizontal,
  Star,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import { useScrollToTop } from '../hooks/useScrollToTop';

export function CustomerLayout() {
  useScrollToTop();
  const { customer, customerLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    customerLogout();
    navigate('/login');
  };

  const breadcrumbItems = [
    { label: 'My Account', to: '/account' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main className="main-content">
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="account-layout">
            {/* Account Sidebar */}
            <aside className="account-sidebar">
              <div className="account-user-card">
                <div className="account-user-avatar">
                  {customer?.profile_image ? (
                    <img src={getImageUrl(customer.profile_image)} alt={customer.name} />
                  ) : (
                    customer?.name?.charAt(0)?.toUpperCase() || 'C'
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--neutral-900)', truncate: 'ellipsis' }}>
                    {customer?.name || 'Customer'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer?.email}
                  </div>
                </div>
              </div>

              <nav className="account-nav-list" aria-label="Account Navigation">
                <NavLink
                  to="/account"
                  end
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <LayoutDashboard size={18} />
                    <span>Overview</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/account/orders"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Package size={18} />
                    <span>My Orders</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/cart"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ShoppingBag size={18} />
                    <span>Cart</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/account/wishlist"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/account/customizations"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <SlidersHorizontal size={18} />
                    <span>Custom Requests</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/account/reviews"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Star size={18} />
                    <span>My Reviews</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/account/notifications"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Bell size={18} />
                    <span>Notifications</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/account/profile"
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <User size={18} />
                    <span>Profile Settings</span>
                  </div>
                </NavLink>

                <div style={{ height: 1, background: 'var(--neutral-200)', margin: '8px 0' }} />

                <button
                  type="button"
                  className="account-nav-item"
                  style={{ color: 'var(--danger-500)', width: '100%', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </div>
                </button>
              </nav>
            </aside>

            {/* Account Main Content */}
            <div className="account-content-area">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerLayout;
