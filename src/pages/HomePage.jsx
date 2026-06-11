import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import { categories } from '@/lib/categories'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [addedIds, setAddedIds] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    productsAPI.getAll(activeCategory)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory])

  const handleAdd = (product) => {
    addItem(product)
    setAddedIds(prev => [...prev, product.id])
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1200)
  }

  // Hero swatches — first 3 categories
  const heroSwatches = categories.slice(0, 3)

  return (
    <div className="page">
      <style>{`
        .hero-section { border-bottom: 1px solid var(--border); }
        .hero-inner { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .hero-visual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .stats-row { display: flex; justify-content: center; gap: 3rem; padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); overflow-x: auto; }
        .products-section { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; }
        .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        @media (max-width: 639px) {
          .hero-inner { grid-template-columns: 1fr !important; padding: 2.5rem 1.2rem 2rem; gap: 1.5rem; }
          .hero-visual-grid { display: none !important; }
          .stats-row { gap: 1.5rem; padding: 1.2rem 1rem; justify-content: flex-start; }
          .products-section { padding: 2rem 1.2rem; }
          .products-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
      `}</style>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-inner">
          <div>
            <div style={styles.heroLabel}>New Collection — 2026</div>
            <h1 style={styles.heroTitle}>
              Timeless pieces,<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>crafted</em> for<br />
              modern living
            </h1>
            <p style={styles.heroDesc}>
              Thoughtfully designed homewares and accessories that bring warmth and intention to everyday moments.
            </p>
            <div style={styles.heroCta}>
              <button className="btn btn-dark" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                Shop Now
              </button>
              <Link to="/collections" className="btn btn-outline" style={{ textDecoration: 'none' }}>View Collections</Link>
            </div>
          </div>

          <div className="hero-visual-grid">
            {heroSwatches.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/collections#${cat.id}`}
                style={{
                  ...styles.swatch,
                  backgroundImage: `linear-gradient(${cat.overlayColor}, ${cat.overlayColor}), url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  gridRow: i === 0 ? 'span 2' : 'auto',
                  minHeight: i === 0 ? '240px' : '110px',
                  textDecoration: 'none',
                }}
              >
                <span style={styles.swatchLabel}>{cat.tag}</span>
                <span style={styles.swatchTitle}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-row">
        {[['4.9★', 'Avg Rating'], ['12k+', 'Happy Customers'], ['180+', 'Products'], ['Free', 'Returns']].map(([num, label]) => (
          <div key={label} style={styles.stat}>
            <div style={styles.statNum}>{num}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Products */}
      <section id="products" className="products-section">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <div className="filter-tabs">
            <button
              onClick={() => setActiveCategory('all')}
              style={{ ...styles.filterTab, background: activeCategory === 'all' ? 'var(--dark)' : 'transparent', color: activeCategory === 'all' ? 'var(--cream)' : 'var(--muted)', borderColor: activeCategory === 'all' ? 'var(--dark)' : 'var(--border)' }}
            >
              All
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ ...styles.filterTab, background: activeCategory === cat.id ? 'var(--dark)' : 'transparent', color: activeCategory === cat.id ? 'var(--cream)' : 'var(--muted)', borderColor: activeCategory === cat.id ? 'var(--dark)' : 'var(--border)' }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading products…</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛍️</div>
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => {
              const isAdded = addedIds.includes(product.id)
              return (
                <div key={product.id} style={styles.card}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ ...styles.cardImg, background: product.bg }}>
                      {product.image
                        ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '3rem' }}>{product.emoji}</span>
                      }
                      {product.badge && (
                        <span className={`badge badge-${product.badge}`} style={styles.cardBadge}>{product.badge}</span>
                      )}
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.cardCat}>{product.category}</div>
                      <div style={styles.cardName}>{product.name}</div>
                      <div>
                        <span style={styles.price}>${product.price}</span>
                        {product.oldPrice && <span style={styles.oldPrice}>${product.oldPrice}</span>}
                      </div>
                    </div>
                  </Link>
                  <div style={{ padding: '0 1rem 1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={{ ...styles.addBtn, background: isAdded ? '#4CAF50' : 'var(--dark)' }} onClick={() => handleAdd(product)}>
                      {isAdded ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

const styles = {
  heroLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,5vw,3.2rem)', lineHeight: 1.15, fontWeight: 700, marginBottom: '1.2rem' },
  heroDesc: { color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '400px' },
  heroCta: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  swatch: { borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px', cursor: 'pointer' },
  swatchLabel: { fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  swatchTitle: { fontFamily: 'var(--serif)', fontSize: '15px', color: 'white', fontWeight: 700 },
  stat: { textAlign: 'center', flexShrink: 0 },
  statNum: { fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 700 },
  statLabel: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' },
  sectionHeader: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700 },
  filterTab: { fontSize: '12px', fontWeight: 500, padding: '5px 14px', borderRadius: 'var(--radius-full)', border: '1px solid', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.15s', whiteSpace: 'nowrap' },
  card: { background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' },
  cardImg: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  cardBadge: { position: 'absolute', top: '10px', left: '10px' },
  cardBody: { padding: '0.8rem 1rem 0.3rem' },
  cardCat: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 },
  price: { fontSize: '14px', fontWeight: 500 },
  oldPrice: { fontSize: '11px', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '5px' },
  addBtn: { width: '32px', height: '32px', borderRadius: '50%', color: 'var(--cream)', border: 'none', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
}
