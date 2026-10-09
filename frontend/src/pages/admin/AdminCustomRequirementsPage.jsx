import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import getImageUrl from '../../utils/imageUrl';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { ClipboardList, Eye } from 'lucide-react';

const AdminCustomRequirementsPage = () => {
  const { error: showError } = useToast();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedReq, setSelectedReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllCustomRequirements();

      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : [];
        const query = statusFilter.trim().toLowerCase();
        const filtered = query
          ? list.filter((item) =>
              `${item.name || ''} ${item.city || ''} ${item.requirement || ''}`.toLowerCase().includes(query)
            )
          : list;
        setRequirements(filtered);
        setTotalPages(1);
      }
    } catch (err) {
      showError(err.message || 'Failed to load custom requirements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [page, statusFilter]);

  const openDetailModal = (req) => {
    setSelectedReq(req);
    setModalOpen(true);
  };

  return (
    <div className="admin-custom-requirements-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bespoke Inquiries & Leads</h1>
          <p className="admin-page-subtitle">Submissions from the public Custom Furniture Inquiry portal.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Search:</span>
            <input
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="form-input"
              placeholder="Name, city, or requirement"
              style={{ width: '240px', maxWidth: '100%', padding: '6px 12px', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <Loader text="Loading inquiries..." />
          </div>
        ) : requirements.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No custom inquiries found"
            description="No leads match your selected status filter."
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Contact Person</th>
                  <th>City</th>
                  <th>Requirement</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{req.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                        {req.name || req.full_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                        <span>{req.email}</span>
                        {req.phone && <span>• {req.phone}</span>}
                      </div>
                    </td>
                    <td>{req.city || '—'}</td>
                    <td style={{ maxWidth: 280 }}>
                      <div style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.requirement || 'Custom furniture request'}
                      </div>
                    </td>
                    <td>{formatDate(req.created_at)}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openDetailModal(req)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '5px 10px' }}
                      >
                        <Eye size={13} /> View Lead
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Inquiry Detail Modal */}
      {modalOpen && selectedReq && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Bespoke Inquiry #${selectedReq.id}`}
        >
          <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>
            <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div><strong>Full Name:</strong> {selectedReq.name || selectedReq.full_name}</div>
                <div><strong>Email:</strong> {selectedReq.email}</div>
                <div><strong>Phone Number:</strong> {selectedReq.phone || 'N/A'}</div>
                <div><strong>City / Location:</strong> {selectedReq.city || selectedReq.location || 'N/A'}</div>
                <div><strong>State:</strong> {selectedReq.state || 'N/A'}</div>
                <div><strong>PIN code:</strong> {selectedReq.pincode || 'N/A'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {selectedReq.address || 'N/A'}</div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--color-border)', fontSize: '13px' }}>
                <strong>Furniture requirement:</strong>
                <p style={{ margin: '4px 0 0 0', lineHeight: '1.5' }}>
                  {selectedReq.requirement || 'No requirement notes were provided.'}
                </p>
              </div>

              {selectedReq.reference_image && (
                <div style={{ marginTop: '14px' }}>
                  <strong>Reference image:</strong>
                  <div style={{ marginTop: '6px' }}>
                    <a href={getImageUrl(selectedReq.reference_image)} target="_blank" rel="noreferrer">
                      <img
                        src={getImageUrl(selectedReq.reference_image)}
                        alt="Custom furniture reference"
                        style={{ maxWidth: '240px', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--neutral-500)', marginBottom: '12px' }}>
              These public inquiries are view-only. Follow up with the customer using the contact details above.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCustomRequirementsPage;
