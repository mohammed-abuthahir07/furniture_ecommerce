import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import publicApi from '../../services/publicApi';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await publicApi.getCategories();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const breadcrumbs = [
    { label: 'Categories', to: '/categories' },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1>Furniture Categories</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '1rem', marginTop: 4 }}>
          Browse our handcrafted solid wood furniture collections organized by living spaces.
        </p>
      </div>

      {isLoading ? (
        <PageLoader text="Loading furniture categories..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCategories} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No categories found"
          description="Categories will appear here once added to the store catalog."
        />
      ) : (
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="category-card"
              style={{ padding: '2rem 1.5rem', textAlign: 'left', alignItems: 'flex-start' }}
            >
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
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={handleImageError}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--neutral-900)', marginBottom: '0.4rem' }}>
                {cat.name}
              </h3>

              {cat.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {cat.description}
                </p>
              )}

              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--primary-600)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <span>View Products</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
