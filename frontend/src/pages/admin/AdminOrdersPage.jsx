import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Calendar, User, Filter } from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function AdminOrdersPage() {
  const { error: toastError } = useToast();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAllOrders();
      const list = res.orders || res.data;
      if (res.success && Array.isArray(list)) {
        setOrders(list);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch customer orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.order_status === statusFilter);

  const columns = [
    {
      header: 'Order Reference',
      accessor: 'order_number',
      render: (row) => (
        <div>
          <Link
            to={`/admin/orders/${row.id}`}
            style={{ fontWeight: 800, color: 'var(--primary-700)' }}
          >
            {row.order_number}
          </Link>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.customer_name || 'Customer'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {row.shipping_city}, {row.shipping_state}
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'total_amount',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{formatCurrency(row.total_amount)}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {row.payment_method} ({row.payment_status})
          </div>
        </div>
      ),
    },
    {
      header: 'Fulfillment Status',
      accessor: 'order_status',
      render: (row) => <StatusBadge status={row.order_status} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
          <Link
            to={`/admin/orders/${row.id}`}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Eye size={14} />
            <span>Manage</span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="#64748b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status Filter:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Orders ({orders.length})</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        searchPlaceholder="Search by order number or customer name..."
        emptyMessage="No customer orders found"
      />
    </div>
  );
}

export default AdminOrdersPage;
