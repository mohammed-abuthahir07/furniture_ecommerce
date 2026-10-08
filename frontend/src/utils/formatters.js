/**
 * Format currency, dates, numbers, furniture dimensions, and status badges.
 */

// Currency formatter (INR default or format as currency)
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0.00';
  }
  const num = Number(amount);
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Number formatter with commas (e.g. 1,234)
export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(Number(num))) {
    return '0';
  }
  return Number(num).toLocaleString('en-IN');
}

// Calculate discount percentage
export function calculateDiscount(mrp, sellingPrice) {
  const m = Number(mrp);
  const s = Number(sellingPrice);
  if (!m || !s || m <= s) return 0;
  return Math.round(((m - s) / m) * 100);
}

// Format furniture dimensions (Length × Width × Height)
export function formatDimensions(length, width, height, unit = 'in') {
  if (!length && !width && !height) return null;
  const l = length ? Number(length).toFixed(0) : '-';
  const w = width ? Number(width).toFixed(0) : '-';
  const h = height ? Number(height).toFixed(0) : '-';
  return `${l} × ${w} × ${h} ${unit}`;
}

// Date formatter
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Map order / inventory / request status to badge class & label
export function getStatusBadgeInfo(status) {
  switch (status) {
    case 'PENDING':
      return { class: 'badge-warning', label: 'Pending' };
    case 'CONFIRMED':
      return { class: 'badge-info', label: 'Confirmed' };
    case 'PROCESSING':
      return { class: 'badge-info', label: 'Processing' };
    case 'SHIPPED':
      return { class: 'badge-primary', label: 'Shipped' };
    case 'OUT_FOR_DELIVERY':
      return { class: 'badge-primary', label: 'Out for Delivery' };
    case 'DELIVERED':
      return { class: 'badge-success', label: 'Delivered' };
    case 'CANCELLED':
      return { class: 'badge-danger', label: 'Cancelled' };
    case 'ACTIVE':
      return { class: 'badge-success', label: 'Active' };
    case 'INACTIVE':
      return { class: 'badge-neutral', label: 'Inactive' };
    case 'AVAILABLE':
      return { class: 'badge-success', label: 'Available' };
    case 'LOW STOCK':
      return { class: 'badge-warning', label: 'Low Stock' };
    case 'SOLD OUT':
      return { class: 'badge-danger', label: 'Sold Out' };
    case 'UNDER_REVIEW':
      return { class: 'badge-warning', label: 'Under Review' };
    case 'ADMIN_REPLIED':
      return { class: 'badge-info', label: 'Admin Replied' };
    case 'CUSTOMER_ACCEPTED':
      return { class: 'badge-success', label: 'Customer Accepted' };
    case 'READY_TO_ORDER':
      return { class: 'badge-success', label: 'Ready to Order' };
    case 'ORDERED':
      return { class: 'badge-success', label: 'Ordered' };
    case 'REJECTED':
      return { class: 'badge-danger', label: 'Rejected' };
    default:
      return { class: 'badge-neutral', label: status || 'Unknown' };
  }
}
