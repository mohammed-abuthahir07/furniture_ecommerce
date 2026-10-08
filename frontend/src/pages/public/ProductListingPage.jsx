import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import publicApi from '../../services/publicApi';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';

export function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state parameters
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category_id') || '';
  const materialParam = searchParams.get('material') || '';
  const woodTypeParam = searchParams.get('wood_type') || '';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = Number(searchParams.get('page')) || 1;

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 12,
    total_products: 0,
    total_pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Form input local filters for price
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);

  // Load categories for filter sidebar
  useEffect(() => {
    publicApi.getCategories().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }).catch(() => {});
  }, []);

  // Fetch filtered products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await publicApi.filterProducts({
        search: searchParam,
        category_id: categoryParam,
        material: materialParam,
        wood_type: woodTypeParam,
        min_price: minPriceParam,
        max_price: maxPriceParam,
        sort: sortParam,
        page: pageParam,
        limit: 12,
      });

      if (res.success) {
        setProducts(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParam, categoryParam, materialParam, woodTypeParam, minPriceParam, maxPriceParam, sortParam, pageParam]);

  // Update query params helper
  const updateQueryParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    // Reset page to 1 on filter change
    if (key !== 'page') {
      nextParams.set('page', '1');
    }
    setSearchParams(nextParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (tempMinPrice) nextParams.set('min_price', tempMinPrice);
    else nextParams.delete('min_price');

    if (tempMaxPrice) nextParams.set('max_price', tempMaxPrice);
    else nextParams.delete('max_price');

    nextParams.set('page', '1');
    setSearchParams(nextParams);
    setIsMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setTempMinPrice('');
    setTempMaxPrice('');
    setIsMobileFilterOpen(false);
  };

  const breadcrumbs = [
    { label: 'All Furniture', to: '/products' },
  ];

  // Common materials & wood types in furniture
  const commonMaterials = ['Solid Wood', 'Engineered Wood', 'Upholstered Fabric', 'Genuine Leather', 'Metal & Wood', 'Rattan / Cane'];
  const commonWoodTypes = ['Sheesham (Indian Rosewood)', 'Teak Wood', 'Oak Wood', 'Walnut Wood', 'Mango Wood', 'Acacia Wood', 'Pine Wood'];

  const FilterSidebarContent = (
    <div className="filters-sidebar">
      <div className="filters-header">
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={18} />
          <span>Filters</span>
        </h3>
        <button
          type="button"
          onClick={handleClearFilters}
          style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <div className="filter-title">Category</div>
        <label className="filter-option">
          <input
            type="radio"
            name="category_filter"
            checked={categoryParam === ''}
            onChange={() => updateQueryParam('category_id', '')}
          />
          <span>All Categories</span>
        </label>
        {categories.map((c) => (
          <label key={c.id} className="filter-option">
            <input
              type="radio"
              name="category_filter"
              checked={String(categoryParam) === String(c.id)}
              onChange={() => updateQueryParam('category_id', c.id)}
            />
            <span>{c.name}</span>
          </label>
        ))}
      </div>

      {/* Material Filter */}
      <div className="filter-group">
        <div className="filter-title">Material</div>
        <label className="filter-option">
          <input
            type="radio"
            name="material_filter"
            checked={materialParam === ''}
            onChange={() => updateQueryParam('material', '')}
          />
          <span>Any Material</span>
        </label>
        {commonMaterials.map((mat) => (
          <label key={mat} className="filter-option">
            <input
              type="radio"
              name="material_filter"
              checked={materialParam === mat}
              onChange={() => updateQueryParam('material', mat)}
            />
            <span>{mat}</span>
          </label>
        ))}
      </div>

      {/* Wood Type Filter */}
      <div className="filter-group">
        <div className="filter-title">Wood Type</div>
        <label className="filter-option">
          <input
            type="radio"
            name="wood_type_filter"
            checked={woodTypeParam === ''}
            onChange={() => updateQueryParam('wood_type', '')}
          />
          <span>Any Wood Type</span>
        </label>
        {commonWoodTypes.map((wood) => (
          <label key={wood} className="filter-option">
            <input
              type="radio"
              name="wood_type_filter"
              checked={woodTypeParam === wood}
              onChange={() => updateQueryParam('wood_type', wood)}
            />
            <span>{wood}</span>
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <div className="filter-title">Price Range (₹)</div>
        <form onSubmit={handlePriceApply}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <input
              type="number"
              placeholder="Min ₹"
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
              value={tempMinPrice}
              onChange={(e) => setTempMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max ₹"
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm btn-block">
            Apply Price
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Handcrafted Solid Wood Furniture</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
          Explore our complete collection of bespoke living, dining, bedroom, and office furniture.
        </p>
      </div>

      <div className="product-listing-layout">
        {/* Desktop Filter Sidebar */}
        {FilterSidebarContent}

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="drawer-overlay" onClick={() => setIsMobileFilterOpen(false)}>
            <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Filters</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              {FilterSidebarContent}
            </div>
          </div>
        )}

        {/* Products Listing Content */}
        <div>
          {/* Top Bar: Count & Sort */}
          <div className="listing-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                Showing {pagination.total_products} {pagination.total_products === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', whiteSpace: 'nowrap' }}>
                Sort By:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                value={sortParam}
                onChange={(e) => updateQueryParam('sort', e.target.value)}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Product Grid / Loading / Error */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No furniture found matching criteria"
              description="Try adjusting your filters, price range, or search keyword."
              actionLabel="Clear All Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={(page) => updateQueryParam('page', page)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
