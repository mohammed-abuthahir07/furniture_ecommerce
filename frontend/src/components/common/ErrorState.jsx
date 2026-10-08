import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this data. Please try again.',
  onRetry,
}) {
  return (
    <div className="empty-state" style={{ borderColor: 'var(--danger-500)', background: '#fff9f9' }}>
      <div className="empty-state-icon" style={{ background: 'var(--danger-50)', color: 'var(--danger-500)' }}>
        <AlertCircle size={34} />
      </div>
      <h3 className="empty-state-title" style={{ color: 'var(--danger-500)' }}>{title}</h3>
      <p className="empty-state-text">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ErrorState;
