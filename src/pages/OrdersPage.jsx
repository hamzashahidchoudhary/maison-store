import { useAuth } from '@/context/AuthContext'
import { ordersAPI } from '@/lib/api'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function OrdersPage() {
  const { user } = useAuth()
  const location = useLocation()
  const newOrderId = location.state?.newOrder
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    ordersAPI.getAll()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '1rem' }}>Please sign in</h2>
      <Link to="/login" className="btn btn-dark">Sign in</Link>
    </div>
  )

  return (
    <div className="page" style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={styles.title}>Your Orders</h1>

      {newOrderId && (
        <div style={styles.successBanner}>
          🎉 Order placed successfully! Thank you, {user.name.split(' ')[0]}.
          <Link to="/" style={{ marginLeft: '12px', fontWeight: 600, color: '#166534', textDecoration: 'underline' }}>Continue Shopping</Link>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>When you place an order, it will appear here.</p>
          <Link to="/" className="btn btn-dark">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <div style={styles.orderMeta}>Order #{String(order.id).padStart(6, '0')}</div>
                  <div style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div style={styles.orderRight}>
                  <span style={styles.statusBadge}>{order.status}</span>
                  <div style={styles.orderTotal}>${order.total.toFixed(2)}</div>
                </div>
              </div>
              <hr className="divider" />
              <div style={styles.orderItems}>
                {order.items.map(item => (
                  <div key={item.id} style={styles.orderItem}>
                    <div style={{ ...styles.itemIcon, background: item.product.bg }}>{item.product.emoji}</div>
                    <div>
                      <div style={styles.itemName}>{item.product.name}</div>
                      <div style={styles.itemSub}>Qty: {item.qty} · ${item.price} each</div>
                    </div>
                    <div style={styles.itemTotal}>${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={styles.addressRow}>
                <span style={styles.addressLabel}>Shipped to:</span>
                <span style={styles.addressVal}>{order.address}, {order.city}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  title: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' },
  successBanner: { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: '1.5rem', fontSize: '14px', fontWeight: 500 },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  orderCard: { padding: '1.5rem' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderMeta: { fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' },
  orderDate: { fontWeight: 500, fontSize: '15px' },
  orderRight: { textAlign: 'right' },
  statusBadge: { display: 'inline-block', background: '#F0FDF4', color: '#166534', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, marginBottom: '4px' },
  orderTotal: { fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700 },
  orderItems: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' },
  orderItem: { display: 'flex', gap: '12px', alignItems: 'center' },
  itemIcon: { width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 },
  itemName: { fontSize: '14px', fontWeight: 500 },
  itemSub: { fontSize: '12px', color: 'var(--muted)' },
  itemTotal: { marginLeft: 'auto', fontSize: '14px', fontWeight: 500 },
  addressRow: { display: 'flex', gap: '6px', fontSize: '13px', color: 'var(--muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' },
  addressLabel: { fontWeight: 500, color: 'var(--dark)' },
}
