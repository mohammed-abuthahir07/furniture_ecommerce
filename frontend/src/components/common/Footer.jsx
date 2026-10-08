import { Link } from 'react-router-dom';
import { Armchair, ShieldCheck, Truck, RotateCcw, Clock, Heart, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & About */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ color: '#ffffff' }}>
              <Armchair size={28} />
              <div>
                <span>WOODCRAFT</span>
                <div className="brand-tagline" style={{ color: 'var(--primary-300)' }}>Living & Interiors</div>
              </div>
            </Link>
            <p>
              Handcrafted solid wood furniture built with precision, sustainable timber, and timeless elegance.
              Designed for modern living spaces and cherished for generations.
            </p>
            <div className="footer-trust-list">
              <div className="footer-trust-item">
                <Truck size={18} />
                <span>Express White-Glove Delivery Across India</span>
              </div>
              <div className="footer-trust-item">
                <ShieldCheck size={18} />
                <span>10-Year Structural Timber Warranty</span>
              </div>
              <div className="footer-trust-item">
                <RotateCcw size={18} />
                <span>Hassle-Free Replacement Policy</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Furniture Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?wood_type=Sheesham%20(Indian%20Rosewood)">Sheesham Living</Link></li>
              <li><Link to="/products?wood_type=Teak%20Wood">Teak Dining Sets</Link></li>
              <li><Link to="/products?wood_type=Oak%20Wood">Solid Oak Bedroom</Link></li>
              <li><Link to="/products?wood_type=Walnut%20Wood">Walnut Office & Storage</Link></li>
              <li><Link to="/categories">Browse All Categories</Link></li>
              <li><Link to="/offers">Discounted Collections</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul className="footer-links">
              <li><Link to="/account/orders">Track My Order</Link></li>
              <li><Link to="/custom-requirement">Custom Furniture Studio</Link></li>
              <li><Link to="/compare">Product Comparison Matrix</Link></li>
              <li><Link to="/account/wishlist">My Saved Furniture</Link></li>
              <li><Link to="/login">Customer Sign In</Link></li>
              <li><Link to="/admin/login">Staff & Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Studio */}
          <div className="footer-col">
            <h4>Experience Center</h4>
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--neutral-400)', fontSize: '0.875rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary-400)', flexShrink: 0, marginTop: 3 }} />
                <span>42 Artisan Boulevard, Design District, Bengaluru, Karnataka 560001</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--neutral-400)', fontSize: '0.875rem' }}>
                <Phone size={16} style={{ color: 'var(--primary-400)', flexShrink: 0 }} />
                <span>+91 (080) 4567-8900</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--neutral-400)', fontSize: '0.875rem' }}>
                <Mail size={16} style={{ color: 'var(--primary-400)', flexShrink: 0 }} />
                <span>concierge@woodcraft-furniture.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--neutral-400)', fontSize: '0.875rem' }}>
                <Clock size={16} style={{ color: 'var(--primary-400)', flexShrink: 0 }} />
                <span>Mon – Sun: 10:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} WoodCraft Furniture Studio. All rights reserved. Premium furniture e-commerce.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/shipping">Delivery & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
