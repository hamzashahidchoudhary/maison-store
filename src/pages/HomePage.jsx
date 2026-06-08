import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'

const categories = ['all', 'ceramics', 'textiles', 'decor']

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

  return (
    <div className="page">
      {/* Hero */}
      <section style={styles.heroWrap}>
        <div style={styles.hero}>
          <div>
            <div style={styles.heroLabel}>New Collection — 2026</div>
            <h1 style={styles.heroTitle}>
              Timeless pieces,<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>crafted</em> for<br />
              modern living
            </h1>
            <p style={styles.heroDesc}>
              Thoughtfully designed homewares and accessories that bring warmth
              and intention to everyday moments.
            </p>
            <div style={styles.heroCta}>
              <button className="btn btn-dark" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                Shop Now
              </button>
              <button className="btn btn-outline">View Lookbook</button>
            </div>
          </div>
          <div style={styles.heroGrid}>
            <div style={{ ...styles.swatch, background: 'linear-gradient(160deg,#8B7355,#5C4A32)', gridRow: 'span 2' }}>
              <span style={styles.swatchLabel}>Bestseller</span>
              <span style={styles.swatchTitle}>Walnut Collection</span>
            </div>
            <div style={{ ...styles.swatch, background: 'linear-gradient(160deg,#C8A96E,#9A7A45)', height: '110px' }}>
              <span style={styles.swatchLabel}>New In</span>
              <span style={styles.swatchTitle}>Amber Ceramics</span>
            </div>
            <div style={{ ...styles.swatch, background: 'linear-gradient(160deg,#D4C5B0,#A89880)', height: '110px' }}>
              <span style={styles.swatchLabel}>Limited</span>
              <span style={styles.swatchTitle}>Linen Series</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={styles.stats}>
        {[['4.9★', 'Avg Rating'], ['12k+', 'Happy Customers'], ['180+', 'Products'], ['Free', 'Returns']].map(([num, label]) => (
          <div key={label} style={styles.stat}>
            <div style={styles.statNum}>{num}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Products */}
      <section id="products" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <div style={styles.filters}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ ...styles.filterTab, background: activeCategory === cat ? 'var(--dark)' : 'transparent', color: activeCategory === cat ? 'var(--cream)' : 'var(--muted)', borderColor: activeCategory === cat ? 'var(--dark)' : 'var(--border)' }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading products…</div>
        ) : (
          <div style={styles.grid}>
            {products.map(product => {
              const isAdded = addedIds.includes(product.id)
              return (
                <div key={product.id} style={styles.card}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ ...styles.cardImg, background: product.bg }}>
                      <span style={{ fontSize: '3.5rem' }}>{product.emoji}</span>
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
                  <div style={{ padding: '0 1.1rem 1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
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
  heroWrap: { borderBottom: '1px solid var(--border)' },
  hero: { maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' },
  heroLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.15, fontWeight: 700, marginBottom: '1.2rem' },
  heroDesc: { color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '400px' },
  heroCta: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  heroGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  swatch: { borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px', minHeight: '220px' },
  swatchLabel: { fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  swatchTitle: { fontFamily: 'var(--serif)', fontSize: '14px', color: 'white', fontWeight: 600 },
  stats: { display: 'flex', justifyContent: 'center', gap: '4rem', padding: '2rem', borderBottom: '1px solid var(--border)' },
  stat: { textAlign: 'center' },
  statNum: { fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700 },
  statLabel: { fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' },
  section: { maxWidth: '1100px', margin: '0 auto', padding: '3.5rem 2rem' },
  sectionHeader: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700 },
  filters: { display: 'flex', gap: '8px' },
  filterTab: { fontSize: '12px', fontWeight: 500, padding: '5px 14px', borderRadius: 'var(--radius-full)', border: '1px solid', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.15s' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '20px' },
  card: { background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' },
  cardImg: { height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cardBadge: { position: 'absolute', top: '12px', left: '12px' },
  cardBody: { padding: '1rem 1.1rem 0.5rem' },
  cardCat: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 },
  price: { fontSize: '15px', fontWeight: 500 },
  oldPrice: { fontSize: '12px', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '6px' },
  addBtn: { width: '32px', height: '32px', borderRadius: '50%', color: 'var(--cream)', border: 'none', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
}
