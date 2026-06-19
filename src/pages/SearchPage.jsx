import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { productsAPI } from '@/lib/api'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [addedIds, setAddedIds] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    if (!query.trim()) { setProducts([]); return }
    setLoading(true)
    productsAPI.getAll('all')
      .then(all => {
        const q = query.toLowerCase()
        setProducts(all.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        ))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  const handleAdd = (product) => {
    addItem(product)
    setAddedIds(prev => [...prev, product.id])
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1200)
  }

  return (
    <div className="page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', minHeight: '60vh' }}>

      {/* Search bar */}
      <h1 style={styles.title}>Search</h1>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search products, categories..."
          style={styles.input}
          autoFocus
        />
        <button type="submit" style={styles.btn}>Search</button>
      </form>

      {/* Results */}
      {!query && (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ color: 'var(--muted)' }}>Type something to search our products</p>
        </div>
      )}

      {query && loading && (
        <div style={styles.empty}>
          <p style={{ color: 'var(--muted)' }}>Searching...</p>
        </div>
      )}

      {query && !loading && products.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
          <p style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>No results for "<strong>{query}</strong>"</p>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Try a different keyword or browse our shop</p>
          <Link to="/shop" className="btn btn-dark" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Browse Shop</Link>
        </div>
      )}

      {query && !loading && products.length > 0 && (
        <>
          <p style={styles.resultCount}>
            {products.length} result{products.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
          </p>
          <div style={styles.grid}>
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
                      <div style={styles.cardMeta}>
                        <span style={{ color: 'var(--accent)', fontSize: '12px' }}>{'★'.repeat(Math.round(product.rating))}</span>
                        <span style={{ color: 'var(--muted)', fontSize: '11px' }}>({product.reviews})</span>
                      </div>
                      <div>
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
        </>
      )}
    </div>
  )
}

const styles = {
  title: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' },
  form: { display: 'flex', gap: '12px', marginBottom: '2.5rem', maxWidth: '600px' },
  input: { flex: 1, fontSize: '16px' },
  btn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '11px 24px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  resultCount: { fontSize: '14px', color: 'var(--muted)', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  card: { background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' },
  cardImg: { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  cardBadge: { position: 'absolute', top: '12px', left: '12px' },
  cardBody: { padding: '1rem 1rem 0.5rem' },
  cardCat: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' },
  cardName: { fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 },
  cardMeta: { display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '6px' },
  price: { fontSize: '15px', fontWeight: 500 },
  oldPrice: { fontSize: '12px', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '6px' },
  addBtn: { width: '100%', color: 'var(--cream)', border: 'none', padding: '9px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' },
}
