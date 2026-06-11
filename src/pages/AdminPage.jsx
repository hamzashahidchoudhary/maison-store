import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { productsAPI } from '@/lib/api'
import { uploadImage } from '@/lib/cloudinary'
import { categories } from '@/lib/categories'
import { Link } from 'react-router-dom'

const emptyForm = {
  name: '', description: '', price: '', oldPrice: '',
  category: 'ceramics', emoji: '🏺', bg: '#F0EAE0',
  badge: '', stock: 100, rating: 4.5, reviews: 0,
  details: '', image: '',
}

const badges = ['', 'new', 'sale']
const bgColors = ['#F0EAE0', '#EDE8E0', '#E8E0D5', '#F5EED8', '#EDE5D8', '#EAE0D0', '#F2E8D0', '#E5DDD0']

export default function AdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = () => {
    productsAPI.getAll('all')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, image: url }))
    } catch (err) {
      alert('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      ...product,
      details: Array.isArray(product.details) ? product.details.join('\n') : product.details,
      oldPrice: product.oldPrice || '',
      badge: product.badge || '',
      image: product.image || '',
    })
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert('Please fill in at least the name and price.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        badge: form.badge || null,
        image: form.image || null,
        details: form.details.split('\n').filter(d => d.trim()),
      }
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const token = localStorage.getItem('maison_token')
      const url = editingId ? `${base}/products/${editingId}` : `${base}/products`
      const method = editingId ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      setSuccessMsg(editingId ? 'Product updated!' : 'Product created!')
      loadProducts()
      handleCancel()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(id)
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const token = localStorage.getItem('maison_token')
      await fetch(`${base}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(prev => prev.filter(p => p.id !== id))
      setSuccessMsg('Product deleted.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally {
      setDeletingId(null)
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

  return (
    <div className="page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Admin Panel</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{products.length} products in store</p>
        </div>
        <button style={styles.newBtn} onClick={handleNew}>+ Add New Product</button>
      </div>

      {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

      {/* Product Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editingId ? 'Edit Product' : 'New Product'}</h2>

          <div style={styles.formGrid}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="label">Product Name</label>
              <input className="input" value={form.name} onChange={update('name')} placeholder="e.g. Stoneware Mug Set" />
            </div>

            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="label">Description</label>
              <textarea className="input" value={form.description} onChange={update('description')} placeholder="Product description..." rows={3} style={{ resize: 'vertical' }} />
            </div>

            <div className="form-group">
              <label className="label">Price ($)</label>
              <input className="input" type="number" value={form.price} onChange={update('price')} placeholder="48" />
            </div>

            <div className="form-group">
              <label className="label">Old Price ($) — optional</label>
              <input className="input" type="number" value={form.oldPrice} onChange={update('oldPrice')} placeholder="Leave blank if no sale" />
            </div>

            <div className="form-group">
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={update('category')}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Badge</label>
              <select className="input" value={form.badge} onChange={update('badge')}>
                {badges.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
              </select>
            </div>

            {/* Image Upload */}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="label">Product Image</label>
              <div style={styles.imageUploadArea}>
                {form.image ? (
                  <div style={styles.imagePreviewWrap}>
                    <img src={form.image} alt="Product" style={styles.imagePreview} />
                    <button style={styles.removeImageBtn} onClick={() => setForm(f => ({ ...f, image: '' }))}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder} onClick={() => fileInputRef.current?.click()}>
                    {uploading ? (
                      <div>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                        <p style={styles.uploadText}>Uploading to Cloudinary...</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</div>
                        <p style={styles.uploadText}>Click to upload image</p>
                        <p style={styles.uploadSubtext}>JPG, PNG, WebP — max 10MB</p>
                      </div>
                    )}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                {!form.image && !uploading && (
                  <button style={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>Choose Image</button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Emoji (fallback)</label>
              <input className="input" value={form.emoji} onChange={update('emoji')} placeholder="🏺" />
            </div>

            <div className="form-group">
              <label className="label">Stock</label>
              <input className="input" type="number" value={form.stock} onChange={update('stock')} />
            </div>

            <div className="form-group">
              <label className="label">Background Color</label>
              <div style={styles.colorPicker}>
                {bgColors.map(color => (
                  <button key={color} onClick={() => setForm(f => ({ ...f, bg: color }))}
                    style={{ ...styles.colorSwatch, background: color, border: form.bg === color ? '3px solid var(--dark)' : '2px solid transparent' }} />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Preview</label>
              <div style={{ ...styles.preview, background: form.bg }}>
                {form.image
                  ? <img src={form.image} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                  : <span style={{ fontSize: '2.5rem' }}>{form.emoji}</span>
                }
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="label">Product Details (one per line)</label>
              <textarea className="input" value={form.details} onChange={update('details')}
                placeholder={"Set of 2 mugs\n350ml capacity\nDishwasher safe"} rows={4} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            <button style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading products…</div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Rating</span>
            <span>Actions</span>
          </div>
          {products.map(product => (
            <div key={product.id} style={styles.tableRow}>
              <div style={styles.productCell}>
                <div style={{ ...styles.productThumb, background: product.bg, overflow: 'hidden' }}>
                  {product.image
                    ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    : product.emoji
                  }
                </div>
                <div>
                  <div style={styles.productName}>{product.name}</div>
                  {product.badge && <span className={`badge badge-${product.badge}`}>{product.badge}</span>}
                </div>
              </div>
              <span style={styles.cell}>{product.category}</span>
              <span style={styles.cell}>
                ${product.price}
                {product.oldPrice && <span style={{ color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '6px', fontSize: '12px' }}>${product.oldPrice}</span>}
              </span>
              <span style={styles.cell}>{product.stock}</span>
              <span style={styles.cell}>{product.rating}★ ({product.reviews})</span>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => handleEdit(product)}>Edit</button>
                <button style={{ ...styles.deleteBtn, opacity: deletingId === product.id ? 0.5 : 1 }}
                  onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>
                  {deletingId === product.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  pageTitle: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '4px' },
  newBtn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '11px 22px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  successBanner: { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '1.5rem', fontSize: '14px', fontWeight: 500 },
  formCard: { background: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' },
  formTitle: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' },
  imageUploadArea: { display: 'flex', flexDirection: 'column', gap: '10px' },
  imagePreviewWrap: { display: 'inline-block' },
  imagePreview: { width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)', display: 'block' },
  removeImageBtn: { marginTop: '8px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--sans)' },
  uploadPlaceholder: { border: '2px dashed var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--cream)' },
  uploadText: { fontSize: '14px', fontWeight: 500, color: 'var(--dark)', marginBottom: '4px' },
  uploadSubtext: { fontSize: '12px', color: 'var(--muted)' },
  uploadBtn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '9px 20px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start' },
  colorPicker: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' },
  colorSwatch: { width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' },
  preview: { height: '80px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' },
  cancelBtn: { background: 'transparent', color: 'var(--dark)', border: '1px solid var(--border)', padding: '10px 22px', borderRadius: 'var(--radius-full)', fontSize: '14px', cursor: 'pointer' },
  saveBtn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '10px 22px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  table: { background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 1fr 1fr', gap: '1rem', padding: '1rem 1.5rem', background: 'var(--cream)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', borderBottom: '1px solid var(--border)' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 1fr 1fr', gap: '1rem', padding: '1rem 1.5rem', alignItems: 'center', borderBottom: '1px solid var(--border)' },
  productCell: { display: 'flex', gap: '12px', alignItems: 'center' },
  productThumb: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 },
  productName: { fontSize: '13px', fontWeight: 500, marginBottom: '3px' },
  cell: { fontSize: '13px', color: 'var(--dark)' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--dark)', padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--sans)' },
  deleteBtn: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--sans)' },
}
