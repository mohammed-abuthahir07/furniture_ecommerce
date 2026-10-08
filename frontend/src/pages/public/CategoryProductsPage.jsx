import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import publicApi from '../../services/publicApi';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ProductCard from '../../components/common/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function CategoryProductsPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        publicApi.getCategoryById(id),
        publicApi.filterProducts({ category_id: id, limit: 50 }),
      ]);

      if (catRes.success && catRes.data) {
        setCategory(catRes.data);
      }
      if (prodRes.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load category products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [id]);

  const breadcrumbs = [
    { label: 'Categories', to: '/categories' },
    { label: category?.name || 'Category', to: `/categories/${id}` },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      {category && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          {category.image && (
            <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={handleImageError}
              />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{category.name}</h1>
            <p style={{ color: 'var(--neutral-600)', maxWidth: '650px', fontSize: '0.92rem' }}>
              {category.description || `Browse all premium handcrafted ${category.name}.`}
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCategoryData} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products in this category yet"
          description="We are currently adding new designs to this category. Please check back soon!"
          actionLabel="Browse All Furniture"
          actionTo="/products"
        />
      ) : (
        <div className="products-grid" style={{ marginBottom: '4rem' }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryProductsPage;
