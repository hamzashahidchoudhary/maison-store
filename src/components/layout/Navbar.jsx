import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Ma<span style={{ color: 'var(--accent)' }}>is</span>on
      </Link>

      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Shop</Link></li>
        <li><Link to="/" style={styles.link}>Collections</Link></li>
        <li><Link to="/" style={styles.link}>About</Link></li>
      </ul>

      <div style={styles.right}>
        {user ? (
          <div style={styles.userArea}>
            <Link to="/orders" style={styles.link}>
              Hi, {user.name.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
          </div>
        ) : (
          <Link to="/login" style={styles.link}>Sign in</Link>
        )}

        <button style={styles.cartBtn} onClick={() => setIsOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Cart
          {totalItems > 0 && (
            <span style={styles.badge}>{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.2rem 2rem', borderBottom: '1px solid var(--border)',
    background: 'var(--cream)', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700,
    letterSpacing: '-0.02em', textDecoration: 'none', color: 'var(--dark)',
  },
  links: {
    display: 'flex', gap: '2rem', listStyle: 'none',
  },
  link: {
    fontSize: '13px', fontWeight: 500, color: 'var(--muted)',
    textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userArea: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoutBtn: {
    background: 'none', border: 'none', fontSize: '13px', color: 'var(--muted)',
    cursor: 'pointer', fontFamily: 'var(--sans)',
  },
  cartBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'var(--dark)', color: 'var(--cream)',
    border: 'none', padding: '8px 18px', borderRadius: 'var(--radius-full)',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
  },
  badge: {
    background: 'var(--accent)', color: 'var(--dark)', borderRadius: '50%',
    width: '18px', height: '18px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '10px', fontWeight: 700,
  },
}
