export function Spinner({ size = 28, color = 'var(--primary-600)' }) {
  return (
    <div
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid rgba(164, 109, 73, 0.2)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
      aria-label="Loading..."
    />
  );
}

export function PageLoader({ text = 'Loading handcrafted furniture...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1rem',
        gap: '1rem',
        color: 'var(--neutral-600)',
      }}
    >
      <Spinner size={36} />
      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{text}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PageLoader;
