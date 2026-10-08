import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layers, X, Plus, Check, ShoppingBag, Eye } from 'lucide-react';
import publicApi from '../../services/publicApi';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { RatingStars } from '../../components/common/RatingStars';
import { DimensionsBadge } from '../../components/common/DimensionsBadge';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function ProductComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productIdsParam = searchParams.get('product_ids') || '';

  const [comparedProducts, setComparedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comparison products
  useEffect(() => {
    const ids = productIdsParam.split(',').map((s) => s.trim()).filter(Boolean);

    if (ids.length === 0) {
      setComparedProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    publicApi
      .compareProducts(ids)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setComparedProducts(res.data);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to compare products.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productIdsParam]);

  // Load all products for the selector dropdown
  useEffect(() => {
    publicApi.getProducts().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setAllProducts(res.data);
      }
    }).catch(() => {});
  }, []);

  const handleRemoveProduct = (productId) => {
    const ids = productIdsParam
      .split(',')
      .map((s) => s.trim())
      .filter((id) => id && Number(id) !== Number(productId));
    setSearchParams(ids.length > 0 ? { product_ids: ids.join(',') } : {});
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!selectedToAdd) return;
    const currentIds = productIdsParam.split(',').map((s) => s.trim()).filter(Boolean);
    if (!currentIds.includes(String(selectedToAdd))) {
      if (currentIds.length >= 4) {
        alert('You can compare a maximum of 4 furniture items at once.');
        return;
      }
      currentIds.push(String(selectedToAdd));
      setSearchParams({ product_ids: currentIds.join(',') });
      setSelectedToAdd('');
    }
  };

  const breadcrumbs = [
    { label: 'Compare Furniture', to: '/compare' },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginBottom: '2rem' }}>
        <h1>Side-by-Side Furniture Comparison</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
          Compare wood types, dimensions, seating capacity, and specifications across up to 4 furniture pieces.
        </p>
      </div>

      {/* Add Product to Comparison Bar */}
      <div
        className="surface-card"
        style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600 }}>
          <Layers size={18} color="var(--primary-600)" />
          <span>Comparing {comparedProducts.length} of 4 items</span>
        </div>

        {comparedProducts.length < 4 && (
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: '280px', height: '38px', fontSize: '0.85rem' }}
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
            >
              <option value="">-- Select furniture to compare --</option>
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand || 'WoodCraft'})
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary btn-sm" disabled={!selectedToAdd}>
              <Plus size={14} />
              <span>Add to Matrix</span>
            </button>
          </form>
        )}
      </div>

      {isLoading ? (
        <PageLoader text="Loading furniture specifications matrix..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : comparedProducts.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No products selected for comparison"
          description="Select products from the catalog or dropdown above to inspect their dimensions, wood quality, and specifications side by side."
          actionLabel="Browse All Furniture"
          actionTo="/products"
        />
      ) : (
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Specification</th>
                {comparedProducts.map((p) => (
                  <td key={p.id} style={{ verticalAlign: 'top', minWidth: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{p.category_name || 'Furniture'}</span>
                      <button
                        type="button"
                        className="modal-close-btn"
                        style={{ width: 24, height: 24 }}
                        onClick={() => handleRemoveProduct(p.id)}
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div style={{ width: '100%', height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--neutral-100)', marginBottom: '0.75rem' }}>
                      <img
                        src={getImageUrl(p.main_image)}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={handleImageError}
                      />
                    </div>

                    <Link to={`/products/${p.id}`} style={{ fontWeight: 700, color: 'var(--neutral-900)', display: 'block', marginBottom: '0.5rem' }}>
                      {p.name}
                    </Link>

                    <PriceDisplay mrp={p.mrp} sellingPrice={p.selling_price} />

                    <div style={{ marginTop: '0.75rem' }}>
                      <Link to={`/products/${p.id}`} className="btn btn-primary btn-sm btn-block">
                        <Eye size={14} />
                        <span>View Product</span>
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Brand</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.brand || 'WoodCraft'}</td>
                ))}
              </tr>

              <tr>
                <th>Rating & Reviews</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>
                    <RatingStars rating={p.average_rating} totalReviews={p.total_reviews} />
                  </td>
                ))}
              </tr>

              <tr>
                <th>Material</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.material || 'Solid Seasoned Wood'}</td>
                ))}
              </tr>

              <tr>
                <th>Wood Type</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.wood_type || 'Sheesham / Teak'}</td>
                ))}
              </tr>

              <tr>
                <th>Dimensions (L × W × H)</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>
                    <DimensionsBadge length={p.length} width={p.width} height={p.height} />
                  </td>
                ))}
              </tr>

              <tr>
                <th>Weight</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.weight ? `${p.weight} kg` : 'N/A'}</td>
                ))}
              </tr>

              <tr>
                <th>Seating Capacity</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>
                    {p.seating_capacity ? `${p.seating_capacity} Person${p.seating_capacity > 1 ? 's' : ''}` : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <th>Assembly Required</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>
                    {p.assembly_required === 'YES' ? 'Yes (Carpenter Assembled)' : 'No (Pre-assembled)'}
                  </td>
                ))}
              </tr>

              <tr>
                <th>Estimated Delivery</th>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.delivery_days || 7} Days</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductComparisonPage;
