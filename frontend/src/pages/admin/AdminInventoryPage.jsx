import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import getImageUrl from '../../utils/imageUrl';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import TextAreaField from '../../components/forms/TextAreaField';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Search, 
  Filter, 
  RefreshCw,
  TrendingDown,
  Layers
} from 'lucide-react';

const AdminInventoryPage = () => {
  const { showSuccess, showError } = useToast();
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'low-stock'
  const [search, setSearch] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  // Quick edit modal
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [newStock, setNewStock] = useState('');
  const [updateReason, setUpdateReason] = useState('RESTOCK');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const res = await adminApi.getInventorySummary();
      if (res.data?.success) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load inventory summary', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === 'low-stock') {
        res = await adminApi.getLowStock({ page, limit: 15 });
      } else {
        res = await adminApi.getInventory({
          page,
          limit: 15,
          search: search || undefined,
          stock_status: stockStatus || undefined
        });
      }

      if (res.data?.success) {
        const data = res.data.data;
        setItems(data.items || data.inventory || data.variants || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        } else {
          setTotalPages(Math.ceil((data.total || items.length) / 15) || 1);
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [page, activeTab, stockStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInventory();
  };

  const openStockModal = (variant) => {
    setSelectedVariant(variant);
    setNewStock(variant.stock_quantity ?? variant.stock ?? 0);
    setUpdateReason('RESTOCK');
    setUpdateNotes('');
    setStockModalOpen(true);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (newStock === '' || isNaN(newStock) || Number(newStock) < 0) {
      showError('Please enter a valid stock quantity (0 or greater)');
      return;
    }

    try {
      setUpdating(true);
      const res = await adminApi.updateVariantStock(selectedVariant.id || selectedVariant.variant_id, {
        stock: Number(newStock),
        stock_quantity: Number(newStock),
        reason: updateReason,
        notes: updateNotes
      });

      if (res.data?.success) {
        showSuccess('Stock quantity updated successfully');
        setStockModalOpen(false);
        fetchInventory();
        fetchSummary();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-inventory-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory Management</h1>
          <p className="admin-page-subtitle">Monitor stock levels, manage variant inventory, and handle low stock warnings.</p>
        </div>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => { fetchSummary(); fetchInventory(); }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="admin-metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Total Products / Variants</span>
            <div className="admin-metric-icon-box" style={{ background: '#f5efe6', color: 'var(--color-primary)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div className="admin-metric-value">
            {summaryLoading ? '...' : (summary?.total_variants ?? summary?.total_items ?? items.length)}
          </div>
          <div className="admin-metric-subtext">Active catalog SKUs</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">In Stock</span>
            <div className="admin-metric-icon-box" style={{ background: '#ecfdf5', color: 'var(--color-success)' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="admin-metric-value">
            {summaryLoading ? '...' : (summary?.in_stock ?? summary?.available_items ?? 0)}
          </div>
          <div className="admin-metric-subtext">Healthy stock levels</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Low Stock Alert</span>
            <div className="admin-metric-icon-box" style={{ background: '#fffbeb', color: 'var(--color-warning)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: 'var(--color-warning)' }}>
            {summaryLoading ? '...' : (summary?.low_stock ?? summary?.low_stock_count ?? 0)}
          </div>
          <div className="admin-metric-subtext">Requires replenishment</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Out of Stock</span>
            <div className="admin-metric-icon-box" style={{ background: '#fef2f2', color: 'var(--color-error)' }}>
              <XCircle size={20} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: 'var(--color-error)' }}>
            {summaryLoading ? '...' : (summary?.out_of_stock ?? summary?.out_of_stock_count ?? 0)}
          </div>
          <div className="admin-metric-subtext">Currently unavailable to customers</div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveTab('all'); setPage(1); }}
            >
              <Package size={15} /> All Inventory
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'low-stock' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveTab('low-stock'); setPage(1); }}
              style={activeTab === 'low-stock' ? {} : { color: 'var(--color-warning)' }}
            >
              <AlertTriangle size={15} /> Low Stock Watchlist
            </button>
          </div>

          {activeTab === 'all' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Search product or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input"
                  style={{ minWidth: '220px', padding: '6px 12px', fontSize: '13px' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  <Search size={14} />
                </button>
              </form>

              <select
                value={stockStatus}
                onChange={(e) => { setStockStatus(e.target.value); setPage(1); }}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '13px', minWidth: '150px' }}
              >
                <option value="">All Stock Statuses</option>
                <option value="IN_STOCK">In Stock (&gt; 5)</option>
                <option value="LOW_STOCK">Low Stock (1 - 5)</option>
                <option value="OUT_OF_STOCK">Out of Stock (0)</option>
              </select>
            </div>
          )}
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div style={{ padding: '60px' }}>
            <Loader text="Loading inventory records..." />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No inventory records found"
            description="All product variants have healthy stock or no items match your active filter."
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Variant / SKU</th>
                  <th>Material / Color</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const stock = item.stock_quantity ?? item.stock ?? 0;
                  const isLow = stock > 0 && stock <= 5;
                  const isOut = stock <= 0;
                  const productName = item.product_name || item.Product?.name || 'Product';
                  const sku = item.sku || item.variant_sku || `VAR-${item.id}`;
                  const image = item.image_url || item.Product?.main_image || item.main_image;

                  return (
                    <tr key={item.id || item.variant_id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={getImageUrl(image)}
                            alt={productName}
                            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                            onError={(e) => { e.target.src = '/placeholder-furniture.jpg'; }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                              {productName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              ID: #{item.product_id || item.Product?.id || item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', background: 'var(--color-bg-alt)', padding: '2px 6px', borderRadius: '4px' }}>
                          {sku}
                        </span>
                        {item.variant_name && (
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {item.variant_name}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>
                          {item.wood_type || item.material || item.finish || 'Solid Wood'}
                          {item.color ? ` • ${item.color}` : ''}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                          {formatCurrency(item.price || item.variant_price || 0)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '15px', 
                            fontWeight: '700',
                            color: isOut ? 'var(--color-error)' : isLow ? 'var(--color-warning)' : 'var(--color-success)'
                          }}>
                            {stock}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>units</span>
                        </div>
                      </td>
                      <td>
                        {isOut ? (
                          <span className="badge badge-error">Out of Stock</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">Low Stock</span>
                        ) : (
                          <span className="badge badge-success">In Stock</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openStockModal(item)}
                          title="Update stock quantity"
                          style={{ padding: '6px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit3 size={13} /> Update Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Stock Edit Modal */}
      {stockModalOpen && selectedVariant && (
        <Modal
          isOpen={stockModalOpen}
          onClose={() => setStockModalOpen(false)}
          title={`Update Stock: ${selectedVariant.product_name || selectedVariant.Product?.name || 'Variant'}`}
        >
          <form onSubmit={handleUpdateStock}>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--color-bg-alt)', borderRadius: '8px', fontSize: '13px' }}>
              <div><strong>SKU:</strong> {selectedVariant.sku || `VAR-${selectedVariant.id}`}</div>
              <div><strong>Current Available Units:</strong> {selectedVariant.stock_quantity ?? selectedVariant.stock ?? 0} units</div>
            </div>

            <InputField
              label="New Stock Quantity"
              type="number"
              min="0"
              required
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="e.g. 25"
            />

            <SelectField
              label="Reason for Update"
              value={updateReason}
              onChange={(e) => setUpdateReason(e.target.value)}
              options={[
                { value: 'RESTOCK', label: 'Supplier Shipment / Restock' },
                { value: 'AUDIT_CORRECTION', label: 'Warehouse Physical Audit Correction' },
                { value: 'DAMAGED', label: 'Damaged in Transit / Discarded' },
                { value: 'RETURN_RESTOCK', label: 'Customer Return Inspected & Restocked' },
                { value: 'MANUAL_OVERRIDE', label: 'Manual Adjustment' }
              ]}
            />

            <TextAreaField
              label="Internal Warehouse Notes (Optional)"
              rows={3}
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              placeholder="e.g. Batch #402 received from Jodhpur timber workshop"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStockModalOpen(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Stock Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminInventoryPage;
