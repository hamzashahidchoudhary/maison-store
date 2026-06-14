import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { ordersAPI } from '@/lib/api'

const steps = ['Shipping', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    address: '', city: '', postcode: '', country: '',
    paymentMethod: 'cod',
  })

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const shipping = totalPrice >= 75 ? 0 : 8.95
  const total = totalPrice + shipping

  const handleContinueToPayment = () => {
    setFieldError('')
    if (!form.name.trim()) return setFieldError('Please enter your full name.')
    if (!form.email.trim()) return setFieldError('Please enter your email.')
    if (!form.address.trim()) return setFieldError('Please enter your address.')
    if (!form.city.trim()) return setFieldError('Please enter your city.')
    if (!form.postcode.trim()) return setFieldError('Please enter your postcode.')
    if (!form.country.trim()) return setFieldError('Please enter your country.')
    setStep(1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const order = await ordersAPI.create({
        items: items.map(i => ({ id: i.id, qty: i.qty, price: i.price })),
        subtotal: totalPrice,
        shipping,
        total,
        address: {
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          postcode: form.postcode,
          country: form.country,
        }
      })
      clearCart()
      navigate('/orders', { state: { newOrder: order.id } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '1rem' }}>Your cart is empty</h2>
      <Link to="/" className="btn btn-dark">Continue Shopping</Link>
    </div>
  )

  return (
    <div className="page" style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem' }}>
      <Link to="/" style={styles.back}>← Continue shopping</Link>
      <h1 style={styles.pageTitle}>Checkout</h1>

      <div style={styles.steps}>
        {steps.map((s, i) => (
          <div key={s} style={styles.stepItem}>
            <div style={{ ...styles.stepDot, background: i <= step ? 'var(--dark)' : 'var(--border)', color: i <= step ? 'var(--cream)' : 'var(--muted)' }}>{i + 1}</div>
            <span style={{ fontSize: '13px', color: i <= step ? 'var(--dark)' : 'var(--muted)', fontWeight: i === step ? 500 : 400 }}>{s}</span>
            {i < steps.length - 1 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div style={styles.layout}>
        <div>
          {step === 0 && (
            <div className="card">
              <h2 style={styles.sectionTitle}>Shipping Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Full Name</label>
                  <input className="input" value={form.name} onChange={update('name')} placeholder="Jane Smith" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={update('email')} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Address</label>
                  <input className="input" value={form.address} onChange={update('address')} placeholder="123 Main Street" />
                </div>
                <div className="form-group">
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={update('city')} placeholder="London" />
                </div>
                <div className="form-group">
                  <label className="label">Postcode</label>
                  <input className="input" value={form.postcode} onChange={update('postcode')} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Country</label>
                  <input className="input" value={form.country} onChange={update('country')} placeholder="United Kingdom" />
                </div>
              </div>
              {fieldError && <div style={styles.fieldError}>{fieldError}</div>}
              <button style={styles.nextBtn} onClick={handleContinueToPayment}>Continue to Payment →</button>
            </div>
          )}

          {step === 1 && (
            <div className="card">
              <h2 style={styles.sectionTitle}>Payment Method</h2>

              <div style={styles.codCard}>
                <div style={styles.codIcon}>💵</div>
                <div>
                  <div style={styles.codTitle}>Cash on Delivery</div>
                  <div style={styles.codDesc}>Pay with cash when your order arrives at your door. No card required.</div>
                </div>
                <div style={styles.codCheck}>✓</div>
              </div>

              <div style={styles.codInfo}>
                <div style={styles.codInfoItem}>📦 Your order will be prepared and shipped</div>
                <div style={styles.codInfoItem}>🚚 Pay the delivery person when it arrives</div>
                <div style={styles.codInfoItem}>✅ No online payment needed</div>
              </div>

              <div style={styles.btnRow}>
                <button style={styles.backBtn} onClick={() => setStep(0)}>← Back</button>
                <button style={styles.nextBtn} onClick={() => setStep(2)}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card">
              <h2 style={styles.sectionTitle}>Confirm Your Order</h2>
              <div style={styles.confirmSection}>
                <div style={styles.confirmLabel}>Shipping to</div>
                <div style={styles.confirmValue}>{form.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '14px' }}>{form.address}, {form.city} {form.postcode}</div>
              </div>
              <div style={styles.confirmSection}>
                <div style={styles.confirmLabel}>Payment Method</div>
                <div style={styles.confirmValue}>💵 Cash on Delivery</div>
                <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Pay when your order arrives</div>
              </div>
              {error && <div style={styles.errorBox}>{error}</div>}
              <div style={styles.btnRow}>
                <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                <button style={{ ...styles.nextBtn, opacity: loading ? 0.7 : 1 }} onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing order…' : 'Place Order →'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <h2 style={styles.sectionTitle}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1rem' }}>
              {items.map(item => (
                <div key={item.id} style={styles.summaryItem}>
                  <div style={{ ...styles.summaryIcon, background: item.bg }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div style={styles.summaryRow}><span style={{ color: 'var(--muted)' }}>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div style={styles.summaryRow}>
              <span style={{ color: 'var(--muted)' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? '#4CAF50' : 'inherit' }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping === 0 && <div style={{ fontSize: '12px', color: '#4CAF50', marginBottom: '8px' }}>🎉 You qualify for free shipping!</div>}
            <hr className="divider" />
            <div style={{ ...styles.summaryRow, fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  fieldError: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '13px', marginBottom: '1rem' },
  codCard: { display: 'flex', alignItems: 'center', gap: '16px', background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.2rem' },
  codIcon: { fontSize: '2rem', flexShrink: 0 },
  codTitle: { fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' },
  codDesc: { fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 },
  codCheck: { marginLeft: 'auto', background: '#22C55E', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 },
  codInfo: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem', padding: '1rem', background: 'var(--cream)', borderRadius: '10px' },
  codInfoItem: { fontSize: '13px', color: 'var(--muted)' },
  pageTitle: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '2.5rem' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1 },
  stepDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, flexShrink: 0 },
  stepLine: { flex: 1, height: '1px', background: 'var(--border)', margin: '0 8px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.2rem' },
  stripeNote: { background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '12px 14px', fontSize: '13px', color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: 1.5 },
  nextBtn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', width: '100%', marginTop: '0.5rem' },
  backBtn: { background: 'transparent', color: 'var(--dark)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '0.5rem' },
  confirmSection: { marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border)' },
  confirmLabel: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '4px' },
  confirmValue: { fontSize: '15px', fontWeight: 500 },
  errorBox: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '13px', marginBottom: '1rem' },
  summaryItem: { display: 'flex', gap: '10px', alignItems: 'center' },
  summaryIcon: { width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
}
