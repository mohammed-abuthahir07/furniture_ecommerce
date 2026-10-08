import { Maximize2 } from 'lucide-react';
import { formatDimensions } from '../../utils/formatters';

export function DimensionsBadge({ length, width, height, unit = 'in' }) {
  const formatted = formatDimensions(length, width, height, unit);
  if (!formatted) return null;

  return (
    <div className="dimensions-badge" title="Dimensions (Length × Width × Height)">
      <Maximize2 size={13} />
      <span>{formatted}</span>
    </div>
  );
}

export default DimensionsBadge;
