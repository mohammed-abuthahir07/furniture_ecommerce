import { NavLink } from 'react-router-dom';
import {
  Armchair,
  LayoutDashboard,
  Layers,
  Package,
  Percent,
  ShoppingCart,
  Users,
  Boxes,
  TrendingUp,
  FileText,
  Bell,
  SlidersHorizontal,
  FileQuestion,
  Settings,
  X,
} from 'lucide-react';

export function AdminSidebar({ isOpen, onClose }) {
  const navGroups = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Catalog & Store',
      items: [
        { label: 'Categories', to: '/admin/categories', icon: Layers },
        { label: 'Products', to: '/admin/products', icon: Package },
        { label: 'Offers & Discounts', to: '/admin/offers', icon: Percent },
        { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
      ],
    },
    {
      title: 'Sales & Customers',
      items: [
        { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
        { label: 'Customers', to: '/admin/customers', icon: Users },
        { label: 'Customization Requests', to: '/admin/customization-requests', icon: SlidersHorizontal },
        { label: 'Custom Requirements', to: '/admin/custom-requirements', icon: FileQuestion },
      ],
    },
    {
      title: 'Insights & Ops',
      items: [
        { label: 'Analytics', to: '/admin/analytics', icon: TrendingUp },
        { label: 'Reports', to: '/admin/reports', icon: FileText },
        { label: 'Notifications', to: '/admin/notifications', icon: Bell },
        { label: 'Settings & Profile', to: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-brand">
        <Armchair size={24} />
        <span>WoodCraft Admin</span>
        <button
          type="button"
          className="modal-close-btn"
          style={{ marginLeft: 'auto', color: '#fff', display: isOpen ? 'block' : 'none' }}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="admin-nav-menu">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '0.75rem' }}>
            <div className="admin-nav-group-title">{group.title}</div>
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={iIdx}
                  to={item.to}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default AdminSidebar;
