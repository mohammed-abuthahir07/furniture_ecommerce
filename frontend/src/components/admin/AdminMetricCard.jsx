export function AdminMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
}) {
  return (
    <div className="metric-card">
      <div className="metric-info">
        <h4>{title}</h4>
        <div className="metric-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
            {subtitle}
          </div>
        )}
      </div>
      {Icon && (
        <div className={`metric-icon-box ${variant}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}

export default AdminMetricCard;
