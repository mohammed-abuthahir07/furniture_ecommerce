import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Layers, 
  CreditCard 
} from 'lucide-react';

const AdminReportsPage = () => {
  const { error: showError } = useToast();
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [page, setPage] = useState(1);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = {
        from: startDate,
        to: endDate,
      };

      let res;
      switch (reportType) {
        case 'sales':
          res = await adminApi.getSalesReport(params);
          break;
        case 'orders':
          res = await adminApi.getOrdersReport(params);
          break;
        case 'products':
          res = await adminApi.getProductsReport(params);
          break;
        case 'customers':
          res = await adminApi.getCustomersReport(params);
          break;
        case 'inventory':
          res = await adminApi.getInventoryReport(params);
          break;
        case 'payments':
          res = await adminApi.getPaymentsReport(params);
          break;
        case 'categories':
          res = await adminApi.getCategoriesReport(params);
          break;
        default:
          res = await adminApi.getSalesReport(params);
      }

      if (res.success) {
        setReportData(res.report || []);
      } else {
        setReportData(null);
      }
    } catch (err) {
      showError(err.message || 'Failed to generate report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReport();
  };

  const handlePrint = () => {
    window.print();
  };

  const reportItems = reportData?.items || reportData?.rows || reportData?.data || (Array.isArray(reportData) ? reportData : []);
  const summary = reportData?.summary || reportData?.totals || {};

  return (
    <div className="admin-reports-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Reports & Audits</h1>
          <p className="admin-page-subtitle">Generate tabular accounting and operational reports with customizable date ranges.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={15} /> Print Report
          </button>
        </div>
      </div>

      {/* Report Filter Controls */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', padding: '16px' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label className="form-label" style={{ fontSize: '13px' }}>Report Category</label>
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); setPage(1); }}
              className="form-select"
            >
              <option value="sales">Sales & Revenue Report</option>
              <option value="orders">Orders & Fulfillment Audit</option>
              <option value="products">Product Performance & Stock</option>
              <option value="customers">Customer Acquisition & Spends</option>
              <option value="inventory">Inventory Valuation & Low Stock</option>
              <option value="payments">Payment Gateway & Methods</option>
              <option value="categories">Category Distribution Report</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '13px' }}>From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ flex: '1', minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '13px' }}>To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
              <Filter size={15} /> Generate Report
            </button>
          </div>
        </form>
      </div>

      {/* Summary Stat Cards if available */}
      {summary && Object.keys(summary).length > 0 && (
        <div className="admin-metrics-grid" style={{ marginBottom: '24px' }}>
          {Object.entries(summary).map(([key, val], idx) => {
            const formattedLabel = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const isMoney = key.toLowerCase().includes('revenue') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('total') || key.toLowerCase().includes('sales');
            return (
              <div key={idx} className="admin-metric-card">
                <div className="admin-metric-title">{formattedLabel}</div>
                <div className="admin-metric-value" style={{ fontSize: '22px', marginTop: '8px' }}>
                  {typeof val === 'number' ? (isMoney ? formatCurrency(val) : formatNumber(val)) : String(val)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Data Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <Loader text="Generating structured tabular report..." />
          </div>
        ) : reportItems.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No records found in selected timeframe"
            description="Adjust the start and end dates or choose another report category to query."
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                {reportType === 'sales' && (
                  <tr>
                    <th>Date / Period</th>
                    <th>Orders Count</th>
                    <th>Gross Items Sold</th>
                    <th>Discounts Applied</th>
                    <th>Net Revenue</th>
                  </tr>
                )}
                {reportType === 'orders' && (
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Order Total</th>
                  </tr>
                )}
                {reportType === 'products' && (
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Units Sold</th>
                    <th>Stock Remaining</th>
                    <th>Total Revenue</th>
                  </tr>
                )}
                {reportType === 'customers' && (
                  <tr>
                    <th>Customer Name</th>
                    <th>Email / Phone</th>
                    <th>Join Date</th>
                    <th>Total Orders</th>
                    <th>Lifetime Value</th>
                  </tr>
                )}
                {reportType === 'inventory' && (
                  <tr>
                    <th>Product / Variant</th>
                    <th>SKU</th>
                    <th>Unit Price</th>
                    <th>Stock Units</th>
                    <th>Total Valuation</th>
                    <th>Stock Status</th>
                  </tr>
                )}
                {reportType === 'payments' && (
                  <tr>
                    <th>Transaction / Order #</th>
                    <th>Gateway / Method</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                )}
                {reportType === 'categories' && (
                  <tr>
                    <th>Category Name</th>
                    <th>Active Products</th>
                    <th>Total Orders</th>
                    <th>Gross Category Sales</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {reportItems.map((row, idx) => {
                  return (
                    <tr key={row.id || idx}>
                      {reportType === 'sales' && (
                        <>
                          <td style={{ fontWeight: '600' }}>{row.order_date || row.date || formatDate(row.created_at) || `Row ${idx + 1}`}</td>
                          <td>{row.order_number || row.order_count || row.orders || 0}</td>
                          <td>{row.product_name || row.items_sold || row.units || row.quantity || 0}</td>
                          <td style={{ color: 'var(--color-error)' }}>{formatCurrency(row.discount_amount || row.discounts || 0)}</td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                            {formatCurrency(row.item_subtotal || row.total_amount || row.total_revenue || row.revenue || 0)}
                          </td>
                        </>
                      )}

                      {reportType === 'orders' && (
                        <>
                          <td><span style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{row.order_number || row.id}</span></td>
                          <td>{row.customer_name || row.User?.name || 'Customer'}</td>
                          <td>{formatDate(row.created_at || row.order_date)}</td>
                          <td><span className="badge badge-secondary">{row.payment_method || 'COD'}</span></td>
                          <td><span className="badge badge-primary">{row.order_status || row.status}</span></td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{formatCurrency(row.total_amount || 0)}</td>
                        </>
                      )}

                      {reportType === 'products' && (
                        <>
                          <td style={{ fontWeight: '600' }}>{row.name || row.product_name}</td>
                          <td><span style={{ fontFamily: 'monospace' }}>{row.sku || `PROD-${row.id}`}</span></td>
                          <td>{row.category_name || row.Category?.name || 'Furniture'}</td>
                          <td>{row.total_quantity_sold || row.units_sold || row.total_sold || 0} units</td>
                          <td>{row.total_orders ?? row.stock_quantity ?? row.stock ?? 0}</td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{formatCurrency(row.total_sales || row.total_revenue || row.revenue || 0)}</td>
                        </>
                      )}

                      {reportType === 'customers' && (
                        <>
                          <td style={{ fontWeight: '600' }}>{row.customer_name || row.name || `${row.first_name || ''} ${row.last_name || ''}`}</td>
                          <td>{row.customer_email || row.email} {(row.customer_phone || row.phone) ? `(${row.customer_phone || row.phone})` : ''}</td>
                          <td>{formatDate(row.last_order_date || row.created_at || row.join_date)}</td>
                          <td>{row.total_orders || row.orders_count || 0}</td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{formatCurrency(row.total_amount_spent || row.lifetime_spend || row.total_spent || 0)}</td>
                        </>
                      )}

                      {reportType === 'inventory' && (
                        <>
                          <td style={{ fontWeight: '600' }}>{row.product_name || row.name}{row.variant_name ? ` · ${row.variant_name}` : ''}</td>
                          <td><span style={{ fontFamily: 'monospace' }}>{row.variant_name || row.sku || `VAR-${row.variant_id || row.id}`}</span></td>
                          <td>{formatCurrency(row.price || 0)}</td>
                          <td><strong>{row.stock_quantity ?? row.stock ?? 0}</strong></td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                            {formatCurrency((row.stock_quantity ?? row.stock ?? 0) * (row.price || 0))}
                          </td>
                          <td>
                            {(row.stock_quantity ?? row.stock ?? 0) <= 0 ? (
                              <span className="badge badge-error">Out of Stock</span>
                            ) : (row.stock_quantity ?? row.stock ?? 0) <= 5 ? (
                              <span className="badge badge-warning">Low Stock</span>
                            ) : (
                              <span className="badge badge-success">Good</span>
                            )}
                          </td>
                        </>
                      )}

                      {reportType === 'payments' && (
                        <>
                          <td><span style={{ fontFamily: 'monospace' }}>#{row.transaction_id || row.order_number || row.id}</span></td>
                          <td><span className="badge badge-secondary">{row.payment_method || 'RAZORPAY'}</span></td>
                          <td><span className="badge badge-success">{row.payment_status || 'PAID'}</span></td>
                          <td>{formatDate(row.created_at || row.payment_date)}</td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{formatCurrency(row.amount || row.total_amount || 0)}</td>
                        </>
                      )}

                      {reportType === 'categories' && (
                        <>
                          <td style={{ fontWeight: '600' }}>{row.name || row.category_name}</td>
                          <td>{row.product_count || row.products || 0} items</td>
                          <td>{row.order_count || row.orders || 0}</td>
                          <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{formatCurrency(row.total_revenue || row.revenue || 0)}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
