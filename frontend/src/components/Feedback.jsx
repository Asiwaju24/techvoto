/**
 * Full-section loading skeleton / spinner.
 * Pass count to render multiple skeleton cards.
 */
export function Spinner({ size = 32 }) {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'4rem' }}>
      <div style={{
        width: size, height: size,
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}/>
    </div>
  )
}

export function SkeletonCard({ height = 240 }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      height,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}/>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
      <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>⚠️</div>
      <p style={{ color:'var(--text-muted)', marginBottom:'1.5rem' }}>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>Try Again</button>
      )}
    </div>
  )
}
