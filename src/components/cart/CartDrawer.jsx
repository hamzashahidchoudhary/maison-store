import { useCart } from '@/context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalPrice, isOpen, setIsOpen, totalItems } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setIsOpen(false)
    if (!user) {
      navigate('/login?next=checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          ...styles.overlay,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      />

      {/* Panel */}
      <div style={{ ...styles.panel, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={styles.header}>
          <span style={styles.title}>Your Cart {totalItems > 0 && `(${totalItems})`}</span>
          <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div style={styles.body}>
          {items.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛍️</div>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Your cart is empty.</p>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Add something beautiful.</p>
            </div>
          ) : (
            <div style={styles.items}>
              {items.map(item => (
                <div key={item.id} style={styles.item}>
                  <div style={{ ...styles.itemIcon, background: item.bg, overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      : item.emoji
                    }
                  </div>
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemPrice}>${item.price}</div>
                  </div>
                  <div style={styles.itemControls}>
                    <div style={styles.qtyRow}>
                      <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span style={styles.qty}>{item.qty}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={styles.footer}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '1rem' }} />
            <div style={styles.totalRow}>
              <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Subtotal</span>
              <span style={styles.total}>${totalPrice.toFixed(2)}</span>
            </div>
            <p style={styles.shipping}>Shipping calculated at checkout</p>
            <button style={styles.checkoutBtn} onClick={handleCheckout}>
              {user ? 'Proceed to Checkout →' : 'Sign in to Checkout →'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(26,24,20,0.4)',
    zIndex: 200, transition: 'opacity 0.3s',
  },
  panel: {
    position: 'fixed', right: 0, top: 0, bottom: 0, width: '380px',
    background: 'var(--cream)', zIndex: 201,
    transition: 'transform 0.3s ease',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.5rem', borderBottom: '1px solid var(--border)',
  },
  title: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700 },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', color: 'var(--muted)', cursor: 'pointer' },
  body: { flex: 1, overflowY: 'auto', padding: '1.5rem' },
  empty: { textAlign: 'center', paddingTop: '4rem' },
  items: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: {
    background: 'white', borderRadius: '12px', padding: '12px',
    border: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'flex-start',
  },
  itemIcon: {
    fontSize: '1.8rem', width: '52px', height: '52px',
    borderRadius: '8px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '13px', fontWeight: 500, marginBottom: '3px', lineHeight: 1.3 },
  itemPrice: { fontSize: '12px', color: 'var(--muted)' },
  itemControls: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)',
    background: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  qty: { fontSize: '13px', fontWeight: 500, minWidth: '16px', textAlign: 'center' },
  removeBtn: {
    background: 'none', border: 'none', fontSize: '11px',
    color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline',
  },
  footer: { padding: '0 1.5rem 1.5rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' },
  total: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700 },
  shipping: { fontSize: '12px', color: 'var(--muted)', marginBottom: '1rem' },
  checkoutBtn: {
    width: '100%', background: 'var(--dark)', color: 'var(--cream)',
    border: 'none', padding: '14px', borderRadius: 'var(--radius-full)',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  },
}
