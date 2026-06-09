import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          font-family: var(--serif);
          font-size: 1.3rem;
          font-weight: 700;
          text-decoration: none;
          color: var(--dark);
          flex-shrink: 0;
        }
        .nav-logo span { color: var(--accent); }
        .nav-desktop-links {
          display: none;
          gap: 2rem;
          list-style: none;
        }
        .nav-link {
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .nav-link.active { color: var(--dark); }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .nav-desktop-auth {
          display: none;
          align-items: center;
          gap: 0.8rem;
        }
        .nav-logout-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: var(--muted);
          cursor: pointer;
          font-family: var(--sans);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .nav-cart-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--dark);
          color: var(--cream);
          border: none;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          flex-shrink: 0;
        }
        .nav-cart-text { display: none; }
        .nav-cart-badge {
          background: var(--accent);
          color: var(--dark);
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }
        .nav-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          padding: 4px;
          display: flex;
          align-items: center;
          color: var(--dark);
        }
        .mobile-menu {
          position: fixed;
          top: 61px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--cream);
          z-index: 99;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid var(--border);
          overflow-y: auto;
        }
        .mobile-menu-link {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--dark);
          text-decoration: none;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
          display: block;
        }
        .mobile-menu-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          color: var(--muted);
          cursor: pointer;
          font-family: var(--sans);
          padding: 1rem 0;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        @media (min-width: 640px) {
          .nav-desktop-links { display: flex !important; }
          .nav-desktop-auth { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .nav-cart-text { display: inline !important; }
        }
      `}</style>

      <nav className="nav-wrapper">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Ma<span>is</span>on
        </Link>

        <ul className="nav-desktop-links">
          <li><Link to="/shop" className={`nav-link${isActive('/shop') ? ' active' : ''}`}>Shop</Link></li>
          <li><Link to="/collections" className={`nav-link${isActive('/collections') ? ' active' : ''}`}>Collections</Link></li>
          <li><Link to="/about" className={`nav-link${isActive('/about') ? ' active' : ''}`}>About</Link></li>
        </ul>

        <div className="nav-right">
          <div className="nav-desktop-auth">
            {user ? (
              <>
                <Link to="/orders" className="nav-link">Hi, {user.name.split(' ')[0]}</Link>
                <button className="nav-logout-btn" onClick={logout}>Sign out</button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Sign in</Link>
            )}
          </div>

          <button className="nav-cart-btn" onClick={() => setIsOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="nav-cart-text">Cart</span>
            {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
          </button>

          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/shop" className="mobile-menu-link" onClick={closeMenu}>Shop</Link>
          <Link to="/collections" className="mobile-menu-link" onClick={closeMenu}>Collections</Link>
          <Link to="/about" className="mobile-menu-link" onClick={closeMenu}>About</Link>
          <div style={{ margin: '0.5rem 0' }} />
          {user ? (
            <>
              <Link to="/orders" className="mobile-menu-link" onClick={closeMenu}>My Orders</Link>
              <button className="mobile-menu-btn" onClick={() => { logout(); closeMenu() }}>Sign out</button>
            </>
          ) : (
            <Link to="/login" className="mobile-menu-link" onClick={closeMenu}>Sign in</Link>
          )}
        </div>
      )}
    </>
  )
}
