import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'

const collectionInfo = {
  ceramics: {
    title: 'Ceramics',
    subtitle: 'Handcrafted with intention',
    desc: 'Each piece is thrown or hand-built by skilled artisans, fired to perfection, and finished with our signature earth-toned glazes.',
    bg: 'linear-gradient(135deg, rgba(139,115,85,0.88) 0%, rgba(92,74,50,0.92) 100%)',
    bgImage: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f95a?w=1200&q=80',
    lightBg: '#F5EEE6',
    emoji: '🏺',
    tag: 'Artisan Made',
  },
  textiles: {
    title: 'Textiles',
    subtitle: 'Woven with care',
    desc: 'From linen throws to merino cushions, our textile collection brings warmth and texture to every room in your home.',
    bg: 'linear-gradient(135deg, rgba(200,169,110,0.88) 0%, rgba(154,122,69,0.92) 100%)',
    bgImage: 'https://images.unsplash.com/photo-1584346133934-a3afd2a2b8e2?w=1200&q=80',
    lightBg: '#FBF5EA',
    emoji: '🧶',
    tag: 'Natural Fibres',
  },
  decor: {
    title: 'Decor',
    subtitle: 'Details that matter',
    desc: 'Thoughtfully designed objects that bring beauty and function together. Each piece is chosen to complement your living space.',
    bg: 'linear-gradient(135deg, rgba(176,160,144,0.88) 0%, rgba(122,106,90,0.92) 100%)',
    bgImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
    lightBg: '#F5F0EA',
    emoji: '✨',
    tag: 'Limited Edition',
  },
}

