import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { getProductById } from '@/lib/products'
import { useCart } from '@/context/CartContext'

export default function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addItem, setIsOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '1rem' }}>Product not found</h2>
      <Link to="/" className="btn btn-dark">Back to shop</Link>
    </div>
  )

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => { setAdded(false); setIsOpen(true) }, 600)
  }

  return (
    <div className="page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
      <Link to="/" style={{ fontSize: '13px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '2rem' }}>
        ← Back to shop
      </Link>

      <div style={styles.layout}>
        {/* Image */}
        <div style={{ ...styles.imgBox, background: product.bg }}>
          <span style={{ fontSize: '7rem' }}>{product.emoji}</span>
          {product.badge && (
            <span className={`badge badge-${product.badge}`} style={{ position: 'absolute', top: '20px', left: '20px' }}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={styles.info}>
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
              <span style={styles.saveBadge}>
                Save ${product.oldPrice - product.price}
              </span>
            )}
          </div>

          <p style={styles.desc}>{product.description}</p>

          <div style={styles.details}>
            <div style={styles.detailsTitle}>Product Details</div>
            <ul style={styles.detailsList}>
              {product.details.map(d => (
                <li key={d} style={styles.detailItem}>
                  <span style={{ color: 'var(--accent)', marginRight: '8px' }}>—</span>{d}
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.actions}>
            <div style={styles.qtyRow}>
              <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={styles.qty}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
            </div>

            <button
              style={{ ...styles.addBtn, background: added ? '#4CAF50' : 'var(--dark)', flex: 1 }}
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
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
  imgBox: { borderRadius: '20px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  info: {},
  category: { fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' },
  name: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' },
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
  actions: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 14px' },
  qtyBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--dark)', lineHeight: 1 },
  qty: { fontSize: '15px', fontWeight: 500, minWidth: '20px', textAlign: 'center' },
  addBtn: { color: 'var(--cream)', border: 'none', padding: '13px 24px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.3s' },
  perks: { display: 'flex', flexDirection: 'column', gap: '8px' },
  perk: { fontSize: '13px', color: 'var(--muted)', display: 'flex', gap: '8px' },
}
