import { Star } from 'lucide-react';

export function RatingStars({ rating = 0, totalReviews, showCount = true, size = 15 }) {
  const numericRating = Number(rating) || 0;

  return (
    <div className="rating-stars-container">
      <div className="stars-row" aria-label={`Rating ${numericRating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(numericRating) ? 'star-filled' : ''}
            fill={star <= Math.round(numericRating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <span className="rating-value">{numericRating > 0 ? numericRating.toFixed(1) : 'New'}</span>
      {showCount && totalReviews !== undefined && (
        <span className="rating-count">({totalReviews})</span>
      )}
    </div>
  );
}

export default RatingStars;
