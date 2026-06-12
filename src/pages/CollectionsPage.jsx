import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/categories';

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  return (
    <div className="collections-page" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        className="collections-hero"
        style={{
          position: 'relative',
          height: '60vh',
          overflow: 'hidden',
        }}
      >
        {/* Background images — one per category, only active one visible */}
        {CATEGORIES.map((cat) => (
          <img
            key={cat.id}
            src={cat.image}
            alt={cat.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activeCategory.id === cat.id ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
        ))}

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: activeCategory.overlayColor,
            transition: 'background-color 0.6s ease',
            zIndex: 1,
          }}
        />

        {/* Hero text */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '0 1rem',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: activeCategory.lightBg ? '#4a4a4a' : 'rgba(255,255,255,0.7)',
              marginBottom: '0.75rem',
              transition: 'color 0.4s ease',
            }}
          >
            Maison Collections
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              color: activeCategory.lightBg ? '#1a1a1a' : '#ffffff',
              marginBottom: '1rem',
              transition: 'color 0.4s ease',
            }}
          >
            {activeCategory.name}
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: activeCategory.lightBg ? '#666' : 'rgba(255,255,255,0.75)',
              maxWidth: '480px',
              lineHeight: 1.6,
              transition: 'color 0.4s ease',
            }}
          >
            {activeCategory.description}
          </p>
        </div>
      </div>

      {/* Category Tab Navigation */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1px solid #e5e5e5',
          backgroundColor: '#fff',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat)}
            style={{
              flex: '0 0 auto',
              padding: '1rem 1.5rem',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              borderBottom: activeCategory.id === cat.id ? '2px solid #1a1a1a' : '2px solid transparent',
              color: activeCategory.id === cat.id ? '#1a1a1a' : '#888',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products / Browse Section */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#1a1a1a',
            }}
          >
            {activeCategory.name}
          </h2>
          <Link
            to={`/shop?category=${activeCategory.id}`}
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderBottom: '1px solid #1a1a1a',
              paddingBottom: '2px',
            }}
          >
            View All
          </Link>
        </div>

        {/* Category grid preview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Placeholder cards — replace with real product fetching if needed */}
          {[1, 2, 3, 4].map((i) => (
            <Link
              key={i}
              to={`/shop?category=${activeCategory.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  aspectRatio: '3/4',
                  backgroundColor: '#f5f5f5',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={activeCategory.image}
                  alt={activeCategory.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ padding: '0.75rem 0' }}>
                <p style={{ fontSize: '0.85rem', color: '#888', letterSpacing: '0.05em' }}>
                  {activeCategory.name}
                </p>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: '#1a1a1a',
                    marginTop: '0.25rem',
                  }}
                >
                  Shop the Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
