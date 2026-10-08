import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import { PriceDisplay } from './PriceDisplay';
import { RatingStars } from './RatingStars';
import { DimensionsBadge } from './DimensionsBadge';
import { calculateDiscount } from '../../utils/formatters';

export function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!product) return null;

  const {
    id,
    name,
    category_name,
    brand,
    main_image,
    mrp,
    selling_price,
    material,
    wood_type,
    length,
    width,
    height,
    average_rating,
    total_reviews,
  } = product;

  const wishlisted = isWishlisted(id);
  const discount = calculateDiscount(mrp, selling_price);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-card-image-wrapper">
        <img
          src={getImageUrl(main_image)}
          alt={name}
          className="product-card-image"
          loading="lazy"
          onError={handleImageError}
        />

        <div className="product-card-badges">
          {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        </div>

        <button
          type="button"
          className={`product-card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className="product-card-body">
        {category_name && <div className="product-card-category">{category_name}</div>}

        <Link to={`/products/${id}`}>
          <h3 className="product-card-title" title={name}>
            {name}
          </h3>
        </Link>

        <div className="product-card-meta">
          {brand && <span className="product-card-spec-pill">{brand}</span>}
          {material && <span className="product-card-spec-pill">{material}</span>}
          {wood_type && <span className="product-card-spec-pill">{wood_type}</span>}
        </div>

        {(length || width || height) && (
          <DimensionsBadge length={length} width={width} height={height} />
        )}

        <div style={{ marginBottom: '0.6rem' }}>
          <RatingStars rating={average_rating} totalReviews={total_reviews} />
        </div>

        <PriceDisplay mrp={mrp} sellingPrice={selling_price} />
      </div>
    </div>
  );
}

export default ProductCard;
