export default function AboutPage() {
  const values = [
    { emoji: '🌿', title: 'Sustainability', desc: 'Every product is made with sustainable materials and ethical production practices. We believe beautiful things should not cost the earth.' },
    { emoji: '✋', title: 'Craftsmanship', desc: 'We work directly with skilled artisans around the world, ensuring fair wages and preserving traditional craft techniques.' },
    { emoji: '♾️', title: 'Longevity', desc: 'We design for longevity, not trends. Every piece is made to last a lifetime and become more beautiful with age.' },
    { emoji: '🤝', title: 'Community', desc: 'We believe in building meaningful relationships with our makers, customers, and the communities we touch along the way.' },
  ]

  const team = [
    { name: 'Sarah Chen', role: 'Founder & Creative Director', emoji: '👩‍🎨', bio: 'Former architect with a passion for objects that tell stories.' },
    { name: 'James Okafor', role: 'Head of Product', emoji: '👨‍💼', bio: 'Sourcing expert who travels the world to find exceptional makers.' },
    { name: 'Mia Santos', role: 'Lead Designer', emoji: '👩‍💻', bio: 'Industrial designer focused on the intersection of beauty and function.' },
  ]

  const stats = [
    { num: '2019', label: 'Founded' },
    { num: '180+', label: 'Products' },
    { num: '40+', label: 'Artisan Partners' },
    { num: '12k+', label: 'Happy Customers' },
  ]

  return (
    <div className="page">
      <style>{`
        .about-stats { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--border); }
        .about-stat { text-align: center; padding: 2rem 1rem; border-right: 1px solid var(--border); }
        .about-story-grid { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .about-values-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .about-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 639px) {
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .about-stat { padding: 1.2rem 0.5rem !important; }
          .about-story-grid { grid-template-columns: 1fr !important; padding: 2.5rem 1.2rem !important; gap: 1.5rem !important; }
          .about-story-visual { display: none !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
          .about-team-grid { grid-template-columns: 1fr !important; }
          .about-hero { padding: 3rem 1.2rem !important; }
          .about-values-inner { padding: 2.5rem 1.2rem !important; }
          .about-team-inner { padding: 2.5rem 1.2rem !important; }
          .about-cta { padding: 3rem 1.2rem !important; }
        }
      `}</style>

      {/* Hero */}
      <div className="about-hero" style={styles.hero}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={styles.heroLabel}>Our Story</div>
          <h1 style={styles.heroTitle}>
            We believe your home should tell<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>your story</em>
          </h1>
          <p style={styles.heroDesc}>
            Maison was founded in 2019 with a simple belief — that the objects we surround ourselves with should be beautiful, purposeful, and made to last.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        {stats.map(s => (
          <div key={s.label} className="about-stat">
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="about-story-grid">
        <div>
          <div style={styles.sectionLabel}>How it started</div>
          <h2 style={styles.sectionTitle}>From a small studio to your home</h2>
          <p style={styles.bodyText}>
            It started with a frustration. Our founder Sarah was renovating her apartment and couldn't find homeware that was both beautiful and responsibly made.
          </p>
          <p style={styles.bodyText}>
            So she started reaching out to artisans directly — ceramicists in Portugal, weavers in Oaxaca, brass workers in India — and Maison was born.
          </p>
        </div>
        <div className="about-story-visual" style={{ display: 'grid', gap: '16px' }}>
          <div style={styles.storyCard}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏺</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 600 }}>Made by hand</div>
            <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>Every piece crafted with care</div>
          </div>
          <div style={styles.storyCard}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 600 }}>15 countries</div>
            <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>Global network of makers</div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: 'var(--dark)' }}>
        <div className="about-values-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ ...styles.sectionLabel, color: 'var(--accent)' }}>What we stand for</div>
            <h2 style={{ ...styles.sectionTitle, color: 'var(--cream)' }}>Our Values</h2>
          </div>
          <div className="about-values-grid">
            {values.map(v => (
              <div key={v.title} style={styles.valueCard}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{v.emoji}</div>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="about-team-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={styles.sectionLabel}>The people behind Maison</div>
          <h2 style={styles.sectionTitle}>Meet the Team</h2>
        </div>
        <div className="about-team-grid">
          {team.map(member => (
            <div key={member.name} style={styles.teamCard}>
              <div style={styles.teamAvatar}>{member.emoji}</div>
              <h3 style={styles.teamName}>{member.name}</h3>
              <div style={styles.teamRole}>{member.role}</div>
              <p style={styles.teamBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta" style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to find your perfect piece?</h2>
        <p style={styles.ctaDesc}>Browse our full collection of handcrafted homeware.</p>
        <a href="/shop" className="btn btn-dark">Shop Now →</a>
      </div>
    </div>
  )
}

const styles = {
  hero: { background: 'var(--cream)', padding: '5rem 2rem', borderBottom: '1px solid var(--border)' },
  heroLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.2, fontWeight: 700, marginBottom: '1.5rem' },
  heroDesc: { color: 'var(--muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto' },
  statNum: { fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' },
  statLabel: { fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  sectionLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.8rem' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 },
  bodyText: { color: 'var(--muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '1rem' },
  storyCard: { background: 'var(--cream)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' },
  valueCard: { background: 'rgba(247,244,239,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(247,244,239,0.1)' },
  valueTitle: { fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--cream)', marginBottom: '0.8rem' },
  valueDesc: { color: 'rgba(247,244,239,0.6)', fontSize: '13px', lineHeight: 1.7 },
  teamCard: { background: 'var(--cream)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' },
  teamAvatar: { fontSize: '2.5rem', width: '64px', height: '64px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  teamName: { fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' },
  teamRole: { fontSize: '11px', color: 'var(--accent)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8rem' },
  teamBio: { color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6 },
  cta: { background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '4rem 2rem', textAlign: 'center' },
  ctaTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, marginBottom: '0.8rem' },
  ctaDesc: { color: 'var(--muted)', marginBottom: '2rem', fontSize: '15px' },
}
