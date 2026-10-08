import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import getImageUrl from '../../utils/imageUrl';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SelectField from '../../components/forms/SelectField';
import TextAreaField from '../../components/forms/TextAreaField';
import { 
  ClipboardList, 
  Eye, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText,
  Image as ImageIcon 
} from 'lucide-react';

const AdminCustomRequirementsPage = () => {
  const { showSuccess, showError } = useToast();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedReq, setSelectedReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('CONTACTED');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCustomRequirements({
        page,
        limit: 15,
        status: statusFilter || undefined
      });

      if (res.data?.success) {
        const data = res.data.data;
        setRequirements(data.requirements || data.items || (Array.isArray(data) ? data : []));
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load custom requirements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [page, statusFilter]);

  const openDetailModal = (req) => {
    setSelectedReq(req);
    setNewStatus(req.status || 'CONTACTED');
    setAdminNotes(req.admin_notes || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await adminApi.updateCustomRequirementStatus(selectedReq.id, {
        status: newStatus,
        admin_notes: adminNotes
      });

      if (res.data?.success) {
        showSuccess('Custom requirement status updated successfully');
        setModalOpen(false);
        fetchRequirements();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update requirement status');
    } finally {
      setUpdating(false);
    }
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
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="">All Inquiries</option>
              <option value="NEW">New Leads</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved / Converted</option>
              <option value="CLOSED">Closed / Dropped</option>
            </select>
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
                  <th>Furniture Category</th>
                  <th>Preferred Timber</th>
                  <th>Budget Range</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{req.id}</span>
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
                    <td>
                      <div style={{ fontWeight: '500' }}>{req.furniture_type || req.category || 'General Furniture'}</div>
                      {req.room_type && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{req.room_type}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-secondary">{req.wood_type || 'Customer Choice'}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                        {req.budget_range || 'Flexible'}
                      </span>
                    </td>
                    <td>{formatDate(req.created_at)}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'NEW' ? 'badge-primary' :
                        req.status === 'RESOLVED' ? 'badge-success' :
                        req.status === 'CLOSED' ? 'badge-error' : 'badge-warning'
                      }`}>
                        {req.status || 'NEW'}
                      </span>
                    </td>
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
                <div><strong>Furniture Type:</strong> {selectedReq.furniture_type || 'N/A'}</div>
                <div><strong>Preferred Timber:</strong> {selectedReq.wood_type || 'N/A'}</div>
                <div><strong>Budget Estimate:</strong> {selectedReq.budget_range || 'N/A'}</div>
                <div><strong>Required By:</strong> {selectedReq.required_by || 'Flexible'}</div>
              </div>

              {selectedReq.description && (
                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--color-border)', fontSize: '13px' }}>
                  <strong>Project Description / Requirements:</strong>
                  <p style={{ margin: '4px 0 0 0', lineHeight: '1.5' }}>
                    {selectedReq.description}
                  </p>
                </div>
              )}

              {selectedReq.image_url && (
                <div style={{ marginTop: '14px' }}>
                  <strong>Attached Sketch / Design Spec:</strong>
                  <div style={{ marginTop: '6px' }}>
                    <a href={getImageUrl(selectedReq.image_url)} target="_blank" rel="noreferrer">
                      <img
                        src={getImageUrl(selectedReq.image_url)}
                        alt="Design Reference"
                        style={{ maxWidth: '240px', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateStatus}>
              <SelectField
                label="Lead Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'NEW', label: 'New Lead' },
                  { value: 'CONTACTED', label: 'Contacted Client' },
                  { value: 'IN_PROGRESS', label: 'Design In Progress' },
                  { value: 'RESOLVED', label: 'Converted to Custom Order' },
                  { value: 'CLOSED', label: 'Closed / Not Interested' }
                ]}
              />

              <TextAreaField
                label="Internal Admin Notes (Follow-up log)"
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Called client on 10/10, shared teak dining table samples..."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                  disabled={updating}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Update Lead Status'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCustomRequirementsPage;
