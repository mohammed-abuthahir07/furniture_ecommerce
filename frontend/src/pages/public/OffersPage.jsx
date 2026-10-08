import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Percent, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import publicApi from '../../services/publicApi';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import { formatDate } from '../../utils/formatters';

export function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await publicApi.getOffers();
      if (res.success && Array.isArray(res.data)) {
        setOffers(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load active offers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const breadcrumbs = [
    { label: 'Offers & Deals', to: '/offers' },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={13} /> Exclusive Savings
        </div>
        <h1>Special Furniture Offers & Promotions</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '1rem', marginTop: 4 }}>
          Discover limited-time discounts and seasonal savings on handcrafted solid wood furniture.
        </p>
      </div>

      {isLoading ? (
        <PageLoader text="Loading exclusive furniture offers..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOffers} />
      ) : offers.length === 0 ? (
        <EmptyState
          icon={Percent}
          title="No active promotional offers right now"
          description="Check back soon for festive sales and seasonal discount events."
          actionLabel="Explore Furniture Catalog"
          actionTo="/products"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="surface-card"
              style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {offer.image && (
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'var(--neutral-100)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <img
                    src={getImageUrl(offer.image)}
                    alt={offer.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
                  {offer.discount_type === 'PERCENTAGE'
                    ? `${offer.discount_value}% DISCOUNT`
                    : `FLAT ₹${offer.discount_value} OFF`}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', color: 'var(--neutral-900)', marginBottom: '0.5rem' }}>
                {offer.title}
              </h3>

              {offer.description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {offer.description}
                </p>
              )}

              <div
                style={{
                  marginTop: 'auto',
                  borderTop: '1px solid var(--neutral-100)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--neutral-500)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} />
                  <span>
                    Valid: {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                  </span>
                </div>

                <Link to="/products" className="btn btn-primary btn-sm">
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OffersPage;
