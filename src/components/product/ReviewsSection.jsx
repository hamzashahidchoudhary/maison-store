import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { reviewsAPI } from '@/lib/api'
import { Link } from 'react-router-dom'

export default function ReviewsSection({ productId, onReviewChange }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => { loadReviews() }, [productId])

  const loadReviews = () => {
    setLoading(true)
    reviewsAPI.getAll(productId)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const hasReviewed = user && reviews.some(r => r.user?.name === user.name)

  const handleSubmit = async () => {
    setError('')
    if (!comment.trim()) { setError('Please write a comment.'); return }
    setSubmitting(true)
    try {
      await reviewsAPI.create(productId, { rating, comment })
      setComment('')
      setRating(5)
      setShowForm(false)
      loadReviews()
      onReviewChange?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return
    setDeletingId(reviewId)
    try {
      await reviewsAPI.delete(productId, reviewId)
      loadReviews()
      onReviewChange?.()
    } finally {
      setDeletingId(null)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Customer Reviews</h2>
          {reviews.length > 0 && (
            <div style={styles.summary}>
              <span style={styles.avgStars}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
              <span style={styles.avgNum}>{avgRating}</span>
              <span style={styles.count}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
        {user ? (
          !hasReviewed && (
            <button style={styles.writeBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Write a Review'}
            </button>
          )
        ) : (
          <Link to="/login" style={styles.signInLink}>Sign in to write a review</Link>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Your Rating</label>
            <div style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  style={{ ...styles.starBtn, color: n <= rating ? 'var(--accent)' : '#D8D3C8' }}
                >★</button>
              ))}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Your Review</label>
            <textarea
              className="input"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div style={styles.empty}>Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
          <p style={{ color: 'var(--muted)' }}>No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {reviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewerAvatar}>{review.user?.name?.charAt(0).toUpperCase() || '?'}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.reviewerName}>{review.user?.name || 'Anonymous'}</div>
                  <div style={styles.reviewStars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                </div>
                <div style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
              {(user?.name === review.user?.name || user?.role === 'ADMIN') && (
                <button
                  style={{ ...styles.deleteBtn, opacity: deletingId === review.id ? 0.5 : 1 }}
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  section: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', borderTop: '1px solid var(--border)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px' },
  summary: { display: 'flex', alignItems: 'center', gap: '8px' },
  avgStars: { color: 'var(--accent)', fontSize: '16px' },
  avgNum: { fontSize: '15px', fontWeight: 600 },
  count: { fontSize: '13px', color: 'var(--muted)' },
  writeBtn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' },
  signInLink: { fontSize: '13px', color: 'var(--accent)' },
  form: { background: 'var(--cream)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)', marginBottom: '8px' },
  starPicker: { display: 'flex', gap: '4px' },
  starBtn: { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', padding: 0, lineHeight: 1 },
  error: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '13px', marginBottom: '1rem' },
  submitBtn: { background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '11px 24px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '3rem 1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  reviewCard: { background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.2rem' },
  reviewHeader: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' },
  reviewerAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 },
  reviewerName: { fontSize: '14px', fontWeight: 600 },
  reviewStars: { color: 'var(--accent)', fontSize: '12px', marginTop: '2px' },
  reviewDate: { fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' },
  reviewComment: { fontSize: '14px', color: 'var(--dark)', lineHeight: 1.6, marginBottom: '8px' },
  deleteBtn: { background: 'none', border: 'none', color: '#DC2626', fontSize: '12px', cursor: 'pointer', padding: 0, textDecoration: 'underline' },
}
