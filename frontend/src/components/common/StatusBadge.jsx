import { getStatusBadgeInfo } from '../../utils/formatters';

export function StatusBadge({ status, customLabel }) {
  if (!status) return null;
  const info = getStatusBadgeInfo(status);

  return (
    <span className={`badge ${info.class}`}>
      {customLabel || info.label}
    </span>
  );
}

export default StatusBadge;
