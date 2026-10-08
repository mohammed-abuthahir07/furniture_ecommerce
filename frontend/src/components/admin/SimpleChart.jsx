/**
 * Pure SVG responsive charts without external UI/chart frameworks.
 */

// Bar Chart
export function SimpleBarChart({ data = [], height = 220, color = 'var(--primary-600)' }) {
  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data available</div>;
  }

  const maxValue = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  return (
    <div style={{ width: '100%', height, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '10px 0 24px' }}>
      {data.map((item, idx) => {
        const val = Number(item.value) || 0;
        const barHeight = Math.max(4, (val / maxValue) * (height - 50));

        return (
          <div
            key={idx}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'flex-end',
              position: 'relative',
            }}
            title={`${item.label}: ${item.formattedValue || val}`}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '40px',
                height: `${barHeight}px`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: -22,
                fontSize: '0.72rem',
                color: '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                textAlign: 'center',
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Line Chart
export function SimpleLineChart({ data = [], height = 220, color = 'var(--primary-600)' }) {
  if (!data || data.length < 2) {
    return <SimpleBarChart data={data} height={height} color={color} />;
  }

  const values = data.map((d) => Number(d.value) || 0);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  const width = 600;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    const y = height - padding - ((Number(d.value) - minVal) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeDasharray="3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" />

        {/* Path line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((d, idx) => {
          const x = padding + (idx / (data.length - 1)) * chartWidth;
          const y = height - padding - ((Number(d.value) - minVal) / range) * chartHeight;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4"
              fill="#ffffff"
              stroke={color}
              strokeWidth="2.5"
            >
              <title>{`${d.label}: ${d.formattedValue || d.value}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

// Donut Chart
export function SimpleDonutChart({ segments = [], size = 160 }) {
  const total = segments.reduce((sum, s) => sum + (Number(s.value) || 0), 0);
  if (total === 0) {
    return <div style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data</div>;
  }

  let accumulatedAngle = 0;
  const radius = 40;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, idx) => {
          const val = Number(seg.value) || 0;
          const percent = val / total;
          const strokeDasharray = `${percent * circumference} ${circumference}`;
          const strokeDashoffset = -(accumulatedAngle / 360) * circumference;
          accumulatedAngle += percent * 360;

          return (
            <circle
              key={idx}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={seg.color || '#a46d49'}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.map((seg, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: seg.color || '#a46d49' }} />
            <span style={{ color: '#475569' }}>{seg.label}</span>
            <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
