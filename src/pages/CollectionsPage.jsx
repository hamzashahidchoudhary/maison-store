import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import { categories, getCategoryById } from '@/lib/categories'

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

  const getProductsByCategory = (id) => products.filter(p => p.category === id)
  const active = getCategoryById(activeTab)
  const activeProducts = getProductsByCategory(activeTab)

  return (
    <div className="page">
      {/* Hidden images to preload all category backgrounds */}
      <div style={{ display: 'none' }}>
        {categories.map(cat => (
          <img key={cat.id} src={cat.image} alt="" />
        ))}
      </div>

      <style>{`
        .col-tabs { display: flex; max-width: 1100px; margin: 0 auto; padding: 0 1rem; overflow-x: auto; scrollbar-width: none; }
        .col-tabs::-webkit-scrollbar { display: none; }
        .col-tab { display: flex; align-items: center; gap: 6px; padding: 1rem 1.2rem; color: rgba(255,255,255,0.75); border: none; cursor: pointer; font-size: 13px; font-weight: 500; font-family: var(--sans); transition: all 0.2s; border-bottom: 2px solid transparent; background: transparent; white-space: nowrap; flex-shrink: 0; }
        .col-tab.active, .col-tab:hover { color: white; border-bottom-color: white; background: rgba(255,255,255,0.1); }
        .col-tab-count { background: rgba(255,255,255,0.2); color: white; border-radius: 20px; padding: 1px 7px; font-size: 11px; }
        @media (max-width: 639px) {
          .col-hero-inner { grid-template-columns: 1fr !important; padding: 2.5rem 1.2rem 1rem !important; }
          .col-products-inner { padding: 1.5rem 1rem !important; }
          .col-grid { grid-template-columns: 1fr !important; }
          .col-other-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <div
        key={activeTab}
        style={{
          backgroundImage: `linear-gradient(${active.overlayColor}, ${active.overlayColor}), url(${active.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="col-hero-inner" style={styles.heroInner}>
          <div>
            <span style={styles.heroTag}>{active.tag}</span>
            <h1 style={styles.heroTitle}>{active.label}</h1>
            <p style={styles.heroSubtitle}>{active.subtitle}</p>
            <p style={styles.heroBody}>{active.desc}</p>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>{activeProducts.length}</div>
                <div style={styles.heroStatLabel}>Pieces</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>
                  {activeProducts.length > 0 ? `$${Math.min(...activeProducts.map(p => p.price))}` : '—'}
                </div>
                <div style={styles.heroStatLabel}>From</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNum}>
                  {activeProducts.length > 0
                    ? (activeProducts.reduce((s, p) => s + p.rating, 0) / activeProducts.length).toFixed(1) + '★'
                    : '—'}
                </div>
                <div style={styles.heroStatLabel}>Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="col-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`col-tab${activeTab === cat.id ? ' active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
              <span className="col-tab-count">{getProductsByCategory(cat.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ background: active.lightBg, minHeight: '50vh', transition: 'background 0.3s' }}>
        <div className="col-products-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading…</div>
          ) : activeProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>No products in this category yet.</p>
              <Link to="/admin" style={{ fontSize: '13px', color: 'var(--accent)' }}>Add products in Admin →</Link>
            </div>
          ) : (
            <>
              <div className="col-grid" style={styles.grid}>
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
                            <span className={`badge badge-${product.badge}`} style={styles.cardBadge}>{product.badge}</span>
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
                        <button style={{ ...styles.addBtn, background: isAdded ? '#4CAF50' : 'var(--dark)' }} onClick={() => handleAdd(product)}>
                          {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Other collections */}
              <div style={styles.otherCollections}>
                <div style={styles.otherTitle}>Explore Other Collections</div>
                <div className="col-other-grid" style={styles.otherGrid}>
                  {categories
                    .filter(cat => cat.id !== activeTab)
                    .slice(0, 4)
                    .map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveTab(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        style={{
                          ...styles.otherCard,
                          backgroundImage: `linear-gradient(${cat.overlayColor}, ${cat.overlayColor}), url(${cat.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div style={styles.otherCardTitle}>{cat.label}</div>
                        <div style={styles.otherCardSub}>{getProductsByCategory(cat.id).length} pieces</div>
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
  heroInner: { maxWidth: '1100px', margin: '0 auto', padding: '3.5rem 2rem 2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' },
  heroTag: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 700, color: 'white', marginBottom: '0.4rem', lineHeight: 1.1 },
  heroSubtitle: { fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', marginBottom: '1rem' },
  heroBody: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2rem' },
  heroStats: { display: 'flex', gap: '2.5rem' },
  heroStat: { textAlign: 'center' },
  heroStatNum: { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'white' },
  heroStatLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '3rem' },
  card: { background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  cardImg: { height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  cardBadge: { position: 'absolute', top: '12px', left: '12px' },
  cardRating: { position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 },
  cardBody: { padding: '1.2rem 1.2rem 0.8rem' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 },
  cardDescText: { fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  price: { fontSize: '16px', fontWeight: 600 },
  oldPrice: { fontSize: '12px', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '6px' },
  reviews: { fontSize: '11px', color: 'var(--muted)' },
  addBtn: { width: '100%', color: 'var(--cream)', border: 'none', padding: '11px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' },
  otherCollections: { borderTop: '1px solid var(--border)', paddingTop: '2.5rem' },
  otherTitle: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' },
  otherGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  otherCard: { border: 'none', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.2s', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  otherCardTitle: { fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '2px' },
  otherCardSub: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' },
  otherCardArrow: { fontSize: '12px', color: 'white', fontWeight: 500 },
}
