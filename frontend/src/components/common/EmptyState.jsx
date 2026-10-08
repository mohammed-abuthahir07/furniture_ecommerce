import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'We could not find any items matching your criteria.',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={34} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {actionLabel && (
        <>
          {actionTo ? (
            <Link to={actionTo} className="btn btn-primary btn-sm">
              {actionLabel}
            </Link>
          ) : (
            <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default EmptyState;
