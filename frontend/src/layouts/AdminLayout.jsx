import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import { useScrollToTop } from '../hooks/useScrollToTop';

export function AdminLayout() {
  useScrollToTop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper to determine page title from pathname
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return 'Store Overview & Dashboard';
    if (p.includes('/categories')) return 'Category Management';
    if (p.includes('/products')) return 'Furniture Product Catalog';
    if (p.includes('/offers')) return 'Offers & Promotions';
    if (p.includes('/inventory')) return 'Inventory & Stock Control';
    if (p.includes('/orders')) return 'Customer Order Management';
    if (p.includes('/customers')) return 'Customer Directory';
    if (p.includes('/customization-requests')) return 'Customization Workflows';
    if (p.includes('/custom-requirements')) return 'Public Custom Requirements';
    if (p.includes('/analytics')) return 'Business Analytics & Insights';
    if (p.includes('/reports')) return 'Sales & Financial Reports';
    if (p.includes('/notifications')) return 'Admin Notifications Inbox';
    if (p.includes('/settings')) return 'Store Settings & Admin Profile';
    return 'Admin Portal';
  };

  return (
    <div className="admin-wrapper">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Admin Area */}
      <div className="admin-main-container">
        <AdminTopbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          pageTitle={getPageTitle()}
        />

        <main className="admin-content-view">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
