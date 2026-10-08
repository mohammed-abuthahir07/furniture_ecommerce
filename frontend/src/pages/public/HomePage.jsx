import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Armchair,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Percent,
  Compass,
} from 'lucide-react';
import publicApi from '../../services/publicApi';
import ProductCard from '../../components/common/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHomeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, prodRes, offRes, recRes] = await Promise.allSettled([
        publicApi.getCategories(),
        publicApi.getProducts(),
        publicApi.getOffers(),
        publicApi.getRecommendations(undefined, 4),
      ]);

      if (catRes.status === 'fulfilled' && catRes.value.success) {
        setCategories(catRes.value.data || []);
      }
      if (prodRes.status === 'fulfilled' && prodRes.value.success) {
        setProducts(prodRes.value.data || []);
      }
      if (offRes.status === 'fulfilled' && offRes.value.success) {
        setOffers(offRes.value.data || []);
      }
      if (recRes.status === 'fulfilled' && recRes.value.success) {
        setRecommendations(recRes.value.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load home page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  // Filter sections dynamically from real backend products
  const featuredProducts = products.slice(0, 4);
  const topRatedProducts = [...products]
    .sort((a, b) => Number(b.average_rating || 0) - Number(a.average_rating || 0))
    .slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Artisan Handcrafted Collections</span>
              </div>
              <h1 className="hero-title">
                Timeless Solid Wood <span>Living & Interiors</span>
              </h1>
              <p className="hero-subtitle">
                Transform your home with sustainably sourced Sheesham, Teak, and Oak furniture.
                Every piece engineered for enduring beauty, comfort, and heirloom longevity.
              </p>
              <div className="hero-cta-group">
                <Link to="/products" className="btn btn-primary btn-lg">
                  <span>Explore Catalog</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/custom-requirement" className="btn btn-secondary btn-lg">
                  <Compass size={18} />
                  <span>Custom Studio</span>
                </Link>
              </div>
            </div>

            <div className="hero-image-card">
              <img
                src={
                  categories[0]?.image
                    ? getImageUrl(categories[0].image)
                    : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'
                }
                alt="Living room interior furniture"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Bar */}
      <div className="container">
        <div className="features-bar">
          <div className="feature-item">
            <div className="feature-icon-box">
              <Truck size={24} />
            </div>
            <div>
              <h4>White-Glove Delivery</h4>
              <p>Safe delivery & on-site assembly</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4>10-Year Timber Warranty</h4>
              <p>100% genuine seasoned wood</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4>Easy 7-Day Replacement</h4>
              <p>Guaranteed customer satisfaction</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <Sparkles size={24} />
            </div>
            <div>
              <h4>Bespoke Customization</h4>
              <p>Custom dimensions & finishes</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="container" style={{ margin: '2rem auto' }}>
          <ErrorState message={error} onRetry={loadHomeData} />
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2>Shop by Furniture Category</h2>
              <p className="section-subtitle">Discover curated collections tailored for each space in your home</p>
            </div>
            <Link to="/categories" className="btn btn-outline btn-sm">
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="category-card"
              >
                <div className="category-card-image">
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    onError={handleImageError}
                  />
                </div>
                <h3 className="category-card-title">{cat.name}</h3>
                {cat.description && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', marginTop: 4 }}>
                    {cat.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Active Promotional Offers Banner */}
      {offers.length > 0 && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #a46d49 0%, #6f3f2a 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="badge badge-warning" style={{ background: '#fff', color: 'var(--primary-800)', marginBottom: '1rem' }}>
                <Percent size={13} /> Limited Period Season Offer
              </div>
              <h2 style={{ color: '#ffffff', marginBottom: '0.75rem' }}>{offers[0].title}</h2>
              <p style={{ color: 'var(--primary-100)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {offers[0].description}
              </p>
              <Link to="/offers" className="btn btn-dark btn-md">
                <span>View All Offers</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {offers[0].image && (
              <div style={{ maxHeight: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img
                  src={getImageUrl(offers[0].image)}
                  alt={offers[0].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={handleImageError}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <div>
            <h2>Featured Furniture</h2>
            <p className="section-subtitle">Architectural lines, ergonomic comfort, and solid craftsmanship</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            <span>Explore All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState title="No featured products" description="Browse our catalog to view available furniture." />
        )}
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2>New Arrivals</h2>
              <p className="section-subtitle">Latest designs crafted in our studio</p>
            </div>
            <Link to="/products?sort=newest" className="btn btn-outline btn-sm">
              <span>View Latest</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="products-grid">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated Furniture */}
      {topRatedProducts.length > 0 && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2>Customer Favorites & Top Rated</h2>
              <p className="section-subtitle">Loved and highly reviewed by homeowners</p>
            </div>
          </div>

          <div className="products-grid">
            {topRatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Custom Requirement CTA Banner */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div
          style={{
            background: 'var(--neutral-100)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <Armchair size={36} color="var(--primary-600)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.75rem' }}>Need Custom Dimensions or Made-to-Order Furniture?</h2>
          <p style={{ color: 'var(--neutral-600)', maxWidth: '600px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
            Have a specific living room layout or architectural measurement? Submit your custom requirements,
            wood preferences, and reference sketches to our master craftsmen.
          </p>
          <Link to="/custom-requirement" className="btn btn-primary btn-lg">
            <span>Submit Custom Requirement</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
