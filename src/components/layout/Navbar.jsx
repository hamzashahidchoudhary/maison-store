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
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo} onClick={closeMenu}>
          Ma<span style={{ color: 'var(--accent)' }}>is</span>on
        </Link>

        {/* Desktop links */}
        <ul style={styles.links}>
          <li><Link to="/shop" style={{ ...styles.link, color: isActive('/shop') ? 'var(--dark)' : 'var(--muted)' }}>Shop</Link></li>
          <li><Link to="/collections" style={{ ...styles.link, color: isActive('/collections') ? 'var(--dark)' : 'var(--muted)' }}>Collections</Link></li>
          <li><Link to="/about" style={{ ...styles.link, color: isActive('/about') ? 'var(--dark)' : 'var(--muted)' }}>About</Link></li>
        </ul>

        <div style={styles.right}>
          {/* Desktop auth */}
          <div style={styles.desktopAuth}>
            {user ? (
              <>
                <Link to="/orders" style={styles.link}>Hi, {user.name.split(' ')[0]}</Link>
                <button onClick={logout} style={styles.logoutBtn}>Sign out</button>
              </>
            ) : (
              <Link to="/login" style={styles.link}>Sign in</Link>
            )}
          </div>

          {/* Cart button */}
          <button style={styles.cartBtn} onClick={() => setIsOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span style={styles.cartText}>Cart</span>
            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
          </button>

          {/* Hamburger */}
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ fontSize: '20px' }}>{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/shop" style={styles.mobileLink} onClick={closeMenu}>Shop</Link>
          <Link to="/collections" style={styles.mobileLink} onClick={closeMenu}>Collections</Link>
          <Link to="/about" style={styles.mobileLink} onClick={closeMenu}>About</Link>
          <div style={styles.mobileDivider} />
          {user ? (
            <>
              <Link to="/orders" style={styles.mobileLink} onClick={closeMenu}>My Orders</Link>
              <button style={styles.mobileLogout} onClick={() => { logout(); closeMenu() }}>Sign out</button>
            </>
          ) : (
            <Link to="/login" style={styles.mobileLink} onClick={closeMenu}>Sign in</Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 640px) {
          .nav-desktop-links { display: flex !important; }
          .nav-desktop-auth { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .nav-cart-text { display: inline !important; }
        }
        @media (max-width: 639px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-auth { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)',
    background: 'var(--cream)', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700,
    letterSpacing: '-0.02em', textDecoration: 'none', color: 'var(--dark)',
    flexShrink: 0,
  },
  links: {
    display: 'flex', gap: '1.5rem', listStyle: 'none',
    className: 'nav-desktop-links',
  },
  link: {
    fontSize: '12px', fontWeight: 500, color: 'var(--muted)',
    textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  right: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  desktopAuth: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  logoutBtn: {
    background: 'none', border: 'none', fontSize: '12px', color: 'var(--muted)',
    cursor: 'pointer', fontFamily: 'var(--sans)', letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  cartBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'var(--dark)', color: 'var(--cream)',
    border: 'none', padding: '8px 14px', borderRadius: 'var(--radius-full)',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer', flexShrink: 0,
  },
  cartText: { display: 'none' },
  badge: {
    background: 'var(--accent)', color: 'var(--dark)', borderRadius: '50%',
    width: '18px', height: '18px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '10px', fontWeight: 700,
  },
  hamburger: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px', display: 'flex', alignItems: 'center',
  },
  mobileMenu: {
    position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0,
    background: 'var(--cream)', zIndex: 99, padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '4px',
    borderTop: '1px solid var(--border)',
  },
  mobileLink: {
    fontSize: '1.1rem', fontWeight: 500, color: 'var(--dark)',
    textDecoration: 'none', padding: '0.9rem 0',
    borderBottom: '1px solid var(--border)',
  },
  mobileDivider: { margin: '0.5rem 0', borderTop: '1px solid var(--border)' },
  mobileLogout: {
    background: 'none', border: 'none', fontSize: '1.1rem', color: 'var(--muted)',
    cursor: 'pointer', fontFamily: 'var(--sans)', padding: '0.9rem 0', textAlign: 'left',
  },
}
