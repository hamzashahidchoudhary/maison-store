import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>

        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.logo}>Ma<span style={{ color: 'var(--accent)' }}>is</span>on</div>
          <p style={styles.tagline}>
            Thoughtfully designed homewares and accessories that bring warmth and intention to everyday moments.
          </p>
          <div style={styles.socials}>
            {['Instagram', 'Pinterest', 'Twitter'].map(s => (
              <a key={s} href="#" style={styles.social}>{s}</a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <div style={styles.colTitle}>Shop</div>
          <div style={styles.links}>
            <Link to="/shop" style={styles.link}>All Products</Link>
            <Link to="/collections" style={styles.link}>Collections</Link>
            <Link to="/shop?category=ceramics" style={styles.link}>Ceramics</Link>
            <Link to="/shop?category=textiles" style={styles.link}>Textiles</Link>
            <Link to="/shop?category=furniture" style={styles.link}>Furniture</Link>
            <Link to="/shop?category=lighting" style={styles.link}>Lighting</Link>
          </div>
        </div>

        {/* Company links */}
        <div>
          <div style={styles.colTitle}>Company</div>
          <div style={styles.links}>
            <Link to="/about" style={styles.link}>About Us</Link>
            <Link to="/about#team" style={styles.link}>Our Team</Link>
            <Link to="/about#values" style={styles.link}>Sustainability</Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            <Link to="/login" style={styles.link}>Sign In</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div style={styles.colTitle}>Stay in Touch</div>
          <p style={styles.newsletterDesc}>
            Get new arrivals and exclusive offers delivered to your inbox.
          </p>
          <div style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="your@email.com"
              style={styles.newsletterInput}
            />
            <button style={styles.newsletterBtn}>Subscribe</button>
          </div>
          <div style={styles.perks}>
            {['Free shipping over $75', 'Free 30-day returns', 'Sustainably made'].map(p => (
              <div key={p} style={styles.perk}>
                <span style={{ color: 'var(--accent)' }}>✓</span> {p}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={styles.bottom}>
        <div style={styles.bottomInner}>
          <span style={styles.copyright}>© {currentYear} Maison. All rights reserved.</span>
          <div style={styles.bottomLinks}>
            <a href="#" style={styles.bottomLink}>Privacy Policy</a>
            <a href="#" style={styles.bottomLink}>Terms of Service</a>
            <a href="#" style={styles.bottomLink}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--dark)',
    color: 'var(--cream)',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '4rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '3rem',
  },
  logo: {
    fontFamily: 'var(--serif)',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  tagline: {
    color: 'rgba(247,244,239,0.5)',
    fontSize: '13px',
    lineHeight: 1.7,
    marginBottom: '1.5rem',
    maxWidth: '260px',
  },
  socials: {
    display: 'flex',
    gap: '1rem',
  },
  social: {
    fontSize: '12px',
    color: 'rgba(247,244,239,0.5)',
    textDecoration: 'none',
    fontWeight: 500,
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
  },
  colTitle: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--accent)',
    marginBottom: '1.2rem',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '13px',
    color: 'rgba(247,244,239,0.6)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  newsletterDesc: {
    fontSize: '13px',
    color: 'rgba(247,244,239,0.5)',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  newsletterForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  newsletterInput: {
    flex: 1,
    padding: '9px 14px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid rgba(247,244,239,0.2)',
    background: 'rgba(247,244,239,0.08)',
    color: 'var(--cream)',
    fontSize: '13px',
    fontFamily: 'var(--sans)',
    outline: 'none',
  },
  newsletterBtn: {
    background: 'var(--accent)',
    color: 'var(--dark)',
    border: 'none',
    padding: '9px 16px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    whiteSpace: 'nowrap',
  },
  perks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  perk: {
    fontSize: '12px',
    color: 'rgba(247,244,239,0.5)',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  bottom: {
    borderTop: '1px solid rgba(247,244,239,0.1)',
  },
  bottomInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1.2rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    fontSize: '12px',
    color: 'rgba(247,244,239,0.35)',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  bottomLink: {
    fontSize: '12px',
    color: 'rgba(247,244,239,0.35)',
    textDecoration: 'none',
  },
}
