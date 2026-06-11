import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import { categories } from '@/lib/categories'

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [addedIds, setAddedIds] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    productsAPI.getAll('all')
      .then(data => {
        setAllProducts(data)
        setProducts(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (product) => {
    addItem(product)
    setAddedIds(prev => [...prev, product.id])
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1200)
  }

  let filtered = allProducts
    .filter(p => category === 'all' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.price <= maxPrice)

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  const getCatCount = (id) => id === 'all' ? allProducts.length : allProducts.filter(p => p.category === id).length

  return (
    <div className="page">
      <style>{`
        .shop-layout { display: grid; grid-template-columns: 220px 1fr; gap: 3rem; align-items: start; max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; }
        .shop-sidebar { position: sticky; top: 90px; }
        @media (max-width: 639px) {
          .shop-layout { grid-template-columns: 1fr !important; gap: 1.5rem !important; padding: 1.5rem 1rem !important; }
          .shop-sidebar { position: static !important; }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.headerLabel}>Our Products</div>
            <h1 style={styles.headerTitle}>Shop All</h1>
          </div>
          <p style={styles.headerDesc}>Thoughtfully designed pieces for modern living. Every item carefully selected for quality and longevity.</p>
        </div>
      </div>

      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <div style={styles.sideSection}>
            <div style={styles.sideTitle}>Search</div>
            <input className="input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div style={styles.sideSection}>
            <div style={styles.sideTitle}>Category</div>
            <div style={styles.catList}>
              <button onClick={() => setCategory('all')}
                style={{ ...styles.catBtn, background: category === 'all' ? 'var(--dark)' : 'transparent', color: category === 'all' ? 'var(--cream)' : 'var(--dark)' }}>
                All <span style={{ opacity: 0.5, fontSize: '11px' }}>{getCatCount('all')}</span>
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  style={{ ...styles.catBtn, background: category === cat.id ? 'var(--dark)' : 'transparent', color: category === cat.id ? 'var(--cream)' : 'var(--dark)' }}>
                  {cat.label} <span style={{ opacity: 0.5, fontSize: '11px' }}>{getCatCount(cat.id)}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.sideSection}>
            <div style={styles.sideTitle}>Sort By</div>
            <div style={styles.catList}>
              {sortOptions.map(opt => (
                <button key={opt.value} onClick={() => setSort(opt.value)}
                  style={{ ...styles.catBtn, background: sort === opt.value ? 'var(--dark)' : 'transparent', color: sort === opt.value ? 'var(--cream)' : 'var(--dark)' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.sideSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={styles.sideTitle}>Max Price</div>
              <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '15px' }}>${maxPrice}</span>
            </div>
            <input type="range" min={0} max={1000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>$0</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>$1000</span>
            </div>
            {maxPrice < 1000 && (
              <button onClick={() => setMaxPrice(1000)} style={styles.resetBtn}>Reset</button>
            )}
          </div>
        </aside>

        {/* Products */}
        <main style={{ minWidth: 0 }}>
          <div style={styles.toolbar}>
            <span style={styles.resultCount}>{loading ? 'Loading...' : `${filtered.length} products`}</span>
            {(search || maxPrice < 1000) && (
              <button style={styles.clearSearch} onClick={() => { setSearch(''); setMaxPrice(1000) }}>Clear filters ✕</button>
            )}
          </div>

          {loading ? (
            <div style={styles.loading}>Loading products…</div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ color: 'var(--muted)' }}>No products match your filters</p>
              <button style={styles.clearBtn} onClick={() => { setSearch(''); setMaxPrice(1000); setCategory('all') }}>Clear filters</button>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map(product => {
                const isAdded = addedIds.includes(product.id)
                return (
                  <div key={product.id} style={styles.card}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ ...styles.cardImg, background: product.bg }}>
                        {product.image
                          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '3rem' }}>{product.emoji}</span>
                        }
                        {product.badge && <span className={`badge badge-${product.badge}`} style={styles.badge}>{product.badge}</span>}
                      </div>
                      <div style={styles.cardBody}>
                        <div style={styles.cardCat}>{product.category}</div>
                        <div style={styles.cardName}>{product.name}</div>
                        <div style={styles.cardMeta}>
                          <span style={{ color: 'var(--accent)', fontSize: '12px' }}>{'★'.repeat(Math.round(product.rating))}</span>
                          <span style={{ color: 'var(--muted)', fontSize: '11px' }}>({product.reviews})</span>
                        </div>
                        <div style={styles.cardPrice}>
                          <span style={styles.price}>${product.price}</span>
                          {product.oldPrice && <span style={styles.oldPrice}>${product.oldPrice}</span>}
                        </div>
                      </div>
                    </Link>
                    <div style={{ padding: '0 1rem 1rem' }}>
                      <button style={{ ...styles.addBtn, background: isAdded ? '#4CAF50' : 'var(--dark)' }} onClick={() => handleAdd(product)}>
                        {isAdded ? '✓ Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      <style>{`
        input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: linear-gradient(to right, var(--accent) 0%, var(--accent) ${((maxPrice) / 1000) * 100}%, var(--border) ${((maxPrice) / 1000) * 100}%, var(--border) 100%); border-radius: 2px; outline: none; cursor: pointer; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--dark); cursor: pointer; border: 2px solid var(--cream); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
      `}</style>
    </div>
  )
}

const styles = {
  header: {
    color: 'var(--cream)', padding: '4rem 2rem',
    backgroundImage: 'linear-gradient(rgba(26,24,20,0.75), rgba(26,24,20,0.75)), url(/images/shop-hero.png)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    backgroundColor: 'var(--dark)',
  },
  headerInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' },
  headerLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' },
  headerTitle: { fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 700 },
  headerDesc: { color: 'rgba(247,244,239,0.7)', fontSize: '15px', lineHeight: 1.7, maxWidth: '500px' },
  sideSection: { marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' },
  sideTitle: { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '12px' },
  catList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  catBtn: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--sans)', textAlign: 'left', transition: 'all 0.15s' },
  resetBtn: { marginTop: '8px', fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
  resultCount: { fontSize: '13px', color: 'var(--muted)' },
  clearSearch: { fontSize: '12px', color: 'var(--muted)', background: 'none', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '4rem', color: 'var(--muted)' },
  empty: { textAlign: 'center', padding: '4rem' },
  clearBtn: { marginTop: '1rem', background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '10px 24px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  card: { background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' },
  cardImg: { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  badge: { position: 'absolute', top: '12px', left: '12px' },
  cardBody: { padding: '1rem 1rem 0.5rem' },
  cardCat: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 },
  cardMeta: { display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '6px' },
  cardPrice: { display: 'flex', alignItems: 'baseline', gap: '6px' },
  price: { fontSize: '15px', fontWeight: 500 },
  oldPrice: { fontSize: '12px', color: 'var(--muted)', textDecoration: 'line-through' },
  addBtn: { width: '100%', color: 'var(--cream)', border: 'none', padding: '9px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' },
}
