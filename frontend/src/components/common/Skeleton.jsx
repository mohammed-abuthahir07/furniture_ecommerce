export function ProductCardSkeleton() {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ width: '100%', paddingTop: '75%' }} />
      <div className="product-card-body" style={{ gap: '0.5rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton" style={{ width: '85%', height: '20px' }} />
        <div className="skeleton" style={{ width: '60%', height: '14px' }} />
        <div className="skeleton" style={{ width: '50%', height: '22px', marginTop: 'auto' }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div style={{ padding: '1rem' }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="skeleton"
              style={{ flex: 1, height: '24px', borderRadius: '4px' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="product-detail-layout">
      <div className="skeleton" style={{ width: '100%', aspectRatio: '4/3', borderRadius: '12px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ width: '30%', height: '16px' }} />
        <div className="skeleton" style={{ width: '80%', height: '36px' }} />
        <div className="skeleton" style={{ width: '40%', height: '20px' }} />
        <div className="skeleton" style={{ width: '50%', height: '32px' }} />
        <div className="skeleton" style={{ width: '100%', height: '100px' }} />
        <div className="skeleton" style={{ width: '100%', height: '80px' }} />
        <div className="skeleton" style={{ width: '50%', height: '48px' }} />
      </div>
    </div>
  );
}
