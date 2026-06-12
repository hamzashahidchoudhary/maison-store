import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../lib/categories';

export default function HomePage() {
  const [active, setActive] = useState(categories[0]);

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        {categories.map((cat) => (
          <img
            key={cat.id}
            src={cat.image}
            alt={cat.label}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: active.id === cat.id ? 1 : 0,
              transition: 'opacity 0.7s ease',
            }}
          />
        ))}

        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: active.overlayColor,
          transition: 'background-color 0.7s ease',
          zIndex: 1,
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', textAlign: 'center', padding: '0 1.5rem',
        }}>
          <p style={{
            fontSize: '0.7rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', marginBottom: '0.75rem',
            color: active.lightBg ? '#555' : 'rgba(255,255,255,0.65)',
            transition: 'color 0.5s ease',
          }}>
            {active.tag}
          </p>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 200,
            letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: '1rem',
            color: active.lightBg ? '#1a1a1a' : '#ffffff',
            transition: 'color 0.5s ease',
          }}>
            {active.label}
          </h1>
          <p style={{
            fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7,
            marginBottom: '0.5rem',
            color: active.lightBg ? '#666' : 'rgba(255,255,255,0.8)',
            transition: 'color 0.5s ease',
          }}>
            {active.subtitle}
          </p>
          <p style={{
            fontSize: '0.9rem', maxWidth: '520px', lineHeight: 1.7,
            marginBottom: '2.5rem',
            color: active.lightBg ? '#888' : 'rgba(255,255,255,0.65)',
            transition: 'color 0.5s ease',
          }}>
            {active.desc}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to={`/shop?category=${active.id}`}
              style={{
                padding: '0.9rem 2.5rem',
                backgroundColor: active.lightBg ? '#1a1a1a' : '#ffffff',
                color: active.lightBg ? '#ffffff' : '#1a1a1a',
                textDecoration: 'none', fontSize: '0.78rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                transition: 'all 0.3s ease',
              }}
            >
              Shop {active.label}
            </Link>
            <Link
              to="/collections"
              style={{
                padding: '0.9rem 2.5rem',
                border: `1px solid ${active.lightBg ? '#1a1a1a' : '#ffffff'}`,
                color: active.lightBg ? '#1a1a1a' : '#ffffff',
                textDecoration: 'none', fontSize: '0.78rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                transition: 'all 0.3s ease',
              }}
            >
              All Collections
            </Link>
          </div>

          {/* ── Swatches ── */}
          <div style={{
            position: 'absolute', bottom: '2.5rem',
            left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '0.6rem', zIndex: 3,
          }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat)}
                title={cat.label}
                style={{
                  width: active.id === cat.id ? '2.2rem' : '0.55rem',
                  height: '0.55rem',
                  borderRadius: '999px',
                  backgroundColor: active.lightBg
                    ? (active.id === cat.id ? '#1a1a1a' : 'rgba(0,0,0,0.3)')
                    : (active.id === cat.id ? '#ffffff' : 'rgba(255,255,255,0.4)'),
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.35s ease', flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '0.75rem' }}>
              Explore
            </p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, letterSpacing: '0.05em', color: '#1a1a1a' }}>
              Shop by Collection
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', aspectRatio: '1 / 1.2', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.07)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.18)',
                    display: 'flex', alignItems: 'flex-end', padding: '1.25rem',
                  }}>
                    <p style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', fontWeight: 400 }}>
                      {cat.label}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.25rem' }}>
            Our Philosophy
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, letterSpacing: '0.04em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
            Objects with intention
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#666', marginBottom: '2rem' }}>
            Maison brings together artisans and makers who believe that everyday objects deserve
            care and craft. Each piece is chosen for its materials, its longevity, and the quiet
            pleasure it brings to a home.
          </p>
          <Link
            to="/about"
            style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '3px' }}
          >
            Our Story
          </Link>
        </div>
      </section>

    </div>
  );
}
