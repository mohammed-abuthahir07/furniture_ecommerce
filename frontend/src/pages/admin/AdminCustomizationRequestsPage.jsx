import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import getImageUrl from '../../utils/imageUrl';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import TextAreaField from '../../components/forms/TextAreaField';
import { 
  Hammer, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Search, 
  Ruler, 
  Image as ImageIcon 
} from 'lucide-react';

const AdminCustomizationRequestsPage = () => {
  const { showSuccess, showError } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // Detail & Reply Modal
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [quotePrice, setQuotePrice] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [nextStatus, setNextStatus] = useState('ADMIN_REPLIED');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCustomizationRequests({
        page,
        limit: 15,
        status: statusFilter || undefined
      });

      if (res.data?.success) {
        const data = res.data.data;
        setRequests(data.requests || data.customizations || (Array.isArray(data) ? data : []));
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load customization requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const openDetailModal = (req) => {
    setSelectedReq(req);
    setReplyMessage(req.admin_response || req.admin_reply || '');
    setQuotePrice(req.admin_quote_price || req.quoted_price || '');
    setEstimatedDays(req.estimated_days || req.lead_time_days || '');
    setNextStatus(req.status === 'PENDING' ? 'ADMIN_REPLIED' : req.status);
    setDetailModalOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      showError('Please enter a response message for the customer');
      return;
    }

    try {
      setSubmittingReply(true);
      const res = await adminApi.replyCustomizationRequest(selectedReq.id, {
        reply_message: replyMessage,
        admin_quote_price: quotePrice ? Number(quotePrice) : undefined,
        estimated_days: estimatedDays ? Number(estimatedDays) : undefined,
        status: nextStatus
      });

      if (res.data?.success) {
        showSuccess('Customization reply and quote updated successfully');
        setDetailModalOpen(false);
        fetchRequests();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to send customization reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadge = (status = '') => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <span className="badge badge-warning">Pending Review</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-secondary">Under Review</span>;
      case 'ADMIN_REPLIED':
        return <span className="badge badge-primary">Admin Replied</span>;
      case 'READY_TO_ORDER':
      case 'APPROVED':
        return <span className="badge badge-success">Approved / Ready</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="badge badge-error">Rejected</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="admin-customizations-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Custom Furniture Requests</h1>
          <p className="admin-page-subtitle">Review bespoke carpentry specs, timber choices, provide quotes, and communicate lead times.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ADMIN_REPLIED">Admin Replied</option>
              <option value="APPROVED">Approved / Ready to Order</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <Loader text="Loading bespoke requests..." />
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={Hammer}
            title="No custom requests found"
            description="No customer customization requests match your current filter criteria."
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Customer</th>
                  <th>Base Product / Type</th>
                  <th>Wood / Finish</th>
                  <th>Custom Dimensions</th>
                  <th>Quoted Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const dimensions = req.custom_length && req.custom_width && req.custom_height
                    ? `${req.custom_length}"L × ${req.custom_width}"W × ${req.custom_height}"H`
                    : (req.dimensions || 'Standard');

                  return (
                    <tr key={req.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{req.id}</span>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {formatDate(req.created_at)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                          {req.customer_name || req.User?.name || 'Customer'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {req.customer_email || req.User?.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '500' }}>
                          {req.product_name || req.Product?.name || req.furniture_type || 'Custom Piece'}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-secondary">
                          {req.wood_type || req.timber_type || 'Solid Sheesham'}
                        </span>
                        {req.finish_polish && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {req.finish_polish}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>{dimensions}</span>
                      </td>
                      <td>
                        {req.admin_quote_price || req.quoted_price ? (
                          <strong style={{ color: 'var(--color-primary)' }}>
                            {formatCurrency(req.admin_quote_price || req.quoted_price)}
                          </strong>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '12px' }}>
                            Unquoted
                          </span>
                        )}
                      </td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openDetailModal(req)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '5px 10px' }}
                        >
                          <Eye size={13} /> View & Quote
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Review & Reply Modal */}
      {detailModalOpen && selectedReq && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Customization Request #${selectedReq.id}`}
        >
          <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>
            {/* Customer specs summary box */}
            <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-primary)' }}>
                Customer Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div><strong>Customer:</strong> {selectedReq.customer_name || selectedReq.User?.name || 'Customer'}</div>
                <div><strong>Email:</strong> {selectedReq.customer_email || selectedReq.User?.email}</div>
                <div><strong>Wood Type:</strong> {selectedReq.wood_type || 'Custom'}</div>
                <div><strong>Finish / Polish:</strong> {selectedReq.finish_polish || 'Natural'}</div>
                <div><strong>Custom Dimensions:</strong> {selectedReq.custom_length ? `${selectedReq.custom_length}"L × ${selectedReq.custom_width}"W × ${selectedReq.custom_height}"H` : (selectedReq.dimensions || 'N/A')}</div>
                <div><strong>Seating / Shape:</strong> {selectedReq.seating_capacity ? `${selectedReq.seating_capacity} Seater` : (selectedReq.shape || 'N/A')}</div>
              </div>

              {selectedReq.notes && (
                <div style={{ marginTop: '12px', fontSize: '13px', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                  <strong>Customer Instructions:</strong>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-main)', lineHeight: '1.5' }}>
                    {selectedReq.notes}
                  </p>
                </div>
              )}

              {/* Reference Image */}
              {(selectedReq.reference_image || selectedReq.image_url) && (
                <div style={{ marginTop: '14px' }}>
                  <strong>Attached Sketch / Reference:</strong>
                  <div style={{ marginTop: '6px' }}>
                    <a 
                      href={getImageUrl(selectedReq.reference_image || selectedReq.image_url)} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <img
                        src={getImageUrl(selectedReq.reference_image || selectedReq.image_url)}
                        alt="Customer Reference"
                        style={{ maxWidth: '240px', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Response Form */}
            <form onSubmit={handleSendReply}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-text-main)' }}>
                Admin Review & Quotation
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <InputField
                  label="Quoted Price (₹)"
                  type="number"
                  min="0"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="e.g. 24500"
                />

                <InputField
                  label="Estimated Lead Time (Days)"
                  type="number"
                  min="1"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  placeholder="e.g. 14"
                />
              </div>

              <SelectField
                label="Request Status"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                options={[
                  { value: 'UNDER_REVIEW', label: 'Under Review' },
                  { value: 'ADMIN_REPLIED', label: 'Admin Replied (Quotation Provided)' },
                  { value: 'READY_TO_ORDER', label: 'Ready for Customer Checkout / Approved' },
                  { value: 'REJECTED', label: 'Reject / Unable to Craft' }
                ]}
              />

              <TextAreaField
                label="Admin Message / Carpentry Notes to Customer"
                rows={4}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Detail the wood grade, joinery method, warranty, and payment instructions..."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDetailModalOpen(false)}
                  disabled={submittingReply}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReply}
                >
                  {submittingReply ? 'Saving...' : 'Submit Quote & Reply'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCustomizationRequestsPage;
