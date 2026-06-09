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
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroLabel}>Our Story</div>
          <h1 style={styles.heroTitle}>
            We believe your home should tell<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>your story</em>
          </h1>
          <p style={styles.heroDesc}>
            Maison was founded in 2019 with a simple belief — that the objects we surround ourselves with should be beautiful, 
            purposeful, and made to last. We work with artisans across the globe to bring you pieces that carry meaning.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {stats.map(s => (
          <div key={s.label} style={styles.stat}>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <section style={styles.section}>
        <div style={styles.storyGrid}>
          <div>
            <div style={styles.sectionLabel}>How it started</div>
            <h2 style={styles.sectionTitle}>From a small studio to your home</h2>
            <p style={styles.bodyText}>
              It started with a frustration. Our founder Sarah was renovating her apartment and couldn't find homeware that was 
              both beautiful and responsibly made. Everything was either mass-produced and soulless, or handmade but wildly expensive.
            </p>
            <p style={styles.bodyText}>
              So she started reaching out to artisans directly — ceramicists in Portugal, weavers in Oaxaca, brass workers in 
              India — and Maison was born. Today we work with over 40 maker partners across 15 countries, bringing their 
              craft directly to homes around the world.
            </p>
          </div>
          <div style={styles.storyVisual}>
            <div style={styles.storyCard1}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏺</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 600 }}>Made by hand</div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>Every piece crafted with care</div>
            </div>
            <div style={styles.storyCard2}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 600 }}>15 countries</div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>Global network of makers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ ...styles.section, background: 'var(--dark)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ ...styles.sectionLabel, color: 'var(--accent)' }}>What we stand for</div>
            <h2 style={{ ...styles.sectionTitle, color: 'var(--cream)' }}>Our Values</h2>
          </div>
          <div style={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} style={styles.valueCard}>
                <div style={styles.valueEmoji}>{v.emoji}</div>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={styles.section}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={styles.sectionLabel}>The people behind Maison</div>
            <h2 style={styles.sectionTitle}>Meet the Team</h2>
          </div>
          <div style={styles.teamGrid}>
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
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to find your perfect piece?</h2>
        <p style={styles.ctaDesc}>Browse our full collection of handcrafted homeware.</p>
        <a href="/shop" className="btn btn-dark" style={{ display: 'inline-block' }}>Shop Now →</a>
      </section>
    </div>
  )
}

const styles = {
  hero: { background: 'var(--cream)', padding: '5rem 2rem', borderBottom: '1px solid var(--border)' },
  heroInner: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  heroLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.2, fontWeight: 700, marginBottom: '1.5rem' },
  heroDesc: { color: 'var(--muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--border)' },
  stat: { textAlign: 'center', padding: '2.5rem 1rem', borderRight: '1px solid var(--border)' },
  statNum: { fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  section: { padding: '0' },
  storyGrid: { maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' },
  sectionLabel: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.8rem' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 },
  bodyText: { color: 'var(--muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '1rem' },
  storyVisual: { display: 'grid', gap: '16px' },
  storyCard1: { background: 'var(--cream)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)' },
  storyCard2: { background: 'var(--cream)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)' },
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '24px' },
  valueCard: { background: 'rgba(247,244,239,0.05)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(247,244,239,0.1)' },
  valueEmoji: { fontSize: '2rem', marginBottom: '1rem' },
  valueTitle: { fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '0.8rem' },
  valueDesc: { color: 'rgba(247,244,239,0.6)', fontSize: '14px', lineHeight: 1.7 },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' },
  teamCard: { background: 'var(--cream)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)', textAlign: 'center' },
  teamAvatar: { fontSize: '3rem', marginBottom: '1rem', width: '72px', height: '72px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  teamName: { fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' },
  teamRole: { fontSize: '12px', color: 'var(--accent)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8rem' },
  teamBio: { color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6 },
  cta: { background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '5rem 2rem', textAlign: 'center' },
  ctaTitle: { fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem' },
  ctaDesc: { color: 'var(--muted)', marginBottom: '2rem', fontSize: '15px' },
}
