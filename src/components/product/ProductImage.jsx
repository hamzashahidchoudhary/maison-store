// Shows real image if available, falls back to emoji
export default function ProductImage({ product, height = '220px', fontSize = '3.5rem' }) {
  return (
    <div style={{ height, background: product.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize }}>{product.emoji}</span>
      )}
    </div>
  )
}
