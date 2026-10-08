import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, CheckCircle2, Clock } from 'lucide-react';
import customerApi from '../../services/customerApi';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';

export function NotificationsPage() {
  const { success, error: toastError } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('ALL'); // 'ALL' or 'UNREAD'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = filter === 'UNREAD'
        ? await customerApi.getUnreadNotifications()
        : await customerApi.getNotifications();

      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await customerApi.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
        );
      }
    } catch (err) {
      toastError(err.message || 'Failed to mark as read.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await customerApi.markAllAsRead();
      if (res.success) {
        success('All notifications marked as read.');
        fetchNotifications();
      }
    } catch (err) {
      toastError(err.message || 'Failed to mark all as read.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await customerApi.deleteNotification(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete notification.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Notifications Inbox</h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
            Updates regarding your furniture orders, deliveries, and customization requests.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'var(--neutral-200)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)' }}
              onClick={() => setFilter('ALL')}
            >
              All
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'UNREAD' ? 'btn-primary' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)' }}
              onClick={() => setFilter('UNREAD')}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleMarkAllAsRead}
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <PageLoader text="Loading your notifications..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchNotifications} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications in your inbox"
          description="You will receive alerts here when your orders change status or when craftsmen reply to custom requests."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="surface-card"
              style={{
                padding: '1.25rem',
                borderLeft: notif.is_read ? '1px solid var(--neutral-200)' : '4px solid var(--primary-600)',
                background: notif.is_read ? '#ffffff' : 'var(--primary-50)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-full)',
                    background: notif.is_read ? 'var(--neutral-100)' : 'var(--primary-100)',
                    color: notif.is_read ? 'var(--neutral-600)' : 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bell size={18} />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--neutral-900)', marginBottom: 2 }}>
                    {notif.title}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--neutral-700)', margin: 0, lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--neutral-400)', marginTop: '0.5rem' }}>
                    <Clock size={12} />
                    <span>{formatDateTime(notif.created_at)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {!notif.is_read && (
                  <button
                    type="button"
                    className="action-btn-sm"
                    onClick={() => handleMarkAsRead(notif.id)}
                    title="Mark as read"
                  >
                    <CheckCircle2 size={15} color="var(--primary-600)" />
                  </button>
                )}

                <button
                  type="button"
                  className="action-btn-sm"
                  style={{ color: 'var(--danger-500)' }}
                  onClick={() => handleDelete(notif.id)}
                  title="Delete notification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
