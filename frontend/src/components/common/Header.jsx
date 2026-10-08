import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Armchair,
  Search,
  Heart,
  ShoppingBag,
  User,
  Bell,
  Menu,
  X,
  Percent,
  Layers,
  Sparkles,
  LogOut,
  Package,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import publicApi from '../../services/publicApi';
import customerApi from '../../services/customerApi';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, isCustomerAuthenticated, customerLogout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [categories, setCategories] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchWrapRef = useRef(null);

  // Fetch active categories for sub-navigation
  useEffect(() => {
    publicApi.getCategories().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }).catch(() => {});
  }, []);

  // Fetch unread notifications count if customer is logged in
  useEffect(() => {
    if (isCustomerAuthenticated) {
      customerApi.getUnreadCount().then((res) => {
        const count = res.data?.unread_count ?? res.unread_count;
        if (res.success && count !== undefined) {
          setUnreadNotificationsCount(count);
        }
      }).catch(() => {});
    } else {
      setUnreadNotificationsCount(0);
    }
  }, [isCustomerAuthenticated, location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle outside click for user dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 1) {
      setSuggestions([]);
      setSuggestOpen(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await publicApi.filterProducts({ search: query, limit: 6 });
        const apiItems = res.success && Array.isArray(res.data) ? res.data : [];
        setSuggestions(apiItems);
        setSuggestOpen(true);
      } catch {
        setSuggestions([]);
        setSuggestOpen(true);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.header-search') || event.target.closest('.mobile-search-wrap')) return;
      setSuggestOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSuggestOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const openSuggestion = (item) => {
    setSuggestOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery(item.name || '');
    navigate(`/products/${item.id}`);
  };

  const suggestionList = suggestOpen && searchQuery.trim() && (
    <div className="search-suggest" role="listbox" aria-label="Furniture search results">
      {suggestions.length === 0 ? (
        <p className="search-suggest-empty">No furniture matches that search.</p>
      ) : (
        suggestions.map((item) => (
          <button
            key={item.id}
            type="button"
            className="search-suggest-item"
            onClick={() => openSuggestion(item)}
          >
            <img
              src={getImageUrl(item.main_image)}
              alt=""
              onError={handleImageError}
            />
            <span>
              <strong>{item.name}</strong>
              <small>
                {[item.category_name, item.wood_type].filter(Boolean).join(' · ')}
              </small>
            </span>
            <em>₹{Number(item.selling_price || 0).toLocaleString('en-IN')}</em>
          </button>
        ))
      )}
      <button type="submit" className="search-suggest-all">
        See all results for “{searchQuery.trim()}”
      </button>
    </div>
  );

  return (
    <>
      {/* Top promotional banner */}
      <div className="topbar-banner">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✨ Handcrafted Solid Wood Furniture • Express White Glove Delivery</span>
          <div className="banner-links">
            <Link to="/offers" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Percent size={13} /> Offers & Discounts
            </Link>
            <Link to="/custom-requirement" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={13} /> Custom Design Request
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-inner">
            {/* Mobile hamburger button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
            >
              <Menu size={24} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="brand-logo">
              <Armchair size={28} />
              <div>
                <span>WOODCRAFT</span>
                <div className="brand-tagline">Living & Interiors</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav" aria-label="Main navigation">
              <Link
                to="/"
                className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className={`header-nav-link ${location.pathname.startsWith('/categories') ? 'active' : ''}`}
              >
                Categories
              </Link>
              <Link
                to="/products"
                className={`header-nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                All Furniture
              </Link>
              <Link
                to="/offers"
                className={`header-nav-link ${location.pathname === '/offers' ? 'active' : ''}`}
              >
                Offers
              </Link>
              <Link
                to="/compare"
                className={`header-nav-link ${location.pathname === '/compare' ? 'active' : ''}`}
              >
                Compare
              </Link>
              <Link
                to="/custom-requirement"
                className={`header-nav-link ${location.pathname === '/custom-requirement' ? 'active' : ''}`}
              >
                Custom Order
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="header-search" ref={searchWrapRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search sofas, beds, dining tables..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setSuggestOpen(true);
                  }}
                  aria-label="Search products"
                  aria-autocomplete="list"
                />
                {suggestionList}
              </form>
            </div>

            {/* Header Right Actions */}
            <div className="header-actions">
              {/* Wishlist */}
              <Link to="/account/wishlist" className="action-icon-btn" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="action-icon-btn" aria-label="Cart">
                <ShoppingBag size={20} />
                {totalItems > 0 && <span className="action-badge">{totalItems}</span>}
              </Link>

              {/* Notifications if logged in */}
              {isCustomerAuthenticated && (
                <Link to="/account/notifications" className="action-icon-btn" aria-label="Notifications">
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="action-badge" style={{ background: 'var(--danger-500)' }}>
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Account / Auth */}
              {isCustomerAuthenticated ? (
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.85rem' }}
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    aria-expanded={isUserMenuOpen}
                  >
                    <User size={16} />
                    <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {customer?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>{customer?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>{customer?.email}</div>
                      </div>
                      <Link to="/account" className="user-dropdown-item">
                        <User size={16} /> My Account
                      </Link>
                      <Link to="/account/orders" className="user-dropdown-item">
                        <Package size={16} /> My Orders
                      </Link>
                      <Link to="/account/customization-requests" className="user-dropdown-item">
                        <SlidersHorizontal size={16} /> Customization Requests
                      </Link>
                      <Link to="/account/profile" className="user-dropdown-item">
                        <User size={16} /> Profile Settings
                      </Link>
                      <div style={{ height: 1, background: 'var(--neutral-100)', margin: '4px 0' }} />
                      <button
                        type="button"
                        className="user-dropdown-item"
                        style={{ color: 'var(--danger-500)' }}
                        onClick={customerLogout}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">
                  <User size={16} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Categories Sub-Nav */}
        {categories.length > 0 && (
          <div className="sub-nav-bar">
            <div className="container sub-nav-inner">
              <Link to="/products" className="sub-nav-link">
                <Layers size={14} /> All Categories
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}`}
                  className="sub-nav-link"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
                <Armchair size={24} />
                <span>WOODCRAFT</span>
              </Link>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} className="mobile-search-wrap" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--neutral-400)' }} />
                <input
                  type="text"
                  placeholder="Search sofas, beds, dining tables..."
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', fontSize: '0.9rem' }}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSuggestOpen(true);
                  }}
                  aria-label="Search products"
                />
              </div>
              {suggestionList}
            </form>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              <Link to="/" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                Home
              </Link>
              <Link to="/categories" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                All Categories
              </Link>
              <Link to="/products" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                All Products
              </Link>
              <Link to="/offers" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                Offers & Deals
              </Link>
              <Link to="/cart" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                Cart{totalItems > 0 ? ` (${totalItems})` : ''}
              </Link>
              <Link to="/wishlist" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
              </Link>
              <Link to="/compare" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                Compare Furniture
              </Link>
              <Link to="/custom-requirement" className="header-nav-link" style={{ fontSize: '1rem', padding: '0.5rem 0' }}>
                Custom Furniture Order
              </Link>
            </nav>

            <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: '1.5rem', marginTop: 'auto' }}>
              {isCustomerAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Signed in as {customer?.name}</div>
                  <Link to="/account" className="btn btn-secondary btn-sm btn-block">
                    My Account
                  </Link>
                  <button type="button" className="btn btn-outline btn-sm btn-block" onClick={customerLogout}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-primary btn-sm btn-block">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-secondary btn-sm btn-block">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
