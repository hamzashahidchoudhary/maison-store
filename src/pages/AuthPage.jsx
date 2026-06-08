import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login, register, error, loading, setError } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/'

  const update = (field) => (e) => {
    setError('')
    setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (mode === 'login') {
      const ok = await login({ email: form.email, password: form.password })
      if (ok) navigate(next)
    } else {
      if (!form.name.trim()) { setError('Please enter your name.'); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
      const ok = await register(form)
      if (ok) navigate(next)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className="page" style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.logo}>Ma<span style={{ color: 'var(--accent)' }}>is</span>on</Link>
          <h1 style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p style={styles.subtitle}>
            {mode === 'login' ? 'Sign in to your account to continue.' : 'Join us for a better shopping experience.'}
          </p>
        </div>

        {/* Toggle */}
        <div style={styles.toggle}>
          <button
            style={{ ...styles.toggleBtn, ...(mode === 'login' ? styles.toggleActive : {}) }}
            onClick={() => { setMode('login'); setError('') }}
          >Sign in</button>
          <button
            style={{ ...styles.toggleBtn, ...(mode === 'register' ? styles.toggleActive : {}) }}
            onClick={() => { setMode('register'); setError('') }}
          >Create account</button>
        </div>

        {/* Form */}
        <div style={{ marginTop: '1.5rem' }}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={update('name')}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          <div className="form-group">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              value={form.password}
              onChange={update('password')}
              onKeyDown={handleKeyDown}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in →' : 'Create account →'}
          </button>
        </div>

        <p style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            style={styles.switchBtn}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: 'white', borderRadius: '20px',
    border: '1px solid var(--border)', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
  },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: {
    fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700,
    textDecoration: 'none', color: 'var(--dark)', display: 'block', marginBottom: '1.2rem',
  },
  title: { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' },
  subtitle: { color: 'var(--muted)', fontSize: '14px' },
  toggle: {
    display: 'flex', gap: '4px', background: 'var(--cream)',
    padding: '4px', borderRadius: 'var(--radius-full)',
  },
  toggleBtn: {
    flex: 1, padding: '8px', borderRadius: 'var(--radius-full)',
    border: 'none', background: 'transparent', fontFamily: 'var(--sans)',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--muted)',
    transition: 'all 0.2s',
  },
  toggleActive: {
    background: 'white', color: 'var(--dark)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  error: {
    background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
    borderRadius: 'var(--radius)', padding: '10px 14px',
    fontSize: '13px', marginBottom: '1rem',
  },
  submitBtn: {
    width: '100%', background: 'var(--dark)', color: 'var(--cream)',
    border: 'none', padding: '13px', borderRadius: 'var(--radius-full)',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginTop: '0.5rem',
  },
  switchText: { textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '1.2rem' },
  switchBtn: {
    background: 'none', border: 'none', color: 'var(--dark)',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '13px',
    textDecoration: 'underline',
  },
}
