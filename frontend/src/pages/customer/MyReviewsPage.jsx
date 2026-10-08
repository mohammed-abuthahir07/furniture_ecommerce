import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import customerApi from '../../services/customerApi';
import RatingStars from '../../components/common/RatingStars';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export function MyReviewsPage() {
  const { success, error: toastError } = useToast();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Review Modal
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Review Modal
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerApi.getMyReviews();
      if (res.success && Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your reviews.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const openEditModal = (rev) => {
    setEditingReview(rev);
    setEditRating(rev.rating || 5);
    setEditComment(rev.comment || '');
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      setIsUpdating(true);
      const res = await customerApi.editReview(editingReview.id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      if (res.success) {
        success('Review updated successfully.');
        setEditingReview(null);
        fetchMyReviews();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update review.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      const res = await customerApi.removeReview(deletingId);
      if (res.success) {
        success('Review removed successfully.');
        setDeletingId(null);
        fetchMyReviews();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete review.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Product Reviews ({reviews.length})</h2>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
          Feedback and ratings you've submitted for your purchased furniture.
        </p>
      </div>

      {isLoading ? (
        <PageLoader text="Loading your product reviews..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMyReviews} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="You haven't reviewed any products yet"
          description="Share your thoughts on the craftsmanship, comfort, and delivery of your furniture pieces."
          actionLabel="Browse My Orders"
          actionTo="/account/orders"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="surface-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <Link
                    to={`/products/${rev.product_id}`}
                    style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--neutral-900)' }}
                  >
                    {rev.product_name || `Product #${rev.product_id}`}
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <RatingStars rating={rev.rating} showCount={false} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--neutral-400)' }}>
                      Submitted on {formatDate(rev.created_at)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StatusBadge status={rev.status || 'APPROVED'} />
                  <button
                    type="button"
                    className="action-btn-sm"
                    onClick={() => openEditModal(rev)}
                    title="Edit review"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    className="action-btn-sm"
                    style={{ color: 'var(--danger-500)' }}
                    onClick={() => setDeletingId(rev.id)}
                    title="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p style={{ color: 'var(--neutral-700)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      <Modal
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        title="Edit Your Review"
      >
        {editingReview && (
          <form onSubmit={handleUpdateReview}>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEditRating(s)}
                    style={{ color: s <= editRating ? 'var(--accent-amber)' : 'var(--neutral-300)' }}
                  >
                    <Star size={26} fill={s <= editRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-comment">
                Your Feedback
              </label>
              <textarea
                id="edit-comment"
                className="form-textarea"
                rows={4}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingReview(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Review Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MyReviewsPage;
