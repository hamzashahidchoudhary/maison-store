import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page" style={styles.page}>
      <div style={styles.content}>
        <div style={styles.number}>404</div>
        <h1 style={styles.title}>Page not found</h1>
        <p style={styles.desc}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={styles.actions}>
          <Link to="/" className="btn btn-dark">Go Home</Link>
          <Link to="/shop" className="btn btn-outline">Browse Shop</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 140px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  content: { maxWidth: '480px' },
  number: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(5rem, 15vw, 8rem)',
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: 1,
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  desc: {
    color: 'var(--muted)',
    fontSize: '15px',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}
