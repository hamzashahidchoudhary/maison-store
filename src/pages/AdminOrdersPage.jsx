import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusColors = {
  PENDING: { bg: '#FEF3C7', color: '#92400E' },
  CONFIRMED: { bg: '#DBEAFE', color: '#1E40AF' },
  SHIPPED: { bg: '#E0E7FF', color: '#4338CA' },
  DELIVERED: { bg: '#D1FAE5', color: '#065F46' },
  CANCELLED: { bg: '#FEE2E2', color: '#991B1B' },
}

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
  const token = localStorage.getItem('maison_token')

  useEffect(() => { loadOrders() }, [])

  const loadOrders = () => {
    setLoading(true)
    fetch(`${base}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`${base}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      })
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '1rem' }}>Please sign in</h2>
      <Link to="/login" className="btn btn-dark">Sign in</Link>
    </div>
  )

  if (user.role !== 'ADMIN') return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '0.5rem' }}>Admin Access Required</h2>
      <Link to="/" className="btn btn-dark">Go Home</Link>
    </div>
  )

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const counts = statusOptions.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {})

  return (
    <div className="page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      <style>{`
        .orders-grid { display: grid; gap: 16px; }
        @media (max-width: 639px) {
          .order-row { grid-template-columns: 1fr !important; gap: 10px !important; }
          .order-meta-row { flex-wrap: wrap !important; }
        }
      `}</style>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Orders</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{orders.length} total orders</p>
        </div>
        <Link to="/admin" style={styles.adminLink}>← Back to Products</Link>
      </div>

      {/* Filter tabs */}
      <div style={styles.filterTabs}>
        <button onClick={() => setFilter('all')} style={{ ...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {}) }}>
          All <span style={styles.filterCount}>{orders.length}</span>
        </button>
        {statusOptions.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ ...styles.filterTab, ...(filter === s ? styles.filterTabActive : {}) }}>
            {s} <span style={styles.filterCount}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading orders…</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
          <p style={{ color: 'var(--muted)' }}>No orders {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => {
            const isExpanded = expandedId === order.id
            const sc = statusColors[order.status]
            return (
              <div key={order.id} className="card" style={styles.orderCard}>
                <div
                  className="order-row order-meta-row"
                  style={styles.orderHeader}
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div>
                    <div style={styles.orderMeta}>Order #{String(order.id).padStart(6, '0')}</div>
                    <div style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div style={styles.customerName}>{order.user?.name}</div>
                    <div style={styles.customerEmail}>{order.user?.email}</div>
                  </div>
                  <div style={styles.orderTotal}>${order.total.toFixed(2)}</div>
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      style={{ ...styles.statusSelect, background: sc.bg, color: sc.color }}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <button style={styles.expandBtn}>{isExpanded ? '▲' : '▼'}</button>
                </div>

                {isExpanded && (
                  <div style={styles.orderDetails}>
                    <div style={styles.detailsGrid}>
                      <div>
                        <div style={styles.detailLabel}>Shipping Address</div>
                        <div style={styles.detailValue}>{order.address}, {order.city} {order.postcode}</div>
                        <div style={styles.detailValue}>{order.country}</div>
                      </div>
                      <div>
                        <div style={styles.detailLabel}>Order Summary</div>
                        <div style={styles.detailValue}>Subtotal: ${order.subtotal.toFixed(2)}</div>
                        <div style={styles.detailValue}>Shipping: ${order.shipping.toFixed(2)}</div>
                      </div>
                    </div>
                    <div style={styles.itemsList}>
                      {order.items.map(item => (
                        <div key={item.id} style={styles.orderItem}>
                          <div style={{ ...styles.itemThumb, background: item.product.bg, overflow: 'hidden' }}>
                            {item.product.image
                              ? <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : item.product.emoji
                            }
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={styles.itemName}>{item.product.name}</div>
                            <div style={styles.itemSub}>Qty: {item.qty} × ${item.price}</div>
                          </div>
                          <div style={styles.itemTotal}>${(item.qty * item.price).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '4px' },
  adminLink: { fontSize: '13px', color: 'var(--muted)' },
  filterTabs: { display: 'flex', gap: '8px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' },
  filterTab: { fontSize: '12px', fontWeight: 500, padding: '7px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--muted)' },
  filterTabActive: { background: 'var(--dark)', color: 'var(--cream)', borderColor: 'var(--dark)' },
  filterCount: { opacity: 0.6, marginLeft: '4px' },
  orderCard: { padding: 0, overflow: 'hidden' },
  orderHeader: { display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr auto', gap: '1rem', alignItems: 'center', padding: '1.2rem 1.5rem', cursor: 'pointer' },
  orderMeta: { fontSize: '13px', fontWeight: 600 },
  orderDate: { fontSize: '12px', color: 'var(--muted)' },
  customerName: { fontSize: '13px', fontWeight: 500 },
  customerEmail: { fontSize: '12px', color: 'var(--muted)' },
  orderTotal: { fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700 },
  statusSelect: { fontSize: '11px', fontWeight: 600, padding: '6px 10px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' },
  expandBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '12px' },
  orderDetails: { borderTop: '1px solid var(--border)', padding: '1.2rem 1.5rem', background: 'var(--cream)' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.2rem' },
  detailLabel: { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '6px' },
  detailValue: { fontSize: '13px', color: 'var(--dark)', marginBottom: '2px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '1rem' },
  orderItem: { display: 'flex', gap: '12px', alignItems: 'center' },
  itemThumb: { width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 },
  itemName: { fontSize: '13px', fontWeight: 500 },
  itemSub: { fontSize: '12px', color: 'var(--muted)' },
  itemTotal: { fontSize: '13px', fontWeight: 500 },
}
