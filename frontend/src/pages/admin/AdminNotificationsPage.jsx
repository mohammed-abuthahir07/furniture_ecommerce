import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  ShoppingBag, 
  AlertTriangle, 
  MessageSquare, 
  Users, 
  Info,
  Layers
} from 'lucide-react';

const AdminNotificationsPage = () => {
  const { showSuccess, showError } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getNotifications({
        page,
        limit: 15,
        unread_only: unreadOnly ? true : undefined
      });

      if (res.data?.success) {
        const data = res.data.data;
        setNotifications(data.notifications || data.items || (Array.isArray(data) ? data : []));
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch admin notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, unreadOnly]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await adminApi.markNotificationAsRead(id);
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
        showSuccess('Notification marked as read');
      }
    } catch (err) {
      showError('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await adminApi.markAllNotificationsAsRead();
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        showSuccess('All notifications marked as read');
      }
    } catch (err) {
      showError('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await adminApi.deleteNotification(id);
      if (res.data?.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showSuccess('Notification deleted');
      }
    } catch (err) {
      showError('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('order')) return <ShoppingBag size={18} color="var(--color-primary)" />;
    if (t.includes('stock') || t.includes('inventory')) return <AlertTriangle size={18} color="var(--color-warning)" />;
    if (t.includes('custom')) return <Layers size={18} color="var(--color-accent)" />;
    if (t.includes('user') || t.includes('customer')) return <Users size={18} color="#3b82f6" />;
    return <Info size={18} color="var(--color-text-muted)" />;
  };

  return (
    <div className="admin-notifications-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Notifications</h1>
          <p className="admin-page-subtitle">Real-time alerts for new orders, low stock warnings, and customization quotes.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleMarkAllRead}
            disabled={notifications.every(n => n.is_read)}
          >
            <CheckCheck size={15} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`btn btn-sm ${!unreadOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setUnreadOnly(false); setPage(1); }}
        >
          All Notifications
        </button>
        <button
          className={`btn btn-sm ${unreadOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setUnreadOnly(true); setPage(1); }}
        >
          Unread Only
        </button>
      </div>

      {/* Notifications List */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <Loader text="Loading alerts..." />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={unreadOnly ? 'No unread notifications' : 'Notification center is empty'}
            description="You are completely caught up with all orders, inventory alerts, and customer messages."
          />
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => {
              const isRead = notif.is_read || notif.read_at;
              return (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--color-border)',
                    background: isRead ? 'transparent' : 'var(--color-bg-alt)',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '50%', 
                      background: 'white', 
                      border: '1px solid var(--color-border)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {getNotificationIcon(notif.type || notif.title)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: isRead ? '600' : '700', color: 'var(--color-text-main)' }}>
                          {notif.title || 'System Alert'}
                        </h4>
                        {!isRead && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                        )}
                      </div>
                      <p style={{ margin: '4px 0 6px 0', fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        {notif.message || notif.content}
                      </p>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                        {formatDate(notif.created_at)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px', flexShrink: 0 }}>
                    {!isRead && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Mark as read"
                        style={{ padding: '4px 8px' }}
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDelete(notif.id)}
                      title="Delete notification"
                      style={{ padding: '4px 8px', color: 'var(--color-error)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
