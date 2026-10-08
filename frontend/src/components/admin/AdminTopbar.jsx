import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../services/adminApi';

export function AdminTopbar({ onToggleSidebar, pageTitle = 'Dashboard' }) {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    adminApi.getUnreadCount().then((res) => {
      if (res.success && res.unread_count !== undefined) {
        setUnreadCount(res.unread_count);
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          style={{ display: 'inline-flex' }}
          onClick={onToggleSidebar}
          aria-label="Toggle admin navigation"
        >
          <Menu size={22} />
        </button>
        <h1 className="admin-page-heading">{pageTitle}</h1>
      </div>

      <div className="admin-topbar-right">
        <Link
          to="/"
          target="_blank"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          title="Open Public Furniture Store"
        >
          <span>Storefront</span>
          <ExternalLink size={14} />
        </Link>

        <Link
          to="/admin/notifications"
          className="action-icon-btn"
          aria-label="Admin Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="action-badge" style={{ background: 'var(--danger-500)' }}>
              {unreadCount}
            </span>
          )}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, borderLeft: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              {admin?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Super Administrator</div>
          </div>

          <button
            type="button"
            className="action-icon-btn"
            style={{ color: 'var(--danger-500)' }}
            onClick={handleLogout}
            title="Sign out of Admin"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
