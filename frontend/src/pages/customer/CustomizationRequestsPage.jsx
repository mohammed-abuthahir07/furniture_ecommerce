import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Plus, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import customerApi from '../../services/customerApi';
import publicApi from '../../services/publicApi';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import TextAreaField from '../../components/forms/TextAreaField';
import SelectField from '../../components/forms/SelectField';
import FileUploadField from '../../components/forms/FileUploadField';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function CustomizationRequestsPage() {
  const [searchParams] = useSearchParams();
  const preSelectedProductId = searchParams.get('product_id') || '';

  const { success, error: toastError } = useToast();

  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(!!preSelectedProductId);
  const [productId, setProductId] = useState(preSelectedProductId);
  const [requirement, setRequirement] = useState('');
  const [customerImageFile, setCustomerImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerApi.getMyCustomizationRequests();
      const list = res.requests || res.data;
      if (res.success && Array.isArray(list)) {
        setRequests(list);
      }
    } catch (err) {
      setError(err.message || 'Failed to load customization requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Load products list for dropdown
    publicApi.getProducts().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    }).catch(() => {});
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    if (!productId) {
      toastError('Please select a furniture design.');
      return;
    }

    if (!requirement.trim()) {
      toastError('Please describe your customization requirements.');
      return;
    }

    const payload = new FormData();
    payload.append('request_type', 'EXISTING_PRODUCT');
    payload.append('product_id', productId);
    payload.append('customer_requirement', requirement.trim());
    if (customerImageFile) {
      payload.append('customer_image', customerImageFile);
    }

    try {
      setIsSubmitting(true);
      const res = await customerApi.createCustomizationRequest(payload);
      if (res.success) {
        success('Customization request submitted to our artisans!');
        setIsModalOpen(false);
        setRequirement('');
        setCustomerImageFile(null);
        fetchRequests();
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit customization request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Bespoke Customization Requests ({requests.length})</h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
            Request custom dimensions, special timber, finishes, and upholstery for existing catalog pieces.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Custom Request</span>
        </button>
      </div>

      {isLoading ? (
        <PageLoader text="Loading your customization requests..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRequests} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No customization requests submitted yet"
          description="Have specific room dimensions or timber preferences? Select a product and request custom modifications."
          actionLabel="Submit New Request"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="surface-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {req.product_image && (
                    <img
                      src={getImageUrl(req.product_image)}
                      alt={req.product_name}
                      style={{ width: 64, height: 50, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
                      {req.product_name || `Request #${req.id}`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--neutral-500)', marginTop: 2 }}>
                      <Clock size={12} />
                      <span>Submitted on {formatDate(req.created_at)}</span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={req.status} />
              </div>

              <div style={{ background: 'var(--neutral-50)', padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--neutral-700)' }}>
                <strong>Your Requirement:</strong> "{req.customer_requirement || req.requirement}"
              </div>

              {(req.admin_reply || req.admin_response) && (
                <div style={{ background: 'var(--primary-50)', borderLeft: '3px solid var(--primary-600)', padding: '0.9rem 1rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--primary-900)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Artisan Response:</div>
                  <div>"{req.admin_reply || req.admin_response}"</div>
                  {(req.estimated_price || req.estimated_days) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.82rem', fontWeight: 600 }}>
                      {req.estimated_price && <span>Estimated Quote: {formatCurrency(req.estimated_price)}</span>}
                      {req.estimated_days && <span>Crafting Timeline: {req.estimated_days} Days</span>}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/account/customizations/${req.id}`} className="btn btn-secondary btn-sm">
                  <span>View Details & Actions</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Customization Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Customization Request"
        size="md"
        footer={(
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="custom-request-form"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Request...' : 'Send Request'}
            </button>
          </>
        )}
      >
        <form id="custom-request-form" onSubmit={handleCreateRequest}>
          <SelectField
            label="Select Base Product to Customize"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.brand || 'WoodCraft'})` }))}
            placeholder="-- Choose a furniture design --"
            required
          />

          <TextAreaField
            label="Detailed Customization Requirement"
            rows={2}
            placeholder="Length × width × height, wood, stain, or upholstery."
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            required
          />

          <FileUploadField
            compact
            label="Attach Reference Photo / Sketch (Optional)"
            onChange={setCustomerImageFile}
          />
        </form>
      </Modal>
    </div>
  );
}

export default CustomizationRequestsPage;
