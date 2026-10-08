import { Link } from 'react-router-dom';
import { Armchair, Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-100)',
          color: 'var(--primary-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}
      >
        <Armchair size={40} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--neutral-900)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Furniture Piece Not Found</h2>
      <p style={{ color: 'var(--neutral-600)', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
        The page or collection you are looking for might have been moved, renamed, or is currently unavailable.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-md">
          <Home size={16} />
          <span>Return to Home</span>
        </Link>
        <Link to="/products" className="btn btn-secondary btn-md">
          <Search size={16} />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
