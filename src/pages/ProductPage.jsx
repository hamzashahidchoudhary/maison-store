import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { productsAPI } from '@/lib/api'
import { useCart } from '@/context/CartContext'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem, setIsOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    productsAPI.getOne(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => { setAdded(false); setIsOpen(true) }, 600)
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--muted)' }}>
      Loading…
    </div>
  )

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '1rem' }}>Product not found</h2>
      <Link to="/shop" className="btn btn-dark">Back to shop</Link>
    </div>
  )

  return (
    <div className="page">
      <style>{`
        .product-layout { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .product-img-box { border-radius: 20px; overflow: hidden; position: relative; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
        .product-add-btn { color: var(--cream); border: none; padding: 13px 24px; border-radius: var(--radius-full); font-size: 14px; font-weight: 500; cursor: pointer; flex: 1; transition: background 0.3s; }
        @media (max-width: 639px) {
          .product-layout { grid-template-columns: 1fr !important; padding: 1rem !important; gap: 1.5rem !important; }
          .product-img-box { aspect-ratio: 4/3 !important; width: 100% !important; }
          .product-add-btn { width: 100% !important; padding: 14px !important; font-size: 15px !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 2rem 0' }}>
        <Link to="/shop" style={{ fontSize: '13px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ← Back to shop
        </Link>
      </div>

      <div className="product-layout">
        {/* Image */}
        <div className="product-img-box" style={{ background: product.bg }}>
          {product.image
            ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '7rem' }}>{product.emoji}</span>
          }
          {product.badge && (
            <span className={`badge badge-${product.badge}`} style={{ position: 'absolute', top: '16px', left: '16px' }}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={styles.category}>{product.category}</div>
          <h1 style={styles.name}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>{'★'.repeat(Math.round(product.rating))}</span>
            <span style={styles.ratingNum}>{product.rating}</span>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>({product.reviews} reviews)</span>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.price}>${product.price}</span>
            {product.oldPrice && <span style={styles.oldPrice}>${product.oldPrice}</span>}
            {product.oldPrice && (
              <span style={styles.saveBadge}>Save ${product.oldPrice - product.price}</span>
            )}
          </div>

          <p style={styles.desc}>{product.description}</p>

          {product.details?.length > 0 && (
            <div style={styles.details}>
              <div style={styles.detailsTitle}>Product Details</div>
              <ul style={styles.detailsList}>
                {product.details.map((d, i) => (
                  <li key={i} style={styles.detailItem}>
                    <span style={{ color: 'var(--accent)', marginRight: '8px' }}>—</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={styles.actions}>
            <div style={styles.qtyRow}>
              <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={styles.qty}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button
              style={{ ...styles.addBtn, flex: 1, background: added ? '#4CAF50' : 'var(--dark)' }}
              onClick={handleAdd}
            >
              {added ? '✓ Added to cart' : `Add to Cart — $${(product.price * qty).toFixed(2)}`}
            </button>
          </div>

          <div style={styles.perks}>
            {['Free shipping over $75', 'Free returns within 30 days', 'Sustainably sourced'].map(p => (
              <div key={p} style={styles.perk}>
                <span style={{ color: 'var(--accent)' }}>✓</span> {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  category: { fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' },
  name: { fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' },
  stars: { color: 'var(--accent)', fontSize: '14px' },
  ratingNum: { fontSize: '14px', fontWeight: 500 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1.5rem' },
  price: { fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700 },
  oldPrice: { fontSize: '1rem', color: 'var(--muted)', textDecoration: 'line-through' },
  saveBadge: { fontSize: '12px', background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '20px' },
  desc: { color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '14px' },
  details: { marginBottom: '2rem' },
  detailsTitle: { fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', color: 'var(--muted)' },
  detailsList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' },
  detailItem: { fontSize: '14px', display: 'flex', alignItems: 'center' },
  actions: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 14px' },
  qtyBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--dark)', lineHeight: 1 },
  qty: { fontSize: '15px', fontWeight: 500, minWidth: '20px', textAlign: 'center' },
  addBtn: { color: 'var(--cream)', border: 'none', padding: '13px 24px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.3s' },
  perks: { display: 'flex', flexDirection: 'column', gap: '8px' },
  perk: { fontSize: '13px', color: 'var(--muted)', display: 'flex', gap: '8px' },
}
