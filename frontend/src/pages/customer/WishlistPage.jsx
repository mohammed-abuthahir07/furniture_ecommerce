import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import PriceDisplay from '../../components/common/PriceDisplay';
import RatingStars from '../../components/common/RatingStars';
import EmptyState from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/Loader';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function WishlistPage() {
  const { wishlist, wishlistCount, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (isLoading && wishlist.length === 0) {
    return <PageLoader text="Loading your saved furniture pieces..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Saved Furniture ({wishlistCount})</h2>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
          Furniture pieces you've bookmarked for your home interior projects.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Explore our catalog and click the heart icon on any furniture design to save it here."
          actionLabel="Explore Furniture"
          actionTo="/products"
        />
      ) : (
        <div className="products-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="product-card">
              <Link to={`/products/${item.product_id || item.id}`} className="product-card-image-wrapper">
                <img
                  src={getImageUrl(item.main_image)}
                  alt={item.name}
                  className="product-card-image"
                  onError={handleImageError}
                />
              </Link>

              <div className="product-card-body">
                {item.category_name && (
                  <div className="product-card-category">{item.category_name}</div>
                )}

                <Link to={`/products/${item.product_id || item.id}`}>
                  <h3 className="product-card-title">{item.name}</h3>
                </Link>

                <div style={{ marginBottom: '0.6rem' }}>
                  <RatingStars rating={item.average_rating} totalReviews={item.total_reviews} />
                </div>

                <PriceDisplay mrp={item.mrp} sellingPrice={item.selling_price} />

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link
                    to={`/products/${item.product_id || item.id}`}
                    className="btn btn-primary btn-sm btn-block"
                  >
                    <ShoppingBag size={14} />
                    <span>Select & Buy</span>
                  </Link>

                  <button
                    type="button"
                    className="action-btn-sm"
                    style={{ height: '34px', width: '34px', color: 'var(--danger-500)' }}
                    onClick={() => removeFromWishlist(item.product_id || item.id)}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