export default function CollectionsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ceramics')
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

  const active = collectionInfo[activeTab]
  const activeProducts = grouped[activeTab] || []

  return (
    <div className="page">
      <style>{`
        @media (max-width: 639px) {
          .col-hero-emoji { display: none !important; }
          .col-products-inner { padding: 1.5rem 1rem !important; }
          .col-grid { grid-template-columns: 1fr !important; }
          .col-other-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Big hero with tabs */}
      <div style={{ 
        ...styles.hero, 
        backgroundImage: `${active.bg}, url(${active.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.4s ease',
      }}>
        <div style={styles.heroInner}>
          <div style={styles.heroLeft}>
            <span style={styles.heroTag}>{active.tag}</span>
            <h1 style={styles.heroTitle}>{active.title}</h1>
            <p style={styles.heroDesc}>{active.subtitle}</p>
            <p style={styles.heroBody}>{active.desc}</p>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>{activeProducts.length}</div>
                <div style={styles.heroStatLabel}>Pieces</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>
                  {activeProducts.length > 0 ? `$${Math.min(...activeProducts.map(p => p.price))}` : '--'}
                </div>
                <div style={styles.heroStatLabel}>From</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>
                  {activeProducts.length > 0
                    ? (activeProducts.reduce((s, p) => s + p.rating, 0) / activeProducts.length).toFixed(1) + '★'
                    : '--'}
                </div>
                <div style={styles.heroStatLabel}>Rating</div>
              </div>
            </div>
          </div>
          <div className="col-hero-emoji" style={styles.heroRight}>
            <div style={styles.heroEmoji}>{active.emoji}</div>
          </div>
        </div>

        {/* Collection tabs */}
        <div style={styles.tabs}>
          {Object.entries(collectionInfo).map(([key, col]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                ...styles.tab,
                background: activeTab === key ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderBottom: activeTab === key ? '2px solid white' : '2px solid transparent',
              }}
            >
              <span style={{ marginRight: '8px' }}>{col.emoji}</span>
              {col.title}
              <span style={styles.tabCount}>{grouped[key]?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products for active collection */}
      <div style={{ ...styles.productsSection, background: active.lightBg }}>
        <div style={styles.productsSectionInner}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading…</div>
          ) : (
            <>
              <div style={styles.grid}>
                {activeProducts.map(product => {
                  const isAdded = addedIds.includes(product.id)
                  return (
                    <div key={product.id} style={styles.card}>
                      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ ...styles.cardImg, background: product.bg }}>
                          {product.image
                            ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '3.5rem' }}>{product.emoji}</span>
                          }
                          {product.badge && (
                            <span className={`badge badge-${product.badge}`} style={styles.cardBadge}>
                              {product.badge}
                            </span>
                          )}
                          <div style={styles.cardRating}>
                            {'★'.repeat(Math.round(product.rating))} {product.rating}
                          </div>
                        </div>
                        <div style={styles.cardBody}>
                          <div style={styles.cardName}>{product.name}</div>
                          <div style={styles.cardDescText}>{product.description.slice(0, 70)}…</div>
                          <div style={styles.cardFooter}>
                            <div>
                              <span style={styles.price}>${product.price}</span>
                              {product.oldPrice && <span style={styles.oldPrice}>${product.oldPrice}</span>}
                            </div>
                            <span style={styles.reviews}>{product.reviews} reviews</span>
                          </div>
                        </div>
                      </Link>
                      <div style={{ padding: '0 1.2rem 1.2rem' }}>
                        <button
                          style={{ ...styles.addBtn, background: isAdded ? '#4CAF50' : 'var(--dark)' }}
                          onClick={() => handleAdd(product)}
                        >
                          {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Other collections teaser */}
              <div style={styles.otherCollections}>
                <div style={styles.otherTitle}>Explore Other Collections</div>
                <div style={styles.otherGrid}>
                  {Object.entries(collectionInfo)
                    .filter(([key]) => key !== activeTab)
                    .map(([key, col]) => (
                      <button
                        key={key}
                        onClick={() => { setActiveTab(key); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        style={{ ...styles.otherCard, background: col.bg }}
                      >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{col.emoji}</div>
                        <div style={styles.otherCardTitle}>{col.title}</div>
                        <div style={styles.otherCardSub}>{grouped[key]?.length || 0} pieces</div>
                        <div style={styles.otherCardArrow}>Explore →</div>
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: { padding: '0', transition: 'background 0.4s ease' },
  heroInner: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.2rem 2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' },
  heroLeft: {},
  heroTag: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 700, color: 'white', marginBottom: '0.5rem', lineHeight: 1.1 },
  heroDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginBottom: '1rem', letterSpacing: '0.02em' },
  heroBody: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2rem' },
  heroStats: { display: 'flex', gap: '2rem' },
  heroStat: { textAlign: 'center' },
  heroStatNum: { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'white' },
  heroStatLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  heroRight: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: '8rem', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))', transition: 'all 0.3s ease' },
  tabs: { display: 'flex', maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', overflowX: 'auto' },
  tab: { display: 'flex', alignItems: 'center', gap: '4px', padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--sans)', transition: 'all 0.2s', borderRadius: '0' },
  tabCount: { background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '11px', marginLeft: '4px' },
  productsSection: { transition: 'background 0.4s ease', minHeight: '60vh' },
  productsSectionInner: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '4rem' },
  card: { background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  cardImg: { height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cardBadge: { position: 'absolute', top: '12px', left: '12px' },
  cardRating: { position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--dark)' },
  cardBody: { padding: '1.2rem 1.2rem 0.8rem' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 },
  cardDescText: { fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  price: { fontSize: '16px', fontWeight: 600 },
  oldPrice: { fontSize: '12px', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '6px' },
  reviews: { fontSize: '11px', color: 'var(--muted)' },
  addBtn: { width: '100%', color: 'var(--cream)', border: 'none', padding: '11px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' },
  otherCollections: { borderTop: '1px solid var(--border)', paddingTop: '3rem' },
  otherTitle: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' },
  otherGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  otherCard: { border: 'none', borderRadius: '20px', padding: '2.5rem 2rem', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.2s, box-shadow 0.2s' },
  otherCardTitle: { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '4px' },
  otherCardSub: { fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' },
  otherCardArrow: { fontSize: '13px', color: 'white', fontWeight: 500 },
}
