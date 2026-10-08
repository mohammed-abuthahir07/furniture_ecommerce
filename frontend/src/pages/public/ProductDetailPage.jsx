import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  Wrench,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import publicApi from '../../services/publicApi';
import customerApi from '../../services/customerApi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ImageGallery from '../../components/common/ImageGallery';
import RatingStars from '../../components/common/RatingStars';
import PriceDisplay from '../../components/common/PriceDisplay';
import DimensionsBadge from '../../components/common/DimensionsBadge';
import QuantitySelector from '../../components/common/QuantitySelector';
import StatusBadge from '../../components/common/StatusBadge';
import ProductCard from '../../components/common/ProductCard';
import Modal from '../../components/common/Modal';
import { DetailPageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate } from '../../utils/formatters';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCustomerAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [prodRes, recRes] = await Promise.all([
        publicApi.getProductById(id),
        publicApi.getRecommendations(id, 4),
      ]);

      if (prodRes.success && prodRes.data) {
        setProduct(prodRes.data);
        // Select first available variant by default
        if (Array.isArray(prodRes.data.variants) && prodRes.data.variants.length > 0) {
          const available = prodRes.data.variants.find((v) => v.stock_quantity > 0) || prodRes.data.variants[0];
          setSelectedVariant(available);
        }
      }
      if (recRes.success && Array.isArray(recRes.data)) {
        setRecommendations(recRes.data);
      }
    } catch (err) {
      setError(err.message || 'Product not found or unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    setQuantity(1);
    setIsLoading(true);
    setError(null);

    Promise.all([
      publicApi.getProductById(id),
      publicApi.getRecommendations(id, 4),
    ]).then(([prodRes, recRes]) => {
      if (!active) return;
      if (prodRes.success && prodRes.data) {
        setProduct(prodRes.data);
        if (Array.isArray(prodRes.data.variants) && prodRes.data.variants.length > 0) {
          const available = prodRes.data.variants.find((v) => v.stock_quantity > 0) || prodRes.data.variants[0];
          setSelectedVariant(available);
        }
      } else {
        setProduct(null);
      }
      if (recRes.success && Array.isArray(recRes.data)) {
        setRecommendations(recRes.data);
      }
    }).catch((err) => {
      if (!active) return;
      setError(err.message || 'Product not found or unavailable.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <DetailPageSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <ErrorState
          title="Product Unavailable"
          message={error || 'This furniture item could not be found.'}
          onRetry={fetchProduct}
        />
      </div>
    );
  }

  const {
    name,
    category_id,
    category_name,
    brand,
    main_image,
    short_description,
    description,
    mrp,
    selling_price,
    material,
    wood_type,
    length,
    width,
    height,
    weight,
    seating_capacity,
    assembly_required,
    delivery_days,
    images = [],
    variants = [],
    rating = { average_rating: 0, total_reviews: 0 },
    reviews = [],
  } = product;

  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = !selectedVariant || selectedVariant.stock_quantity <= 0;
  const maxAvailableStock = selectedVariant?.stock_quantity || 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toastError('Please select a variant option.');
      return;
    }
    await addToCart(product.id, selectedVariant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toastError('Please select a variant option.');
      return;
    }
    const added = await addToCart(product.id, selectedVariant.id, quantity);
    if (added) {
      navigate('/checkout');
    }
  };

  const handleCompare = () => {
    navigate(`/compare?product_ids=${product.id}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomerAuthenticated) {
      toastError('Please log in to submit your review.');
      return;
    }
    if (!reviewComment.trim()) {
      toastError('Please enter a review comment.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await customerApi.addReview({
        product_id: product.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (res.success) {
        success(res.message || 'Review submitted for approval!');
        setIsReviewModalOpen(false);
        setReviewComment('');
        fetchProduct();
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const breadcrumbs = [
    { label: 'All Furniture', to: '/products' },
    category_name ? { label: category_name, to: `/categories/${category_id}` } : null,
    { label: name },
  ].filter(Boolean);

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div className="product-detail-layout">
        {/* Left: Multi-Angle Furniture Image Gallery */}
        <div>
          <ImageGallery
            mainImage={main_image}
            galleryImages={images}
            productName={name}
          />
        </div>

        {/* Right: Furniture Details, Variants, Specs & Actions */}
        <div className="product-detail-info">
          {category_name && <div className="product-brand-tag">{category_name}</div>}
          <h1 className="product-detail-title">{name}</h1>

          {/* Rating Summary */}
          <div className="product-detail-rating-row">
            <RatingStars rating={rating.average_rating} totalReviews={rating.total_reviews} size={18} />
            {brand && <span style={{ color: 'var(--neutral-400)' }}>• Brand: <strong style={{ color: 'var(--neutral-800)' }}>{brand}</strong></span>}
          </div>

          {/* Pricing */}
          <div className="product-detail-pricing">
            <PriceDisplay mrp={mrp} sellingPrice={selling_price} size="lg" />
          </div>

          {/* Short Description */}
          {short_description && (
            <p className="product-detail-desc">{short_description}</p>
          )}

          {/* Furniture Specifications Card */}
          <div className="furniture-specs-card">
            <div className="specs-grid">
              {material && (
                <div className="spec-item">
                  <span className="spec-label">Material</span>
                  <span className="spec-value">{material}</span>
                </div>
              )}
              {wood_type && (
                <div className="spec-item">
                  <span className="spec-label">Wood Type</span>
                  <span className="spec-value">{wood_type}</span>
                </div>
              )}
              {(length || width || height) && (
                <div className="spec-item">
                  <span className="spec-label">Dimensions (L × W × H)</span>
                  <span className="spec-value">
                    <DimensionsBadge length={length} width={width} height={height} />
                  </span>
                </div>
              )}
              {weight && (
                <div className="spec-item">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{weight} kg</span>
                </div>
              )}
              {seating_capacity && (
                <div className="spec-item">
                  <span className="spec-label">Seating Capacity</span>
                  <span className="spec-value">{seating_capacity} Person{seating_capacity > 1 ? 's' : ''}</span>
                </div>
              )}
              {assembly_required && (
                <div className="spec-item">
                  <span className="spec-label">Assembly Required</span>
                  <span className="spec-value">
                    {assembly_required === 'YES' ? 'Yes (Handled upon delivery)' : 'No (Pre-assembled)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {variants.length > 0 && (
            <div className="variant-selection-section">
              <div className="variant-selection-label">
                Select Finish / Variant: {selectedVariant?.variant_name} {selectedVariant?.color && `(${selectedVariant.color})`}
              </div>
              <div className="variant-chips-row">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const inStock = v.stock_quantity > 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`variant-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                      style={!inStock ? { opacity: 0.5 } : {}}
                    >
                      {v.color && (
                        <span
                          className="variant-color-dot"
                          style={{ backgroundColor: v.color.toLowerCase().includes('walnut') ? '#5c4033' : v.color.toLowerCase().includes('teak') ? '#b8860b' : '#8b5a2b' }}
                        />
                      )}
                      <span>{v.variant_name}</span>
                      <StatusBadge status={v.availability_status} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock & Delivery Promise */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
              <Clock size={16} color="var(--primary-600)" />
              <span>
                Estimated Delivery in <strong>{delivery_days || 7} business days</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
              <Wrench size={16} color="var(--primary-600)" />
              <span>
                {assembly_required === 'YES'
                  ? 'Complimentary white-glove carpenter assembly upon delivery'
                  : 'Delivered fully assembled and ready to use'}
              </span>
            </div>

            {selectedVariant && (
              <div style={{ fontSize: '0.85rem' }}>
                {selectedVariant.stock_quantity > 5 ? (
                  <span style={{ color: 'var(--success-500)', fontWeight: 600 }}>
                    ✓ In Stock & Ready to Ship
                  </span>
                ) : selectedVariant.stock_quantity > 0 ? (
                  <span style={{ color: 'var(--warning-500)', fontWeight: 600 }}>
                    ⚠️ Only {selectedVariant.stock_quantity} left in stock - order soon
                  </span>
                ) : (
                  <span style={{ color: 'var(--danger-500)', fontWeight: 600 }}>
                    ✕ Out of stock in this variant
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="product-actions-bar">
            {!isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                max={Math.min(maxAvailableStock, 10)}
                onChange={setQuantity}
                disabled={isOutOfStock}
              />
            )}

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={18} />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            <button
              type="button"
              className="btn btn-dark btn-lg"
              style={{ flex: 1 }}
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              <Zap size={18} />
              <span>Buy Now</span>
            </button>

            <button
              type="button"
              className={`btn btn-secondary btn-lg ${wishlisted ? 'active' : ''}`}
              style={{ padding: '0.95rem 1rem' }}
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              title={wishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
            >
              <Heart size={20} fill={wishlisted ? 'var(--danger-500)' : 'none'} color={wishlisted ? 'var(--danger-500)' : 'currentColor'} />
            </button>

            <button
              type="button"
              className="btn btn-outline btn-lg"
              style={{ padding: '0.95rem 1rem' }}
              onClick={handleCompare}
              title="Compare with other furniture"
            >
              <Layers size={20} />
              <span>Compare</span>
            </button>
          </div>

          {/* Need Customization Option */}
          <div className="custom-request-bar">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-900)' }}>
                Need customized dimensions or custom finish?
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-700)' }}>
                Submit a customization request for this design.
              </div>
            </div>
            <Link
              to={`/account/customizations?product_id=${product.id}`}
              className="btn btn-outline btn-sm"
              style={{ background: '#fff' }}
            >
              Request Customization
            </Link>
          </div>
        </div>
      </div>

      {/* Description Tab & Specifications */}
      <section style={{ margin: '3rem 0', padding: '2rem 0', borderTop: '1px solid var(--neutral-200)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Product Description & Craftsmanship</h2>
        <div style={{ color: 'var(--neutral-700)', lineHeight: 1.8, fontSize: '0.98rem', maxWidth: '850px' }}>
          {description ? (
            <div style={{ whiteSpace: 'pre-line' }}>{description}</div>
          ) : (
            <p>
              Each piece of our solid wood collection is hand-selected and crafted with seasoned timber.
              Finished with premium natural oils and protective coatings to preserve timber grain, prevent warping,
              and highlight organic character.
            </p>
          )}
        </div>
      </section>

      {/* Approved Reviews & Ratings Section */}
      <section style={{ margin: '3rem 0', padding: '2rem 0', borderTop: '1px solid var(--neutral-200)' }}>
        <div className="section-header">
          <div>
            <h2>Customer Reviews & Ratings</h2>
            <p className="section-subtitle">Verified feedback from homeowners</p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsReviewModalOpen(true)}
          >
            <Star size={14} />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div style={{ padding: '2rem', background: '#fff', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--neutral-300)' }}>
            <p style={{ color: 'var(--neutral-600)', marginBottom: '1rem' }}>No reviews yet for this product. Be the first to share your experience!</p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write Review
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {reviews.map((rev) => (
              <div key={rev.id} className="surface-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <RatingStars rating={rev.rating} showCount={false} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>
                    {formatDate(rev.created_at)}
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--neutral-700)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  "{rev.comment}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-900)' }}>
                  <CheckCircle2 size={14} color="var(--success-500)" />
                  <span>{rev.customer_name || 'Verified Buyer'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review: ${name}`}
      >
        <form onSubmit={handleReviewSubmit}>
          <div className="form-group">
            <label className="form-label">Your Rating (1 to 5 Stars)</label>
            <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  style={{ color: star <= reviewRating ? 'var(--accent-amber)' : 'var(--neutral-300)' }}
                  aria-label={`${star} star rating`}
                >
                  <Star size={28} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-comment">
              Your Review & Experience <span className="required">*</span>
            </label>
            <textarea
              id="review-comment"
              className="form-textarea"
              rows={4}
              placeholder="Tell us about the wood quality, comfort, finish, and delivery..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Recommended Products */}
      {recommendations.length > 0 && (
        <section style={{ margin: '4rem 0' }}>
          <div className="section-header">
            <div>
              <h2>Matching Interior Recommendations</h2>
              <p className="section-subtitle">Complementary designs crafted in matching wood finishes</p>
            </div>
          </div>

          <div className="products-grid">
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
