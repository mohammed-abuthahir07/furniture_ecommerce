import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { SimpleLineChart, SimpleBarChart, SimpleDonutChart } from '../../components/admin/SimpleChart';
import Loader from '../../components/common/Loader';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Calendar,
  BarChart3,
  PieChart,
  Award
} from 'lucide-react';

const AdminAnalyticsPage = () => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90
  const [stats, setStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes, topRes, catRes, statusRes] = await Promise.allSettled([
        adminApi.getDashboardStats(),
        adminApi.getDashboardSalesChart(Number(timeRange)),
        adminApi.getDashboardTopProducts(8),
        adminApi.getDashboardCategorySales(),
        adminApi.getDashboardOrdersByStatus()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }
      if (chartRes.status === 'fulfilled' && chartRes.value.data?.success) {
        setSalesChart(chartRes.value.data.data || []);
      }
      if (topRes.status === 'fulfilled' && topRes.value.data?.success) {
        setTopProducts(topRes.value.data.data || []);
      }
      if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
        setCategorySales(catRes.value.data.data || []);
      }
      if (statusRes.status === 'fulfilled' && statusRes.value.data?.success) {
        setOrdersByStatus(statusRes.value.data.data || []);
      }
    } catch (err) {
      showError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Format sales chart data for SimpleLineChart / SimpleBarChart
  const formattedSalesData = Array.isArray(salesChart) ? salesChart.map(item => ({
    label: item.date ? item.date.substring(5) : (item.label || ''),
    value: Number(item.revenue || item.sales || item.total || 0)
  })) : [];

  // Format order status donut data
  const statusColors = {
    DELIVERED: '#10b981',
    PROCESSING: '#3b82f6',
    CONFIRMED: '#6366f1',
    PENDING: '#f59e0b',
    CANCELLED: '#ef4444',
    SHIPPED: '#8b5cf6',
    OUT_FOR_DELIVERY: '#06b6d4'
  };

  const formattedStatusData = Array.isArray(ordersByStatus) ? ordersByStatus.map(item => ({
    label: (item.status || item.name || 'OTHER').replace(/_/g, ' '),
    value: Number(item.count || item.total || 0),
    color: statusColors[item.status] || '#94a3b8'
  })) : [];

  // Format Category Sales Bar Data
  const formattedCatData = Array.isArray(categorySales) ? categorySales.map(item => ({
    label: item.category_name || item.name || 'General',
    value: Number(item.revenue || item.total_sales || item.count || 0)
  })) : [];

  return (
    <div className="admin-analytics-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store Analytics & Insights</h1>
          <p className="admin-page-subtitle">Deep dive into sales trends, customer order distributions, and category performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> Timeframe:
          </span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '80px 0' }}>
          <Loader text="Aggregating store metrics and trend models..." />
        </div>
      ) : (
        <>
          {/* Key KPI Highlights */}
          <div className="admin-metrics-grid" style={{ marginBottom: '24px' }}>
            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-title">Gross Revenue</span>
                <div className="admin-metric-icon-box" style={{ background: '#f5efe6', color: 'var(--color-primary)' }}>
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="admin-metric-value">
                {formatCurrency(stats?.total_revenue || stats?.revenue || 0)}
              </div>
              <div className="admin-metric-subtext">Lifetime gross volume</div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-title">Total Orders</span>
                <div className="admin-metric-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div className="admin-metric-value">
                {formatNumber(stats?.total_orders || stats?.orders_count || 0)}
              </div>
              <div className="admin-metric-subtext">Processed transactions</div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-title">Customer Base</span>
                <div className="admin-metric-icon-box" style={{ background: '#f0fdf4', color: '#10b981' }}>
                  <Users size={20} />
                </div>
              </div>
              <div className="admin-metric-value">
                {formatNumber(stats?.total_customers || stats?.customers_count || 0)}
              </div>
              <div className="admin-metric-subtext">Registered customer accounts</div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-title">Average Order Value</span>
                <div className="admin-metric-icon-box" style={{ background: '#faf5ff', color: '#a855f7' }}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="admin-metric-value">
                {formatCurrency(
                  stats?.total_orders && stats?.total_revenue
                    ? stats.total_revenue / stats.total_orders
                    : 0
                )}
              </div>
              <div className="admin-metric-subtext">Per completed transaction</div>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="admin-card" style={{ marginBottom: '24px' }}>
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="admin-card-title">Revenue Trajectory ({timeRange} Days)</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                  Daily sales velocity and customer checkout volume.
                </p>
              </div>
              <span className="badge badge-primary">Daily Trend</span>
            </div>
            <div style={{ padding: '20px' }}>
              {formattedSalesData.length > 0 ? (
                <SimpleLineChart data={formattedSalesData} height={260} />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  No revenue data recorded for this timeframe.
                </div>
              )}
            </div>
          </div>

          {/* 2-Column Analytics: Order Status Breakdown & Category Revenue */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Status Breakdown */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Orders Fulfillment Status</h3>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {formattedStatusData.length > 0 ? (
                  <>
                    <SimpleDonutChart data={formattedStatusData} size={200} strokeWidth={24} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
                      {formattedStatusData.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                          <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{item.label}:</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No order status statistics available.
                  </div>
                )}
              </div>
            </div>

            {/* Category Performance */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Category Revenue Distribution</h3>
              </div>
              <div style={{ padding: '20px' }}>
                {formattedCatData.length > 0 ? (
                  <SimpleBarChart data={formattedCatData} height={200} color="var(--color-primary)" />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No category sales data found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Selling Products Leaderboard */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Top Performing Furniture Products</h3>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Units Sold</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                        No product sales rankings available yet.
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((prod, index) => (
                      <tr key={prod.id || index}>
                        <td>
                          <div style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '50%', 
                            background: index === 0 ? '#fef3c7' : index === 1 ? '#f1f5f9' : index === 2 ? '#ffedd5' : 'transparent',
                            color: index === 0 ? '#b45309' : index === 1 ? '#475569' : index === 2 ? '#c2410c' : 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '13px'
                          }}>
                            {index + 1}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {prod.name || prod.product_name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            SKU: {prod.sku || `PROD-${prod.id}`}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-secondary">
                            {prod.Category?.name || prod.category_name || 'Furniture'}
                          </span>
                        </td>
                        <td>
                          <strong>{formatNumber(prod.total_sold || prod.units_sold || prod.sales_count || 0)}</strong> units
                        </td>
                        <td>
                          <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                            {formatCurrency(prod.total_revenue || prod.revenue || 0)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
