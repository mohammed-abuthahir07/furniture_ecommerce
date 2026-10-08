import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Clock,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import customerApi from '../../services/customerApi';
import StatusBadge from '../../components/common/StatusBadge';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function CustomizationRequestDetailPage() {
  const { id } = useParams();
  const { success, error: toastError } = useToast();

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerApi.getMyCustomizationRequestById(id);
      const detail = res.request || res.data;
      if (res.success && detail) {
        setRequest(detail);
      }
    } catch (err) {
      setError(err.message || 'Failed to load customization request details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAcceptQuote = async () => {
    try {
      setIsAccepting(true);
      const res = await customerApi.updateMyCustomizationRequest(id, {
        status: 'CUSTOMER_ACCEPTED',
      });
      if (res.success) {
        success('Quote accepted! Our production team will contact you.');
        fetchDetail();
      }
    } catch (err) {
      toastError(err.message || 'Failed to accept quote.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading customization request..." />;
  }

  if (error || !request) {
    return (
      <ErrorState
        title="Request Not Found"
        message={error || 'The requested customization record could not be found.'}
        onRetry={fetchDetail}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/account/customization-requests"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '0.5rem' }}
        >
          <ArrowLeft size={14} /> Back to Custom Requests
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Custom Request #{request.id}</h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--neutral-500)' }}>
              Submitted on {formatDateTime(request.created_at)}
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Product & Requirement Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Base Product Card */}
          <div className="surface-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Base Furniture Design
            </h3>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {request.product_image && (
                <img
                  src={getImageUrl(request.product_image)}
                  alt={request.product_name}
                  style={{ width: '100px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  onError={handleImageError}
                />
              )}
              <div>
                <Link
                  to={`/products/${request.product_id}`}
                  style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-900)' }}
                >
                  {request.product_name}
                </Link>
                <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', marginTop: 4 }}>
                  Product ID: #{request.product_id}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Requirement */}
          <div className="surface-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Your Custom Specifications
            </h3>
            <p style={{ color: 'var(--neutral-800)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {request.requirement}
            </p>

            {request.customer_image && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-600)', marginBottom: '0.5rem' }}>
                  Uploaded Reference Attachment:
                </div>
                <img
                  src={getImageUrl(request.customer_image)}
                  alt="Customer Reference"
                  style={{ maxWidth: '280px', maxHeight: '200px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-200)', objectFit: 'cover' }}
                  onError={handleImageError}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Artisan Response & Quote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="surface-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-100)' }}>
              Studio & Artisan Quote
            </h3>

            {request.admin_response ? (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', marginBottom: 4 }}>
                  Master Artisan Feedback:
                </div>
                <p style={{ color: 'var(--neutral-800)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', background: 'var(--primary-50)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  "{request.admin_response}"
                </p>

                {request.estimated_price && (
                  <div className="summary-row">
                    <span>Estimated Price</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {formatCurrency(request.estimated_price)}
                    </span>
                  </div>
                )}

                {request.estimated_days && (
                  <div className="summary-row">
                    <span>Estimated Crafting Time</span>
                    <span style={{ fontWeight: 600 }}>{request.estimated_days} Business Days</span>
                  </div>
                )}

                {request.status === 'ADMIN_REPLIED' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-md btn-block"
                    style={{ marginTop: '1.25rem' }}
                    onClick={handleAcceptQuote}
                    disabled={isAccepting}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isAccepting ? 'Accepting...' : 'Accept Quote & Proceed'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--neutral-500)' }}>
                <Clock size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem' }}>
                  Our timber architects are currently evaluating your dimensions and crafting an estimated quote.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizationRequestDetailPage;
