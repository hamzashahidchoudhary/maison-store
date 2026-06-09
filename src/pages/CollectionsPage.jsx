import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'

const collectionInfo = {
  ceramics: {
    title: 'Ceramics',
    subtitle: 'Handcrafted with intention',
    desc: 'Each piece is thrown or hand-built by skilled artisans, fired to perfection, and finished with our signature earth-toned glazes.',
    bg: 'linear-gradient(135deg, #8B7355 0%, #5C4A32 100%)',
    emoji: '🏺',
  },
  textiles: {
    title: 'Textiles',
    subtitle: 'Woven with care',
    desc: 'From linen throws to merino cushions, our textile collection brings warmth and texture to every room in your home.',
    bg: 'linear-gradient(135deg, #C8A96E 0%, #9A7A45 100%)',
    emoji: '🧶',
  },
  decor: {
    title: 'Decor',
    subtitle: 'Details that matter',
    desc: 'Thoughtfully designed objects that bring beauty and function together. Each piece is chosen to complement your living space.',
    bg: 'linear-gradient(135deg, #D4C5B0 0%, #A89880 100%)',
    emoji: '✨',
  },
}

export default function CollectionsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedIds, setAddedIds] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    productsAPI.getAll('all')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (product) => {
    addItem(product)
    setAddedIds(prev => [...prev, product.id])
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1200)
  }

  const grouped = {
    ceramics: products.filter(p => p.category === 'ceramics'),
    textiles: products.filter(p => p.category === 'textiles'),
    decor: products.filter(p => p.category === 'decor'),
  }

  return (
    <div className="page">
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroLabel}>Curated Collections</div>
          <h1 style={styles.heroTitle}>Shop by Collection</h1>
          <p style={styles.heroDesc}>
            Explore our carefully curated collections, each telling a unique story of craft, material, and design.
          </p>
        </div>
      </div>

      {/* Collection previews */}
      <div style={styles.previews}>
        {Object.entries(collectionInfo).map(([key, col]) => (
          <a key={key} href={`#${key}`} style={{ ...styles.previewCard, background: col.bg }}>
            <div style={styles.previewEmoji}>{col.emoji}</div>
            <div style={styles.previewTitle}>{col.title}</div>
            <div style={styles.previewCount}>{grouped[key]?.length || 0} pieces</div>
          </a>
        ))}
      </div>

      {/* Each collection */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading collections…</div>
      ) : (
        Object.entries(collectionInfo).map(([key, col]) => (
          <section key={key} id={key} style={styles.section}>
            {/* Collection header */}
            <div style={{ ...styles.colHeader, background: col.bg }}>
              <div style={styles.colHeaderInner}>
                <div style={styles.colEmoji}>{col.emoji}</div>
                <div>
                  <div style={styles.colSubtitle}>{col.subtitle}</div>
                  <h2 style={styles.colTitle}>{col.title}</h2>
                  <p style={styles.colDesc}>{col.desc}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div style={styles.products}>
              <div style={styles.grid}>
                {grouped[key].map(product => {
                  const isAdded = addedIds.includes(product.id)
                  return (
                    <div key={product.id} style={styles.card}>
                      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ ...styles.cardImg, background: product.bg }}>
                          <span style={{ fontSize: '3rem' }}>{product.emoji}</span>
                          {product.badge && (
                            <span className={`badge badge-${product.badge}`} style={styles.cardBadge}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div style={styles.cardBody}>
                          <div style={styles.cardName}>{product.name}</div>
                          <div style={styles.cardPrice}>
                            <span style={styles.price}>${product.price}</span>
                            {product.oldPrice && <span style={styles.oldPrice}>${product.oldPrice}</span>}
                          </div>
                        </div>
                      </Link>
                      <div style={{ padding: '0 1rem 1rem' }}>
                        <button
                          style={{ ...styles.addBtn, background: isAdded ? '#4CAF50' : 'var(--dark)' }}
                          onClick={() => handleAdd(product)}
                        >
                          {isAdded ? '✓ Added' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={styles.viewAll}>
                <Link to={`/shop?category=${key}`} className="btn btn-outline">
                  View All {col.title} →
                </Link>
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  )
}

const styles = {
  hero: { background: 'var(--cream)', borderBottom: '1px solid var(--border)', padding: '4rem 2rem' },
  heroInner: { maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
  heroLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, marginBottom: '1rem' },
  heroDesc: { color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' },
  previews: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0' },
  previewCard: { padding: '3rem 2rem', textAlign: 'center', textDecoration: 'none', transition: 'opacity 0.2s', cursor: 'pointer' },
  previewEmoji: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  previewTitle: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '0.3rem' },
  previewCount: { fontSize: '12px', color: 'rgba(255,255,255,0.7)' },
  section: { borderTop: '1px solid var(--border)' },
  colHeader: { padding: '3rem 2rem' },
  colHeaderInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center' },
  colEmoji: { fontSize: '4rem', flexShrink: 0 },
  colSubtitle: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' },
  colTitle: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' },
  colDesc: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.6, maxWidth: '500px' },
  products: { maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '16px', marginBottom: '2rem' },
  card: { background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' },
  cardImg: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cardBadge: { position: 'absolute', top: '12px', left: '12px' },
  cardBody: { padding: '0.8rem 1rem 0.5rem' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 },
  cardPrice: { display: 'flex', alignItems: 'baseline', gap: '6px' },
  price: { fontSize: '14px', fontWeight: 500 },
  oldPrice: { fontSize: '11px', color: 'var(--muted)', textDecoration: 'line-through' },
  addBtn: { width: '100%', color: 'var(--cream)', border: 'none', padding: '8px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' },
  viewAll: { textAlign: 'center' },
}
