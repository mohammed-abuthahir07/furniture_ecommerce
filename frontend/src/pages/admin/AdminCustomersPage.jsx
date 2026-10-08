import { useState, useEffect } from 'react';
import { Users, Eye, Phone, Mail, Calendar, Package } from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function AdminCustomersPage() {
  const { success, error: toastError } = useToast();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // View Customer Details & Order History Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAllCustomers();
      const list = res.customers || res.data;
      if (res.success && Array.isArray(list)) {
        setCustomers(list);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load customers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCustomerModal = async (cust) => {
    setSelectedCustomer(cust);
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const res = await adminApi.getCustomerById(cust.id);
      const detail = res.customer || res.data;
      if (res.success && detail) {
        setSelectedCustomer(detail);
        setCustomerOrders(res.orders || detail.orders || []);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch customer order history.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleToggleStatus = async (cust) => {
    const nextStatus = cust.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminApi.changeCustomerStatus(cust.id, nextStatus);
      if (res.success) {
        success(`Customer account status updated to ${nextStatus}.`);
        fetchCustomers();
        if (selectedCustomer && selectedCustomer.id === cust.id) {
          setSelectedCustomer((prev) => ({ ...prev, status: nextStatus }));
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to update customer status.');
    }
  };

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-full)',
              background: '#f1f5f9',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              overflow: 'hidden',
            }}
          >
            {row.profile_image ? (
              <img src={getImageUrl(row.profile_image)} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              row.name?.charAt(0)?.toUpperCase() || 'C'
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row) => row.phone || 'N/A',
    },
    {
      header: 'Registered On',
      accessor: 'created_at',
      render: (row) => formatDate(row.created_at),
    },
    {
      header: 'Account Status',
      accessor: 'status',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Toggle customer status"
        >
          <StatusBadge status={row.status} />
        </button>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="action-btn-sm"
            onClick={() => openCustomerModal(row)}
            title="View customer profile & order history"
          >
            <Eye size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        searchPlaceholder="Search customers by name or email..."
        searchKey="name"
        emptyMessage="No registered customers found"
      />

      {/* Customer Detail & Orders History Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? `Customer: ${selectedCustomer.name}` : 'Customer Profile'}
        size="lg"
      >
        {selectedCustomer && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Full Name:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.name}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Email Address:</span>
                <div>{selectedCustomer.email}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Phone Number:</span>
                <div>{selectedCustomer.phone || 'N/A'}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Account Status:</span>
                <div><StatusBadge status={selectedCustomer.status} /></div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Order History ({customerOrders.length})
            </h4>

            {isLoadingDetail ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Loading orders history...</p>
            ) : customerOrders.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No orders placed by this customer yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '250px', overflowY: 'auto' }}>
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>#{ord.order_number}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 8 }}>
                        {formatDate(ord.created_at)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(ord.total_amount)}</span>
                      <StatusBadge status={ord.order_status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminCustomersPage;
