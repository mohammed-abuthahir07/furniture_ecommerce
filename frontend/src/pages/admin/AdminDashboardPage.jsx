import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminMetricCard from '../../components/admin/AdminMetricCard';
import StatusBadge from '../../components/common/StatusBadge';
import { SimpleDonutChart } from '../../components/admin/SimpleChart';
import { ErrorState } from '../../components/common/ErrorState';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [statusCounts, setStatusCounts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockVariants, setLowStockVariants] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        sumRes,
        revenueRes,
        todayRes,
        statusRes,
        ordersRes,
        stockRes,
        sellersRes,
      ] = await Promise.allSettled([
        adminApi.getDashboardSummary(),
        adminApi.getRevenueSummary(),
        adminApi.getTodayMetrics(),
        adminApi.getOrderStatusCounts(),
        adminApi.getRecentOrders(),
        adminApi.getLowStockVariants(),
        adminApi.getBestSellingProducts(),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value.success) {
        const summaryData = sumRes.value.summary || sumRes.value.data || {};
        const revenue = revenueRes.status === 'fulfilled' && revenueRes.value.success
          ? (revenueRes.value.revenue || {})
          : {};
        setSummary({
          ...summaryData,
          total_revenue: revenue.total_revenue || 0,
          total_products: Number(summaryData.active_products || 0) + Number(summaryData.inactive_products || 0),
          total_categories: summaryData.active_categories || 0,
          total_customers: Number(summaryData.total_customers || 0),
        });
      }
      if (todayRes.status === 'fulfilled' && todayRes.value.success) {
        setTodayData(todayRes.value.today || todayRes.value.data || null);
      }
      if (statusRes.status === 'fulfilled' && statusRes.value.success) {
        const rows = statusRes.value.order_status || statusRes.value.data || [];
        setStatusCounts(rows.map((row) => ({
          status: row.order_status || row.status,
          count: row.total_orders ?? row.count ?? 0,
        })));
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.success) {
        setRecentOrders(ordersRes.value.orders || ordersRes.value.data || []);
      }
      if (stockRes.status === 'fulfilled' && stockRes.value.success) {
        setLowStockVariants(stockRes.value.variants || stockRes.value.data || []);
      }
      if (sellersRes.status === 'fulfilled' && sellersRes.value.success) {
        const sellers = sellersRes.value.products || sellersRes.value.data || [];
        setBestSellers(sellers.map((item) => ({
          ...item,
          total_sold: item.total_quantity_sold ?? item.total_sold ?? item.units_sold,
          total_revenue: item.total_sales ?? item.total_revenue,
        })));
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="admin-metrics-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton" style={{ height: 96, borderRadius: 8 }} />
          ))}
        </div>
        <div className="admin-split-grid" style={{ marginTop: '1rem' }}>
          <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  // Map order status counts to donut chart segments
  const orderStatusColors = {
    PENDING: '#f59e0b',
    CONFIRMED: '#3b82f6',
    PROCESSING: '#6366f1',
    SHIPPED: '#8b5cf6',
    OUT_FOR_DELIVERY: '#a855f7',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
  };

  const donutSegments = statusCounts.map((s) => ({
    label: s.status || s.order_status,
    value: Number(s.count || s.total || 0),
    color: orderStatusColors[s.status || s.order_status] || '#94a3b8',
  }));

  return (
    <div>
      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <AdminMetricCard
          title="Total Lifetime Revenue"
          value={formatCurrency(summary?.total_revenue || 0)}
          subtitle={`Today: ${formatCurrency(todayData?.today_revenue || 0)}`}
          icon={DollarSign}
          variant="primary"
        />

        <AdminMetricCard
          title="Total Orders"
          value={summary?.total_orders || 0}
          subtitle={`Today: ${todayData?.today_orders || 0} new orders`}
          icon={ShoppingCart}
          variant="success"
        />

        <AdminMetricCard
          title="Active Products"
          value={summary?.total_products || 0}
          subtitle={`${summary?.total_categories || 0} Categories`}
          icon={Package}
          variant="warning"
        />

        <AdminMetricCard
          title="Registered Customers"
          value={summary?.total_customers || 0}
          subtitle="Active shoppers"
          icon={Users}
          variant="danger"
        />
      </div>

      {/* Grid: Order Status Breakdown & Low Stock Alert */}
      <div className="admin-split-grid">
        {/* Order Status Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Order Status Breakdown</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              Manage Orders →
            </Link>
          </div>

          <SimpleDonutChart segments={donutSegments} size={150} />
        </div>

        {/* Low Stock Alerts */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#b45309' }}>
              <AlertTriangle size={18} />
              <span>Low Stock Alerts</span>
            </h3>
            <Link to="/admin/inventory" style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              Inventory →
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>All variants currently have sufficient stock levels.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {lowStockVariants.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: '#fffbeb',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{v.product_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Variant: {v.variant_name}</div>
                  </div>
                  <span className="badge badge-warning">{v.stock_quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Recent Orders & Best Sellers */}
      <div className="admin-split-grid admin-split-wide">
        {/* Recent Orders Table */}
        <div className="admin-table-card" style={{ marginBottom: 0 }}>
          <div className="admin-table-toolbar">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              View All Orders
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link to={`/admin/orders/${o.id}`} style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                          {o.order_number}
                        </Link>
                      </td>
                      <td>{o.customer_name || 'Customer'}</td>
                      <td>{formatDate(o.created_at)}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(o.total_amount)}</td>
                      <td>
                        <StatusBadge status={o.order_status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="admin-table-card" style={{ marginBottom: 0 }}>
          <div className="admin-table-toolbar">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Top Selling Furniture</h3>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {bestSellers.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Sales records will populate here.</p>
            ) : (
              bestSellers.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.65rem',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                        {item.product_name || item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {item.total_sold || item.units_sold || 0} units sold
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-700)' }}>
                    {formatCurrency(item.total_revenue || 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
