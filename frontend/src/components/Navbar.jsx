import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Navbar.css';

function Navbar() {
  const { user, cartCount, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">ShopZone</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="nav-link btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
